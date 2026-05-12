import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot, Send, Plus, Trash2, Landmark, AlertCircle,
  Copy, Check, Sparkles, MessageSquare, ChevronDown, User, PanelLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';

/* ─── Date grouping ─────────────────────────────────────────────────────────── */
const groupByDate = (conversations) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
  const groups = { Today: [], Yesterday: [], 'Previous 7 Days': [], Older: [] };
  for (const conv of conversations) {
    const d = new Date(conv.updated_at || conv.created_at);
    if (d >= today) groups['Today'].push(conv);
    else if (d >= yesterday) groups['Yesterday'].push(conv);
    else if (d >= weekAgo) groups['Previous 7 Days'].push(conv);
    else groups['Older'].push(conv);
  }
  return Object.entries(groups).filter(([, items]) => items.length > 0);
};

/* ─── Markdown renderer ─────────────────────────────────────────────────────── */
const renderMarkdown = (text) => {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Heading 2
    if (line.startsWith('## ')) {
      elements.push(<h3 key={i} className="text-base font-bold text-gray-900 mt-4 mb-1">{parseLine(line.slice(3))}</h3>);
      i++; continue;
    }
    // Heading 1
    if (line.startsWith('# ')) {
      elements.push(<h2 key={i} className="text-lg font-bold text-gray-900 mt-4 mb-2">{parseLine(line.slice(2))}</h2>);
      i++; continue;
    }
    // Bullet list — collect consecutive bullets
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('* ') || lines[i].startsWith('- '))) {
        items.push(<li key={i} className="text-[15px] leading-relaxed text-gray-800">{parseLine(lines[i].slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="list-disc pl-5 my-2 space-y-1">{items}</ul>);
      continue;
    }
    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(<li key={i} className="text-[15px] leading-relaxed text-gray-800">{parseLine(lines[i].replace(/^\d+\.\s/, ''))}</li>);
        i++;
      }
      elements.push(<ol key={`ol-${i}`} className="list-decimal pl-5 my-2 space-y-1">{items}</ol>);
      continue;
    }
    // Code block
    if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]); i++;
      }
      elements.push(
        <pre key={i} className="bg-gray-100 rounded-lg p-3 my-2 text-sm overflow-x-auto font-mono text-gray-800">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      i++; continue;
    }
    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-blue-400 pl-3 my-2 text-gray-600 italic text-[15px]">
          {parseLine(line.slice(2))}
        </blockquote>
      );
      i++; continue;
    }
    // Horizontal rule
    if (line === '---' || line === '***') {
      elements.push(<hr key={i} className="border-gray-200 my-3" />);
      i++; continue;
    }
    // Empty line
    if (!line.trim()) {
      elements.push(<div key={i} className="h-2" />);
      i++; continue;
    }
    // Normal paragraph
    elements.push(<p key={i} className="text-[15px] leading-relaxed text-gray-800">{parseLine(line)}</p>);
    i++;
  }
  return elements;
};

