import { create } from 'zustand';
import api from '../lib/api';
import sendGeminiMessage from '../lib/gemini';

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,

  // ─── Load All Conversations ──────────────────────────────────────────────────
  loadConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const { data } = await api.get('/assistant/conversations');
      set({ conversations: data.data || [], isLoadingConversations: false });
    } catch (_) {
      set({ isLoadingConversations: false });
    }
  },

  // ─── Start a New Conversation ────────────────────────────────────────────────
  startConversation: async (title = 'New Conversation') => {
    try {
      const { data } = await api.post('/assistant/conversations', { title });
      const conv = data.data;
      set((state) => ({
        conversations: [conv, ...state.conversations],
        activeConversation: conv,
        messages: [],
      }));
      return conv;
    } catch (_) {
      // If unauthenticated, create a local-only ephemeral conversation
      const ephemeral = {
        id: `local_${Date.now()}`,
        title,
        status: 'active',
        isLocal: true,
      };
      set({ activeConversation: ephemeral, messages: [] });
      return ephemeral;
    }
  },

  // ─── Load a Conversation ─────────────────────────────────────────────────────
  loadConversation: async (id) => {
    set({ isLoadingMessages: true, messages: [] });
    try {
      const { data } = await api.get(`/assistant/conversations/${id}`);
      set({
        activeConversation: data.data,
        messages: data.data.messages || [],
        isLoadingMessages: false,
      });
    } catch (_) {
      set({ isLoadingMessages: false });
    }
  },

  // ─── Archive / Delete Conversation ───────────────────────────────────────────
  archiveConversation: async (id) => {
    try {
      await api.delete(`/assistant/conversations/${id}`);
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== id),
        activeConversation: state.activeConversation?.id === id ? null : state.activeConversation,
        messages: state.activeConversation?.id === id ? [] : state.messages,
      }));
    } catch (_) {}
  },

  // ─── Send a Message ───────────────────────────────────────────────────────────
  // 1. Optimistically add user message to UI
  // 2. Call Gemini API with full history for multi-turn context
  // 3. Add assistant response to UI
  // 4. Persist both to backend (non-blocking, best-effort)
  sendMessage: async (text, schemeContext = null) => {
    if (!text.trim()) return;

    const { activeConversation, messages } = get();

    // If no active conversation, create one
    let conversation = activeConversation;
    if (!conversation) {
      conversation = await get().startConversation(text.slice(0, 60));
    }

    const userMessage = {
      id: `local_user_${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    // Optimistically add user message
    set((state) => ({
      messages: [...state.messages, userMessage],
      isSending: true,
      error: null,
    }));

    try {
      // Build history for Gemini (exclude optimistic local messages that are temp)
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Call Gemini
      const aiText = await sendGeminiMessage(history, text, schemeContext);

      const assistantMessage = {
        id: `local_ai_${Date.now()}`,
        role: 'assistant',
        content: aiText,
        created_at: new Date().toISOString(),
      };

      // Add AI response to UI
      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isSending: false,
      }));

      // Auto-title the conversation on first exchange
      if (messages.length === 0 && !conversation.isLocal) {
        const titleText = text.slice(0, 80);
        api.patch(`/assistant/conversations/${conversation.id}/progress`, {
          interview_progress: {},
          title: titleText,
        }).catch(() => {});
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversation.id ? { ...c, title: titleText } : c
          ),
        }));
      }

      // Persist messages to backend (non-blocking)
      if (!conversation.isLocal) {
        api.post(`/assistant/conversations/${conversation.id}/messages`, {
          messages: [
            { role: 'user', content: text, context_metadata: schemeContext ? { schemeid: schemeContext.id, scheme_title: schemeContext.title } : null },
            { role: 'assistant', content: aiText, context_metadata: null },
          ],
        }).catch(() => {});
      }

      // Update conversation in sidebar list
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversation.id
            ? { ...c, updated_at: new Date().toISOString(), last_message: { role: 'assistant', content: aiText.slice(0, 120) } }
            : c
        ),
      }));

    } catch (err) {
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== userMessage.id),
        isSending: false,
        error: err.message || 'Failed to get AI response. Please try again.',
      }));
    }
  },

  clearError: () => set({ error: null }),
  clearChat: () => set({ activeConversation: null, messages: [] }),
}));

export default useChatStore;
