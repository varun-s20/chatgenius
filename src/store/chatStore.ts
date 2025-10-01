import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  image?: string;
}

export interface Chatroom {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface ChatStore {
  chatrooms: Chatroom[];
  currentChatroomId: string | null;
  isTyping: boolean;
  createChatroom: (title: string) => string;
  deleteChatroom: (id: string) => void;
  addMessage: (chatroomId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  setCurrentChatroom: (id: string | null) => void;
  setIsTyping: (isTyping: boolean) => void;
  getCurrentChatroom: () => Chatroom | undefined;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      currentChatroomId: null,
      isTyping: false,
      createChatroom: (title) => {
        const id = `chat-${Date.now()}`;
        const newChatroom: Chatroom = {
          id,
          title,
          messages: [],
          createdAt: new Date(),
        };
        set((state) => ({ chatrooms: [...state.chatrooms, newChatroom] }));
        return id;
      },
      deleteChatroom: (id) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter((chat) => chat.id !== id),
          currentChatroomId: state.currentChatroomId === id ? null : state.currentChatroomId,
        }));
      },
      addMessage: (chatroomId, message) => {
        const newMessage: Message = {
          ...message,
          id: `msg-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
        };
        set((state) => ({
          chatrooms: state.chatrooms.map((chat) =>
            chat.id === chatroomId
              ? { ...chat, messages: [...chat.messages, newMessage] }
              : chat
          ),
        }));
      },
      setCurrentChatroom: (id) => set({ currentChatroomId: id }),
      setIsTyping: (isTyping) => set({ isTyping }),
      getCurrentChatroom: () => {
        const { chatrooms, currentChatroomId } = get();
        return chatrooms.find((chat) => chat.id === currentChatroomId);
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);