// Inline bold/italic/code/link parser
const parseLine = (text) => {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let last = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[2]) parts.push(<strong key={match.index} className="font-semibold text-gray-900">{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={match.index}>{match[3]}</em>);
    else if (match[4]) parts.push(<code key={match.index} className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono text-blue-700">{match[4]}</code>);
    else if (match[5]) parts.push(<a key={match.index} href={match[6]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{match[5]}</a>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === 'string' ? text : parts;
};

/* ─── Copy button ────────────────────────────────────────────────────────────── */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
      title="Copy"
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
};

/* ─── Typing Indicator ───────────────────────────────────────────────────────── */
const TypingIndicator = () => (
  <div className="flex gap-4 max-w-3xl mx-auto w-full py-2">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow">
      <Sparkles size={14} />
    </div>
    <div className="flex items-center gap-1 pt-2">
      {[0, 200, 400].map((d) => (
        <span key={d} className="w-2 h-2 bg-gray-400 rounded-full inline-block animate-bounce" style={{ animationDelay: `${d}ms` }} />
      ))}
    </div>
  </div>
);

/* ─── Suggestion chips ───────────────────────────────────────────────────────── */
const SUGGESTIONS = [
  { text: 'What schemes am I eligible for?', icon: '🎯' },
  { text: 'Tell me about PM-KISAN', icon: '🌾' },
  { text: 'Scholarship for SC students', icon: '🎓' },
  { text: 'Housing loan for first-time buyers', icon: '🏠' },
  { text: 'Healthcare coverage for my family', icon: '🏥' },
  { text: 'Business loan without collateral', icon: '💼' },
];

/* ─── Main Component ─────────────────────────────────────────────────────────── */
const SmartAssistant = () => {
  const [searchParams] = useSearchParams();
  const schemeIdParam = searchParams.get('schemeId');
  const schemeTitleParam = searchParams.get('schemeTitle');
  const queryParam = searchParams.get('q');

  const {
    conversations, activeConversation, messages,
    isLoadingConversations, isLoadingMessages, isSending, error,
    loadConversations, startConversation, loadConversation,
    archiveConversation, sendMessage, clearError, clearChat,
  } = useChatStore();

  const { isAuthenticated } = useAuthStore();

  const [inputText, setInputText] = useState('');
  const [schemeContext, setSchemeContext] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  useEffect(() => {
    if (isAuthenticated) loadConversations();
  }, [isAuthenticated]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const init = async () => {
      if (schemeIdParam && schemeTitleParam) {
        setSchemeContext({ id: schemeIdParam, title: decodeURIComponent(schemeTitleParam) });
      }
      if (queryParam) {
        const conv = await startConversation(queryParam.slice(0, 60));
        if (conv) await sendMessage(queryParam, null);
      } else if (schemeIdParam && schemeTitleParam) {
        const title = decodeURIComponent(schemeTitleParam);
        const ctx = { id: schemeIdParam, title };
        setSchemeContext(ctx);
        const conv = await startConversation(title);
        if (conv) await sendMessage(`Tell me about "${title}" scheme and whether I might be eligible.`, ctx);
      }
    };
    init();
  }, []);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isSending) return;
    const text = inputText.trim();
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await sendMessage(text, schemeContext);
  }, [inputText, isSending, schemeContext, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTextareaChange = (e) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const handleNewChat = () => { clearChat(); setSchemeContext(null); setInputText(''); };

  const grouped = groupByDate(conversations);
  const formatTime = (d) => d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="flex h-full overflow-hidden bg-white dark:bg-[#13121a] relative">

      {/* ── History Sidebar ───────────────────────────────────────────────── */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 0, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="shrink-0 hidden md:flex flex-col overflow-hidden bg-gray-50 border-r border-gray-200 dark:border-transparent"
        style={{ minWidth: 0 }}
      >
        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-2.5 border-b border-gray-200 dark:border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shadow-lg">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-semibold text-[15px] text-gray-900 dark:text-white">CivicAssist</span>
        </div>

        {/* New Chat */}
        <div className="px-3 mb-2">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/15 border border-gray-200 dark:border-white/10 transition-all text-sm font-medium text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white shadow-sm dark:shadow-none"
          >
            <Plus size={16} /> New chat
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-4 scrollbar-thin">
          {!isAuthenticated ? (
            <div className="px-3 py-6 text-center">
              <MessageSquare size={24} className="text-gray-300 dark:text-blue-300/30 mx-auto mb-2" />
              <p className="text-xs text-gray-500 dark:text-blue-200/40">Sign in to save chat history</p>
            </div>
          ) : isLoadingConversations ? (
            <div className="space-y-1 px-1 py-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 rounded-lg bg-gray-200 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-blue-200/40 px-3 py-4 text-center">No chats yet</p>
          ) : grouped.map(([label, convs]) => (
            <div key={label}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-blue-300/40 px-3 pb-1">{label}</p>
              <div className="space-y-0.5">
                {convs.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group flex items-center gap-1 rounded-xl transition-all ${
                      activeConversation?.id === conv.id
                        ? 'bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400/15'
                        : 'hover:bg-gray-200/50 dark:hover:bg-white/8 border border-transparent'
                    }`}
                  >
                    <button
                      onClick={() => loadConversation(conv.id)}
                      className={`flex-1 text-left px-3 py-2 text-[13px] truncate transition-colors ${
                        activeConversation?.id === conv.id 
                          ? 'text-blue-700 dark:text-white font-medium' 
                          : 'text-gray-600 dark:text-blue-100/70 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {conv.title || 'Untitled'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setArchiveTarget(conv.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 text-gray-400 dark:text-blue-300/40 hover:text-red-500 dark:hover:text-red-400 transition-all rounded-lg"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Main Chat ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-white dark:bg-[#16151f]">

        {/* Header */}
        <header className="h-14 border-b border-gray-100 dark:border-[#2a2840] flex items-center justify-between px-6 shrink-0 dark:bg-[#1c1b26]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors -ml-1"
            >
              <PanelLeft size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-[15px] leading-tight">
                {schemeContext ? schemeContext.title.slice(0, 45) : 'Civic Assistant'}
              </h2>
              <p className="text-[11px] text-gray-400">Powered by Gemini AI</p>
            </div>
          </div>
          {schemeContext && (
            <button
              onClick={() => setSchemeContext(null)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronDown size={13} /> Clear context
            </button>
          )}
        </header>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="bg-red-50 border-b border-red-100 px-6 py-2.5 flex items-center justify-between shrink-0"
            >
              <p className="text-sm text-red-600 flex items-center gap-2"><AlertCircle size={15} /> {error}</p>
              <button onClick={clearError} className="text-xs text-red-400 hover:text-red-600 font-medium">Dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">

          {/* Welcome screen */}
          {messages.length === 0 && !isSending && !isLoadingMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-full px-6 pb-40"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
                <Landmark size={30} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">How can I help you?</h1>
              <p className="text-gray-500 text-center max-w-md mb-10 text-[15px]">
                Discover government schemes, check eligibility, and get guided through applications.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => { setInputText(s.text); textareaRef.current?.focus(); }}
                    className="flex items-start gap-3 text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2a2840] dark:bg-[#1c1b26] hover:border-blue-300 dark:hover:border-violet-500/50 hover:bg-blue-50/50 dark:hover:bg-[#232232] transition-all group shadow-sm"
                  >
                    <span className="text-xl leading-none mt-0.5">{s.icon}</span>
                    <span className="text-sm text-gray-700 dark:text-[#c8c4e8] group-hover:text-blue-700 dark:group-hover:text-violet-300 leading-snug">{s.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading messages */}
          {isLoadingMessages && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                Loading conversation…
              </div>
            </div>
          )}

          {/* Message thread */}
          <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6 pb-44">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                {msg.role === 'user' ? (
                  /* User message — right-aligned pill */
                  <div className="flex justify-end">
                    <div className="flex items-end gap-2 max-w-[75%]">
                      <div>
                        <div className="bg-gray-100 dark:bg-[#232232] rounded-2xl rounded-br-sm px-4 py-3 text-[15px] text-gray-900 dark:text-[#e8e6f8] leading-relaxed">
                          {msg.content}
                        </div>
                        <p className="text-[11px] text-gray-400 text-right mt-1">{formatTime(msg.created_at)}</p>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mb-5">
                        <User size={13} className="text-blue-600" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Assistant message — full width with avatar */
                  <div className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow">
                      <Sparkles size={13} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="prose-like space-y-1">
                        {renderMarkdown(msg.content)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] text-gray-400">{formatTime(msg.created_at)}</span>
                        <CopyButton text={msg.content} />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {isSending && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-[#16151f] via-white/95 dark:via-[#16151f]/90 to-transparent pb-4 pt-8 px-4">
          {schemeContext && (
            <div className="max-w-3xl mx-auto mb-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs text-blue-700">
                <Sparkles size={11} />
                Context: <strong>{schemeContext.title.slice(0, 50)}</strong>
                <button onClick={() => setSchemeContext(null)} className="ml-1 text-blue-400 hover:text-blue-600">×</button>
              </span>
            </div>
          )}
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-white dark:bg-[#1c1b26] border border-gray-200 dark:border-[#2a2840] rounded-2xl shadow-md dark:shadow-black/30 px-4 py-3 focus-within:border-blue-400 dark:focus-within:border-violet-500/70 focus-within:shadow-lg transition-all">
              <textarea
                ref={textareaRef}
                id="chat-input"
                value={inputText}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about government schemes, eligibility, or benefits…"
                className="flex-1 bg-transparent resize-none text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none leading-relaxed max-h-40 min-h-[24px]"
                rows={1}
                disabled={isSending}
              />
              <button
                id="chat-send"
                onClick={handleSend}
                disabled={!inputText.trim() || isSending}
                className={`p-2 rounded-xl transition-all shrink-0 flex items-center justify-center ${
                  inputText.trim() && !isSending
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                {isSending
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Send size={17} />
                }
              </button>
            </div>
            <p className="text-center mt-2 text-[11px] text-gray-400">
              CivicAssist may make mistakes. Verify important information at official government portals.
            </p>
          </div>
        </div>
      </div>

      {/* Archive confirm modal */}
      <AnimatePresence>
        {archiveTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setArchiveTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg text-center mb-1">Delete chat?</h3>
              <p className="text-gray-500 text-sm text-center mb-6">This conversation will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setArchiveTarget(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                  Cancel
                </button>
                <button
                  onClick={async () => { await archiveConversation(archiveTarget); setArchiveTarget(null); }}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartAssistant;
