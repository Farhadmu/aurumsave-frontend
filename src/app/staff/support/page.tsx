'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { apiRequest } from '../../../lib/api';
import { Role, TicketStatus, TicketPriority } from '@aurumsave/shared';
import {
  Headphones,
  Send,
  Lock,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function StaffSupportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [queue, setQueue] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Reply state
  const [messageText, setMessageText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<TicketStatus>(TicketStatus.IN_PROGRESS);
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    if (
      !authLoading &&
      (!user ||
        (user.role !== Role.SUPPORT_AGENT &&
          user.role !== Role.ADMIN &&
          user.role !== Role.SUPER_ADMIN))
    ) {
      router.push('/login');
      return;
    }

    async function loadQueue() {
      try {
        const res = await apiRequest<{ success: boolean; data: any[] }>(
          `/support/queue${statusFilter ? `?status=${statusFilter}` : ''}`,
        );
        if (res.success && res.data) {
          setQueue(res.data);
          if (res.data.length > 0 && !selectedTicket) {
            loadTicketDetails(res.data[0].ticketId);
          }
        }
      } catch (err) {
        console.error('Failed to load support queue:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) loadQueue();
  }, [user, authLoading, router, statusFilter]);

  const loadTicketDetails = async (ticketId: string) => {
    try {
      const res = await apiRequest<{ success: boolean; data: { ticket: any; messages: any[] } }>(
        `/support/tickets/${ticketId}`,
      );
      if (res.success && res.data) {
        setSelectedTicket(res.data.ticket);
        setMessages(res.data.messages);
        setUpdateStatus(res.data.ticket.status);
      }
    } catch (err) {
      console.error('Failed to load ticket details:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedTicket || isReplying) return;
    setIsReplying(true);

    try {
      const res = await apiRequest<{ success: boolean; data: any }>(
        `/support/tickets/${selectedTicket.ticketId}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({
            message: messageText.trim(),
            isInternalNote,
            updateStatus,
          }),
        },
      );

      if (res.success) {
        setMessageText('');
        setIsInternalNote(false);
        loadTicketDetails(selectedTicket.ticketId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    } finally {
      setIsReplying(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-aurum-gold border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-aurum-muted">Loading Support Agent Command Queue...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Support &amp; Escalations Desk</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-aurum-ivory">
            Support Case Queue &amp; Internal Notes
          </h1>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-aurum-card border border-aurum-border text-aurum-ivory focus:border-aurum-gold focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value={TicketStatus.OPEN}>Open Only</option>
            <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
            <option value={TicketStatus.RESOLVED}>Resolved</option>
            <option value={TicketStatus.CLOSED}>Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Ticket List (Left) */}
        <div className="lg:col-span-5 rounded-3xl bg-aurum-card border border-aurum-border overflow-hidden flex flex-col">
          <div className="p-4 border-b border-aurum-border bg-aurum-surface text-xs font-semibold text-aurum-slate uppercase tracking-wider">
            Queue Cases ({queue.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-aurum-border/60">
            {queue.length === 0 ? (
              <div className="p-8 text-center text-xs text-aurum-muted">
                No active support tickets in this queue filter.
              </div>
            ) : (
              queue.map((t) => (
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
                    <span>{t.userId?.fullName}</span>
                    <span>•</span>
                    <span className="font-bold text-rose-400">{t.priority}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Thread & Reply Box (Right) */}
        <div className="lg:col-span-7 rounded-3xl bg-aurum-card border border-aurum-border flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-5 border-b border-aurum-border bg-aurum-surface flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-aurum-gold">{selectedTicket.ticketId}</span>
                    <span className="text-xs text-aurum-border">•</span>
                    <span className="text-xs text-aurum-ivory font-bold">{selectedTicket.userId?.fullName}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-aurum-ivory mt-0.5">
                    {selectedTicket.subject}
                  </h3>
                </div>
                <div className="text-right text-xs">
                  <span className="text-[10px] text-aurum-slate block">Current Status</span>
                  <span className="font-bold text-aurum-gold">{selectedTicket.status}</span>
                </div>
              </div>

              {/* Messages with internal note distinction */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {messages.map((m, idx) => {
                  const isInternal = m.isInternalNote;
                  const isAgent = m.senderRole !== 'CUSTOMER';

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                        isInternal
                          ? 'bg-amber-500/10 border border-amber-500/30'
                          : isAgent
                          ? 'bg-aurum-surface border border-aurum-border'
                          : 'bg-aurum-navy border border-aurum-border/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-aurum-ivory">
                            {m.senderId?.fullName || m.senderRole}
                          </span>
                          <span className="text-aurum-slate">({m.senderRole})</span>
                          {isInternal && (
                            <span className="px-2 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold uppercase text-[9px] flex items-center space-x-1">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Internal Staff Note</span>
                            </span>
                          )}
                        </div>
                        <span className="text-aurum-slate">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-aurum-ivory leading-relaxed">{m.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply / Internal Note Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-aurum-border bg-aurum-surface space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded bg-aurum-navy border-aurum-border text-aurum-gold focus:ring-0"
                    />
                    <span className="text-amber-400 font-semibold flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Post as Internal Staff Note (Customer Never Sees This)</span>
                    </span>
                  </label>

                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value as TicketStatus)}
                    className="px-2.5 py-1 rounded-lg bg-aurum-navy border border-aurum-border text-aurum-ivory text-xs"
                  >
                    <option value={TicketStatus.IN_PROGRESS}>Set In Progress</option>
                    <option value={TicketStatus.WAITING_ON_CUSTOMER}>Waiting Customer</option>
                    <option value={TicketStatus.RESOLVED}>Mark Resolved</option>
                    <option value={TicketStatus.CLOSED}>Close Ticket</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder={
                      isInternalNote
                        ? 'Type private note for compliance or operations team...'
                        : 'Type public reply to customer...'
                    }
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-aurum-navy border border-aurum-border text-xs text-aurum-ivory focus:border-aurum-gold focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isReplying || !messageText.trim()}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                      isInternalNote
                        ? 'bg-amber-500 text-aurum-navy hover:bg-amber-400'
                        : 'bg-aurum-gold text-aurum-navy hover:brightness-110'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isInternalNote ? 'Save Note' : 'Reply'}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-aurum-muted">
              Select a case from the queue to review context
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
