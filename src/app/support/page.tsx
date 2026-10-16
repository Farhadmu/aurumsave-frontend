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
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  LifeBuoy,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge, BadgeVariant } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { formatDateTime } from '../../lib/utils';

export default function SupportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // New Ticket Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('PAYMENT_ISSUE');
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [initialMessage, setInitialMessage] = useState('');
  const [relatedOrderId, setRelatedOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Reply State
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadTickets();
    }
  }, [user, authLoading, router]);

  const loadTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ success: boolean; data: any[] }>('/support/tickets');
      if (res.success && res.data) {
        setTickets(res.data);
        if (res.data.length > 0 && !selectedTicket) {
          loadTicketDetails(res.data[0].ticketId);
        }
      }
    } catch (err: any) {
      console.error('Failed to load tickets:', err);
      setError(err.message || 'Unable to load tickets from customer support system');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTicketDetails = async (ticketId: string) => {
    try {
      const res = await apiRequest<{ success: boolean; data: { ticket: any; messages: any[] } }>(
        `/support/tickets/${ticketId}`
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
    setFormError(null);
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
        setRelatedOrderId('');
        loadTicketDetails(res.data.ticketId);
      }
    } catch (err: any) {
      console.error('Failed to create ticket:', err);
      setFormError(err.message || 'Failed to submit ticket. Please check your connection.');
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
        }
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

  const getPriorityBadgeVariant = (p: string): BadgeVariant => {
    switch (p) {
      case TicketPriority.URGENT:
        return 'rose';
      case TicketPriority.HIGH:
        return 'amber';
      case TicketPriority.MEDIUM:
        return 'sapphire';
      case TicketPriority.LOW:
      default:
        return 'slate';
    }
  };

  const getStatusBadgeVariant = (s: string): BadgeVariant => {
    switch (s) {
      case TicketStatus.OPEN:
        return 'amber';
      case TicketStatus.RESOLVED:
        return 'emerald';
      case TicketStatus.CLOSED:
        return 'slate';
      default:
        return 'gold';
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-4 h-96" />
          <Skeleton className="lg:col-span-8 h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-aurum-border">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-aurum-gold/15 text-aurum-gold border border-aurum-gold/30">
              <Headphones className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-3xl font-bold text-aurum-text tracking-tight">
              Customer Support Desk
            </h1>
          </div>
          <p className="text-xs text-aurum-text-muted">
            Dedicated concierge support for bullion allocations, MFS gateway settlements, and vault custody.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Open New Inquiry
          </Button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={loadTickets} />}

      {/* Main Support Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Ticket List (Left, 4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-aurum-card border border-aurum-border shadow-card-luxury flex flex-col overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-aurum-border space-y-3 bg-aurum-surface/40">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-aurum-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket ID or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-aurum-navy/50 border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-muted focus:border-aurum-gold focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-[11px]">
              {['ALL', TicketStatus.OPEN, TicketStatus.RESOLVED].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-aurum-gold text-aurum-midnight font-bold border-aurum-gold'
                      : 'bg-aurum-surface text-aurum-text-muted border-aurum-border hover:border-aurum-gold/30'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-aurum-border/60">
            {isLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-8 text-center">
                <EmptyState
                  icon={<MessageSquare className="w-6 h-6" />}
                  title="No Tickets Found"
                  description="You have no active support requests matching your filter."
                  actionText="Open New Ticket"
                  onAction={() => setIsModalOpen(true)}
                />
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.ticketId === t.ticketId;
                return (
                  <button
                    key={t.ticketId}
                    onClick={() => loadTicketDetails(t.ticketId)}
                    className={`w-full p-4 text-left transition-all block group ${
                      isSelected
                        ? 'bg-aurum-gold/10 border-l-4 border-aurum-gold'
                        : 'hover:bg-aurum-surface/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-bold text-aurum-gold">
                        {t.ticketId}
                      </span>
                      <Badge variant={getStatusBadgeVariant(t.status)} size="sm">
                        {t.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-aurum-text text-xs line-clamp-1 group-hover:text-aurum-gold transition-colors">
                      {t.subject}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-aurum-text-muted mt-2">
                      <span className="font-mono">{t.category?.replace('_', ' ')}</span>
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message Thread (Right, 8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-aurum-card border border-aurum-border shadow-card-luxury flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <div className="p-5 border-b border-aurum-border bg-aurum-surface/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-aurum-gold">
                      {selectedTicket.ticketId}
                    </span>
                    <span className="text-xs text-aurum-border">•</span>
                    <Badge variant={getPriorityBadgeVariant(selectedTicket.priority)} size="sm">
                      {selectedTicket.priority} Priority
                    </Badge>
                    {selectedTicket.relatedOrderId && (
                      <span className="font-mono text-[10px] text-aurum-text-muted">
                        Order #{selectedTicket.relatedOrderId}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-aurum-text">
                    {selectedTicket.subject}
                  </h3>
                </div>

                <Badge variant={getStatusBadgeVariant(selectedTicket.status)} size="md">
                  {selectedTicket.status}
                </Badge>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[460px]">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-aurum-text-muted text-xs">
                    No replies yet. Our officer will respond within 15 minutes.
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isUser = m.senderRole === 'CUSTOMER';
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center space-x-2 text-[10px] text-aurum-text-muted mb-1 px-1">
                          <span className="font-bold text-aurum-text">
                            {isUser ? 'You' : 'Aurum Concierge Support'}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isUser
                              ? 'bg-gradient-to-r from-aurum-gold to-aurum-gold-light text-aurum-midnight font-medium rounded-tr-none'
                              : 'bg-aurum-surface border border-aurum-border text-aurum-text rounded-tl-none'
                          }`}
                        >
                          {m.message}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply Form */}
              <form
                onSubmit={handleSendReply}
                className="p-4 border-t border-aurum-border bg-aurum-surface/40 flex items-center space-x-3"
              >
                <input
                  type="text"
                  placeholder="Type your response to support officer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-aurum-navy/50 border border-aurum-border text-xs text-aurum-text placeholder-aurum-text-muted focus:border-aurum-gold focus:outline-none transition-colors"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isReplying}
                  disabled={!replyText.trim()}
                  rightIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <LifeBuoy className="w-12 h-12 text-aurum-gold/40 mb-3" />
              <h4 className="text-sm font-bold text-aurum-text">Support Ticket Workspace</h4>
              <p className="text-xs text-aurum-text-muted mt-1 max-w-sm">
                Select an existing ticket from the left panel to review updates, or create a new inquiry.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-aurum-card border border-aurum-gold/30 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-aurum-border">
              <div className="space-y-0.5">
                <h3 className="font-serif text-xl font-bold text-aurum-text">
                  Open Support Inquiry
                </h3>
                <p className="text-xs text-aurum-text-muted">
                  Direct escalation to compliance and financial operations.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-aurum-text-muted hover:text-aurum-text hover:bg-aurum-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-aurum-text block mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MFS verification delay or Vault allocation query"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aurum-navy/50 border border-aurum-border text-aurum-text placeholder-aurum-text-muted focus:border-aurum-gold focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-aurum-text block mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-aurum-navy/50 border border-aurum-border text-aurum-text focus:border-aurum-gold focus:outline-none"
                  >
                    <option value="PAYMENT_ISSUE">Payment / MFS Settlement</option>
                    <option value="KYC_VERIFICATION">KYC Identity Review</option>
                    <option value="GOLD_DELIVERY">Physical Gold Delivery</option>
                    <option value="ACCOUNT_SECURITY">Vault Security &amp; 2FA</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-aurum-text block mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full px-3 py-2.5 rounded-xl bg-aurum-navy/50 border border-aurum-border text-aurum-text focus:border-aurum-gold focus:outline-none"
                  >
                    <option value={TicketPriority.LOW}>Low Priority</option>
                    <option value={TicketPriority.MEDIUM}>Medium Priority</option>
                    <option value={TicketPriority.HIGH}>High Priority</option>
                    <option value={TicketPriority.URGENT}>Urgent (Critical)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-aurum-text block mb-1.5">
                  Related Order ID <span className="text-aurum-text-muted font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ORD-1718000000-ABCDEF"
                  value={relatedOrderId}
                  onChange={(e) => setRelatedOrderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aurum-navy/50 border border-aurum-border text-aurum-text font-mono placeholder-aurum-text-muted focus:border-aurum-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-aurum-text block mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe your question or issue in detail..."
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-aurum-navy/50 border border-aurum-border text-aurum-text placeholder-aurum-text-muted focus:border-aurum-gold focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Submit Inquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
