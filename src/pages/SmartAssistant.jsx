import React, { useState } from 'react';
import { Bot, Paperclip, Mic, Send, MoreVertical, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const SmartAssistant = () => {
  const [inputText, setInputText] = useState('');
  
  const chatHistory = [
    { title: 'Housing Grant Eligibility', date: 'TODAY', active: true },
    { title: 'Small Business Tax Forms', date: 'TODAY', active: false },
    { title: 'Renewing Driver\'s License', date: 'PREVIOUS 7 DAYS', active: false },
    { title: 'Childcare Subsidy Application', date: 'PREVIOUS 7 DAYS', active: false },
    { title: 'Reporting Potholes', date: 'PREVIOUS 7 DAYS', active: false },
  ];

  return (
    <div className="flex h-full bg-white">
      {/* History Sidebar */}
      <div className="w-64 border-r border-border bg-gray-50/50 hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-text-dark">Chat History</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2 px-3">TODAY</p>
            <div className="space-y-1">
              {chatHistory.filter(h => h.date === 'TODAY').map((chat, idx) => (
                <button
                  key={idx}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    chat.active 
                      ? 'bg-gray-200/70 font-medium text-text-dark' 
                      : 'text-text-muted hover:bg-gray-100'
                  }`}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2 px-3">PREVIOUS 7 DAYS</p>
            <div className="space-y-1">
              {chatHistory.filter(h => h.date === 'PREVIOUS 7 DAYS').map((chat, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-gray-100 transition-colors"
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative max-w-4xl mx-auto w-full">
        {/* Chat Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
              <Bot size={22} />
            </div>
            <div>
              <h2 className="font-bold text-text-dark text-lg leading-tight">Civic Assistant</h2>
              <p className="text-xs text-text-muted">Powered by AI • Always here to help</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-text-dark transition-colors">
            <MoreVertical size={20} />
          </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          
          {/* Welcome State (Normally shown when no messages, but included here for UI mockup) */}
          <div className="text-center py-10">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                <Landmark size={32} />
             </div>
             <h1 className="text-3xl font-bold text-text-dark mb-3">How can I assist you today?</h1>
             <p className="text-text-muted max-w-md mx-auto">
               I can help you navigate government services, find eligible schemes, or complete official forms.
             </p>
          </div>

          {/* User Message */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="bg-gray-100 text-text-dark rounded-2xl rounded-tr-sm px-5 py-3 max-w-[80%] shadow-sm">
              <p className="text-sm md:text-base">
                I'm looking to buy my first home but I'm not sure what grants I might be eligible for. Can you help me find out?
              </p>
            </div>
          </motion.div>

          {/* Assistant Message */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 max-w-[85%]"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
              <Bot size={16} />
            </div>
            <div className="space-y-4 w-full">
              <div className="bg-white border border-border text-text-dark rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                <p className="text-sm md:text-base mb-4">
                  I'd be happy to help you explore first-time homebuyer grants. To narrow down the options, could you provide a little more context?
                </p>
                <p className="font-semibold text-sm mb-2">Please let me know:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm md:text-base mb-4">
                  <li>Which state or territory are you planning to buy in?</li>
                  <li>Are you looking to build a new home, or buy an existing property?</li>
                  <li>What is your approximate annual household income?</li>
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button className="px-4 py-2 bg-gray-50 border border-border rounded-full text-sm hover:bg-gray-100 transition-colors">I'm buying in Victoria</button>
                  <button className="px-4 py-2 bg-gray-50 border border-border rounded-full text-sm hover:bg-gray-100 transition-colors">I'm building a new home</button>
                </div>
              </div>
            </div>
          </motion.div>

           {/* Typing Indicator */}
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 max-w-[80%]"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-border rounded-full px-4 py-3 flex items-center gap-1 shadow-sm">
               <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </motion.div>

        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
          <div className="relative max-w-4xl mx-auto shadow-lg rounded-xl border border-gray-200 bg-white flex items-end overflow-hidden p-2">
            <button className="p-3 text-gray-400 hover:text-text-dark transition-colors shrink-0">
              <Paperclip size={20} />
            </button>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none py-3 px-2 focus:outline-none text-text-dark leading-relaxed"
              rows={1}
            />
            <div className="flex items-center p-2 shrink-0 gap-2">
              <button className="p-2 text-gray-400 hover:text-text-dark transition-colors rounded-full hover:bg-gray-100">
                <Mic size={20} />
              </button>
              <button className={`p-2.5 rounded-lg transition-colors flex items-center justify-center ${inputText.trim() ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-primary text-white'}`}>
                <Send size={18} className="ml-1" />
              </button>
            </div>
          </div>
          <div className="text-center mt-3">
             <p className="text-xs text-gray-400">Civic Assistant can make mistakes. Consider verifying important information through official scheme documents.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAssistant;
