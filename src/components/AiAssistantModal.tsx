'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Send, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';
import { apiRequest } from '../lib/api';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  disclaimer?: string;
  confidence?: string;
}

export default function AiAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Hello! I am your AurumSave Grounded Assistant. I can explain gold purity standards (24K vs 22K), BAJUS market pricing, spread calculations, and KYC requirements in Bangladesh. How may I assist your savings journey today?',
      sources: ['AurumSave Official Platform Manual'],
    },
  ]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query.trim();
    setQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await apiRequest<{
        success: boolean;
        data: {
          answer: string;
          citedSources: string[];
          isGrounded: boolean;
          confidence: string;
          disclaimer: string;
        };
      }>('/ai/assistant', {
        method: 'POST',
        body: JSON.stringify({ query: userText }),
      });

      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: res.data.answer,
            sources: res.data.citedSources,
            disclaimer: res.data.disclaimer,
            confidence: res.data.confidence,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I am temporarily unable to retrieve platform documentation. Please check our FAQ section or reach out to human support.',
          sources: ['Help Desk'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-full bg-gradient-to-r from-aurum-gold to-aurum-gold-light text-aurum-navy font-bold shadow-gold-glow hover:scale-105 transition-all"
        aria-label="Open Grounded AI Assistant"
      >
        <Sparkles className="w-5 h-5 text-aurum-navy" />
        <span className="text-sm hidden sm:inline">Ask Aurum AI</span>
      </button>

      {/* Assistant Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg h-[600px] flex flex-col rounded-3xl bg-aurum-card border border-aurum-gold/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-4 bg-aurum-surface border-b border-aurum-border flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-aurum-gold flex items-center justify-center text-aurum-navy">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-aurum-ivory text-sm">AurumSave Assistant</h3>
                  <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Policy Grounded • Zero Financial Modification</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-aurum-muted hover:text-aurum-ivory hover:bg-aurum-card transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-aurum-gold text-aurum-navy font-medium rounded-tr-none'
                        : 'bg-aurum-surface border border-aurum-border text-aurum-ivory rounded-tl-none space-y-2'
                    }`}
                  >
                    <p>{m.text}</p>

                    {m.sources && m.sources.length > 0 && (
                      <div className="pt-2 border-t border-aurum-border/60 text-[10px] text-aurum-muted flex items-center space-x-1">
                        <BookOpen className="w-3 h-3 text-aurum-gold flex-shrink-0" />
                        <span>Source: {m.sources.join(', ')}</span>
                      </div>
                    )}

                    {m.disclaimer && (
                      <div className="text-[10px] text-aurum-slate flex items-start space-x-1 italic">
                        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{m.disclaimer}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-aurum-muted text-xs p-2">
                  <span className="w-2 h-2 rounded-full bg-aurum-gold animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-aurum-gold animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-aurum-gold animate-bounce [animation-delay:0.4s]" />
                  <span>Checking platform knowledge base...</span>
                </div>
              )}
            </div>

            {/* Predefined Quick Questions */}
            <div className="px-4 py-2 bg-aurum-navy/50 border-t border-aurum-border/40 flex items-center space-x-2 overflow-x-auto text-[11px] no-scrollbar">
              <button
                onClick={() => setQuery('What is the difference between 24K and 22K gold?')}
                className="px-2.5 py-1 rounded-full bg-aurum-surface border border-aurum-border hover:border-aurum-gold text-aurum-muted hover:text-aurum-ivory whitespace-nowrap"
              >
                24K vs 22K?
              </button>
              <button
                onClick={() => setQuery('How does the buy/sell spread work?')}
                className="px-2.5 py-1 rounded-full bg-aurum-surface border border-aurum-border hover:border-aurum-gold text-aurum-muted hover:text-aurum-ivory whitespace-nowrap"
              >
                Spread & Fees?
              </button>
              <button
                onClick={() => setQuery('What documents do I need for KYC?')}
                className="px-2.5 py-1 rounded-full bg-aurum-surface border border-aurum-border hover:border-aurum-gold text-aurum-muted hover:text-aurum-ivory whitespace-nowrap"
              >
                KYC Requirements?
              </button>
            </div>

            {/* Query Input */}
            <form onSubmit={handleSend} className="p-3 bg-aurum-surface border-t border-aurum-border flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about gold purity, BAJUS rates, or KYC..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-aurum-navy border border-aurum-border text-xs text-aurum-ivory placeholder-aurum-slate focus:border-aurum-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="p-2.5 rounded-xl bg-aurum-gold text-aurum-navy disabled:opacity-50 hover:brightness-110 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
