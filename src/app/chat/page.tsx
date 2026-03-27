'use client';
import React, { useState } from 'react';
import { Send, ArrowLeft, MoreVertical } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { ChatConversation, ChatMessage } from '@/types';

// Mock data
const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: '1',
    user: { name: 'Luiza Santos', avatar: '', online: true },
    lastMessage: 'Adorei o teu novo sample!',
    lastMessageTime: '2m',
    unread: 2,
  },
  {
    id: '2',
    user: { name: 'Carlos Beat', avatar: '', online: false },
    lastMessage: 'Quando vai lançar o EP?',
    lastMessageTime: '1h',
    unread: 0,
  },
  {
    id: '3',
    user: { name: 'MC Trovão', avatar: '', online: true },
    lastMessage: 'Vamos fazer um feat?',
    lastMessageTime: '3h',
    unread: 1,
  },
  {
    id: '4',
    user: { name: 'Ana Produtora', avatar: '', online: false },
    lastMessage: 'Mandei o contrato no e-mail',
    lastMessageTime: 'ontem',
    unread: 0,
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
    { id: '1', content: 'Oi! Vi seu post no feed', senderId: 'other', timestamp: '14:00', isOwn: false },
    { id: '2', content: 'Oi! Obrigado 🔥', senderId: 'me', timestamp: '14:01', isOwn: true },
    { id: '3', content: 'Adorei o teu novo sample!', senderId: 'other', timestamp: '14:02', isOwn: false },
  ],
  '2': [
    { id: '1', content: 'E aí, tudo bem?', senderId: 'other', timestamp: '10:00', isOwn: false },
    { id: '2', content: 'Tudo ótimo! E você?', senderId: 'me', timestamp: '10:05', isOwn: true },
    { id: '3', content: 'Quando vai lançar o EP?', senderId: 'other', timestamp: '10:10', isOwn: false },
  ],
};

export default function ChatPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const [selectedConv, setSelectedConv] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const selectConversation = (conv: ChatConversation) => {
    setSelectedConv(conv);
    setMessages(MOCK_MESSAGES[conv.id] || []);
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedConv) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="flex h-screen">
        {/* Conversation list */}
        <div
          className={cn(
            'w-full md:w-72 lg:w-80 border-r border-zinc-800 flex flex-col',
            selectedConv ? 'hidden md:flex' : 'flex'
          )}
        >
          <div
            className="sticky top-0 z-10 backdrop-blur-xl border-b border-zinc-800 px-4 py-3"
            style={{ background: 'rgba(10,10,11,0.9)' }}
          >
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Mensagens
            </h1>
            <Badge variant="orange" className="mt-1">Em breve: integração real</Badge>
          </div>

          <div className="overflow-y-auto flex-1">
            {MOCK_CONVERSATIONS.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 border-b border-zinc-800 transition-colors text-left',
                  selectedConv?.id === conv.id ? 'bg-zinc-800/70' : 'hover:bg-zinc-900'
                )}
              >
                <div className="relative">
                  <Avatar name={conv.user.name} size="md" />
                  {conv.user.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-950 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate">{conv.user.name}</span>
                    <span className="text-xs text-zinc-600 ml-2 flex-shrink-0">{conv.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-zinc-500 truncate">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="ml-2 flex-shrink-0 w-5 h-5 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center font-semibold">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className={cn('flex-1 flex flex-col', !selectedConv ? 'hidden md:flex' : 'flex')}>
          {selectedConv ? (
            <>
              {/* Chat header */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 backdrop-blur-xl sticky top-0 z-10"
                style={{ background: 'rgba(10,10,11,0.9)' }}
              >
                <button
                  className="md:hidden p-1.5 text-zinc-400 hover:text-white"
                  onClick={() => setSelectedConv(null)}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="relative">
                  <Avatar name={selectedConv.user.name} size="sm" />
                  {selectedConv.user.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-950 rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{selectedConv.user.name}</p>
                  <p className="text-xs text-zinc-500">
                    {selectedConv.user.online ? 'Online agora' : 'Offline'}
                  </p>
                </div>
                <button className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn('flex', msg.isOwn ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                        msg.isOwn
                          ? 'bg-orange-500 text-white rounded-br-sm'
                          : 'bg-zinc-800 text-zinc-200 rounded-bl-sm'
                      )}
                    >
                      <p>{msg.content}</p>
                      <p className={cn('text-xs mt-1', msg.isOwn ? 'text-orange-100' : 'text-zinc-500')}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Escreva uma mensagem..."
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="p-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <p className="text-zinc-300 font-semibold">Suas mensagens</p>
              <p className="text-zinc-600 text-sm mt-1 max-w-xs">
                Selecione uma conversa para começar
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
