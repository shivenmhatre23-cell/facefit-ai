'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { StyleProfile, ChatMessage } from '@/lib/types';
import { SAMPLE_STYLE_PROFILE } from '@/lib/mockData';
import { Bot, Send, Loader2, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SUGGESTED_PROMPTS = [
  'What should I wear tomorrow?',
  'Give me a low-maintenance hairstyle.',
  'Build an outfit for college.',
  'Suggest colors for me.',
];

export default function StylistPage() {
  const [profile, setProfile] = useState<StyleProfile>(SAMPLE_STYLE_PROFILE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('facefit_active_profile');
      if (stored) {
        try {
          setProfile(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-full',
          role: 'assistant',
          content: `Welcome to your personal style studio. I'm your **FaceFit AI Stylist**, currently grounded in your **${profile.faceGeometry.shape}** facial balance, **${profile.hairAnalysis.texture}** hair, and **${profile.colorPalette.seasonName}** palette.

Ask me anything about wardrobe pairings, college presentation looks, haircuts, or outfits under ₹3,000!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [profile]);

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

      if (!response.ok) throw new Error('Network error');

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
        const text = await response.text();
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, content: text } : msg))
        );
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: "I ran into a temporary connection hitch. Please try sending your query again!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'cleared-welcome',
        role: 'assistant',
        content: `Chat history cleared. How can I assist your styling today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif-editorial font-bold text-neutral-900">
                  AI Personal Stylist
                </h1>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs text-neutral-500">
                Grounded on: <strong className="text-neutral-800">{profile.faceGeometry.shape}</strong> Face • <strong className="text-neutral-800">{profile.colorPalette.seasonName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
            <Link
              href="/profile"
              className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 shrink-0">
            Suggested:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 border border-neutral-200/90 text-neutral-700 transition-colors shrink-0 disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat History Pane */}
        <div className="flex-1 bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-7 overflow-y-auto min-h-[460px] space-y-4 shadow-2xs mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neutral-900 text-white rounded-tr-xs shadow-xs'
                    : 'bg-neutral-50 border border-neutral-200/80 text-neutral-800 rounded-tl-xs whitespace-pre-wrap'
                }`}
              >
                {msg.content || (
                  <span className="flex items-center gap-2 text-neutral-400">
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
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  YOU
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-2 sm:p-3 shadow-2xs">
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
              className="flex-1 px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white disabled:opacity-40 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <>
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
