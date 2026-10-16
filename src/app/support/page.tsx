'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { TicketStatus, TicketPriority } from '@aurumsave/shared';
import {
  Headphones,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

export default function SupportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Ticket Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('PAYMENT_ISSUE');
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [initialMessage, setInitialMessage] = useState('');
  const [relatedOrderId, setRelatedOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply State
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    async function loadTickets() {
      try {
        const res = await apiRequest<{ success: boolean; data: any[] }>('/support/tickets');
        if (res.success && res.data) {
          setTickets(res.data);
          if (res.data.length > 0 && !selectedTicket) {
            loadTicketDetails(res.data[0].ticketId);
          }
        }
      } catch (err) {
        console.error('Failed to load tickets:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) loadTickets();
  }, [user, authLoading, router]);

  const loadTicketDetails = async (ticketId: string) => {
    try {
      const res = await apiRequest<{ success: boolean; data: { ticket: any; messages: any[] } }>(
        `/support/tickets/${ticketId}`,
      );
      if (res.success && res.data) {
        setSelectedTicket(res.data.ticket);
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to load ticket details:', err);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiRequest<{ success: boolean; data: any }>('/support/tickets', {
        method: 'POST',
        body: JSON.stringify({
          subject,
          category,
          priority,
          message: initialMessage,
          relatedOrderId: relatedOrderId.trim() || undefined,
        }),
      });

      if (res.success && res.data) {
        setTickets([res.data, ...tickets]);
        setIsModalOpen(false);
        setSubject('');
        setInitialMessage('');
        loadTicketDetails(res.data.ticketId);
      }
    } catch (err) {
      console.error('Failed to create ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket || isReplying) return;
    setIsReplying(true);

    try {
      const res = await apiRequest<{ success: boolean; data: any }>(
        `/support/tickets/${selectedTicket.ticketId}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({
            message: replyText.trim(),
          }),
        },
      );

      if (res.success) {
        setReplyText('');
        loadTicketDetails(selectedTicket.ticketId);
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setIsReplying(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-aurum-muted">Loading support desk...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-aurum-border">
        <div>
          <h1 className="font-serif text-3xl font-bold text-aurum-ivory">Customer Support Desk</h1>
          <p className="text-xs text-aurum-muted mt-0.5">
            Dedicated resolution for payments, delivery, and vault security inquiries.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-aurum-gold text-aurum-navy font-bold text-xs shadow-gold-glow hover:brightness-110 flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Open New Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Ticket List (Left) */}
        <div className="lg:col-span-4 rounded-3xl bg-aurum-card border border-aurum-border overflow-hidden flex flex-col">
          <div className="p-4 border-b border-aurum-border bg-aurum-surface text-xs font-semibold text-aurum-slate uppercase tracking-wider">
            Your Active Tickets ({tickets.length})
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-aurum-border/60">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-aurum-muted">
                No tickets filed. All your services are operating smoothly!
              </div>
            ) : (
              tickets.map((t) => (
                <button
                  key={t.ticketId}
                  onClick={() => loadTicketDetails(t.ticketId)}
                  className={`w-full p-4 text-left hover:bg-aurum-surface/50 transition-colors block ${
                    selectedTicket?.ticketId === t.ticketId ? 'bg-aurum-surface/80 border-l-4 border-aurum-gold' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-aurum-gold font-bold">{t.ticketId}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === TicketStatus.OPEN
                          ? 'bg-amber-500/10 text-amber-400'
                          : t.status === TicketStatus.RESOLVED
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-aurum-surface text-aurum-muted'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-aurum-ivory text-xs line-clamp-1">{t.subject}</h4>
                  <div className="flex items-center space-x-2 text-[10px] text-aurum-slate mt-1">
                    <span>{t.category}</span>
                    <span>•</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Thread (Right) */}
        <div className="lg:col-span-8 rounded-3xl bg-aurum-card border border-aurum-border flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <div className="p-5 border-b border-aurum-border bg-aurum-surface flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-aurum-gold">{selectedTicket.ticketId}</span>
                    <span className="text-xs text-aurum-border">•</span>
                    <span className="text-xs text-aurum-muted">{selectedTicket.category}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-aurum-ivory mt-0.5">
                    {selectedTicket.subject}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-aurum-navy border border-aurum-border text-aurum-ivory">
                  {selectedTicket.priority} Priority
                </span>
              </div>

              {/* Messages list */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {messages.map((m, idx) => {
                  const isUser = m.senderRole === 'CUSTOMER';
                  return (
                    <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center space-x-1.5 text-[10px] text-aurum-slate mb-1">
                        <span className="font-bold text-aurum-ivory">{isUser ? 'You' : 'Aurum Support Officer'}</span>
                        <span>•</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-aurum-gold text-aurum-navy font-medium rounded-tr-none'
                            : 'bg-aurum-surface border border-aurum-border text-aurum-ivory rounded-tl-none'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-aurum-border bg-aurum-surface flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type your message to support..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-aurum-navy border border-aurum-border text-xs text-aurum-ivory focus:border-aurum-gold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-aurum-gold text-aurum-navy font-bold text-xs hover:brightness-110 disabled:opacity-50 flex items-center space-x-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-aurum-muted">
              Select a ticket to review conversation
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-aurum-card border border-aurum-border shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-aurum-border">
              <h3 className="font-serif text-xl font-bold text-aurum-ivory">Open Support Ticket</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-aurum-muted hover:text-aurum-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-aurum-muted block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of your inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aurum-navy border border-aurum-border text-aurum-ivory focus:border-aurum-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-aurum-muted block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-aurum-navy border border-aurum-border text-aurum-ivory focus:border-aurum-gold focus:outline-none"
                  >
                    <option value="PAYMENT_ISSUE">Payment Issue (MFS)</option>
                    <option value="KYC_VERIFICATION">KYC Identity Help</option>
                    <option value="GOLD_DELIVERY">Physical Gold Delivery</option>
                    <option value="ACCOUNT_SECURITY">Account Security</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-aurum-muted block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full px-3 py-2.5 rounded-xl bg-aurum-navy border border-aurum-border text-aurum-ivory focus:border-aurum-gold focus:outline-none"
                  >
                    <option value={TicketPriority.LOW}>Low</option>
                    <option value={TicketPriority.MEDIUM}>Medium</option>
                    <option value={TicketPriority.HIGH}>High</option>
                    <option value={TicketPriority.URGENT}>Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-aurum-muted block mb-1">Related Order ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ORD-1718000000-ABCDEF"
                  value={relatedOrderId}
                  onChange={(e) => setRelatedOrderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aurum-navy border border-aurum-border text-aurum-ivory focus:border-aurum-gold focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-aurum-muted block mb-1">Message Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide detailed description of your issue..."
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aurum-navy border border-aurum-border text-aurum-ivory focus:border-aurum-gold focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-aurum-surface text-aurum-muted hover:text-aurum-ivory font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-aurum-gold text-aurum-navy font-bold shadow-gold-glow hover:brightness-110 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
