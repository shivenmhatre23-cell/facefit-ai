'use client';

import React, { useState, useRef, useEffect } from 'react';
import { StyleProfile, ChatMessage } from '@/lib/types';
import { X, Send, Sparkles, Bot, Loader2 } from 'lucide-react';

interface StylistDrawerProps {
  profile: StyleProfile;
  isOpen: boolean;
  onClose: () => void;
}

// Exactly as specified by user
const SUGGESTED_PROMPTS = [
  'What should I wear tomorrow?',
  'Give me a low-maintenance hairstyle.',
  'Build an outfit for college.',
  'Suggest colors for me.',
];

export function StylistDrawer({ profile, isOpen, onClose }: StylistDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const faceShape = profile.faceGeometry.shape;
      const season = profile.colorPalette.seasonName;
      setMessages([
        {
          id: 'msg-welcome',
          role: 'assistant',
          content: `Hello! I'm your **FaceFit AI Stylist**. I've reviewed your **${faceShape}** facial geometry, **${profile.hairAnalysis.texture}** hair texture, and **${season}** color palette.

How can I help you refine your style today? You can choose one of the suggestions below or ask any specific wardrobe or grooming question!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isOpen, profile, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          messages: [...messages, userMsg],
          userMessage: query,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get stylist advice.');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      const assistantMsgId = 'msg-' + (Date.now() + 1);
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: assistantContent } : msg
            )
          );
        }
      } else {
        const fullText = await response.text();
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, content: fullText } : msg))
        );
      }
    } catch (err: unknown) {
      console.error('Stylist chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          role: 'assistant',
          content:
            "I'm momentarily having trouble connecting to the styling engine. Try asking again, or click one of the suggested prompts below!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200 animate-slideLeft">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900">AI Personal Stylist</h3>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-neutral-500 font-mono">
                Grounded on your {profile.faceGeometry.shape} profile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Prompts Bar - Exact requested prompts */}
        <div className="p-3 bg-white border-b border-neutral-100 overflow-x-auto whitespace-nowrap flex items-center gap-2 no-scrollbar">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 border border-neutral-200 text-neutral-700 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neutral-900 text-white rounded-tr-xs'
                    : 'bg-neutral-50 border border-neutral-200/90 text-neutral-800 rounded-tl-xs whitespace-pre-wrap'
                }`}
              >
                {msg.content || (
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Stylist is thinking...
                  </span>
                )}
                <span
                  className={`text-[9px] block mt-1.5 ${
                    msg.role === 'user' ? 'text-neutral-400 text-right' : 'text-neutral-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  YOU
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-neutral-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask: 'What should I wear tomorrow?' or 'Outfit under ₹3000'..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white disabled:opacity-40 transition-all cursor-pointer shadow-xs"
              title="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <Send className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </form>
          <span className="text-[10px] text-neutral-400 block text-center mt-2">
            Ask for college attire, haircuts, color combinations, or specific occasions.
          </span>
        </div>
      </div>
    </div>
  );
}
