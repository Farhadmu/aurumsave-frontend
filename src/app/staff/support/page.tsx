'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { apiRequest } from '../../../lib/api';
import { Role, TicketStatus, TicketPriority } from '../../../shared';
import { formatDateTime } from '../../../lib/utils';
import StaffHeader from '../../../components/StaffHeader';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../../components/ui/States';
import {
  Headphones,
  Send,
  Lock,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Shield,
  EyeOff,
} from 'lucide-react';

export default function StaffSupportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [queue, setQueue] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reply form state
  const [messageText, setMessageText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<TicketStatus>(TicketStatus.IN_PROGRESS);
  const [isReplying, setIsReplying] = useState(false);

  const loadTicketDetails = async (ticketId: string) => {
    try {
      const res = await apiRequest<{
        success: boolean;
        data: { ticket: any; messages: any[] };
      }>(`/support/tickets/${ticketId}`);
      if (res.success && res.data) {
        setSelectedTicket(res.data.ticket);
        setMessages(res.data.messages);
        setUpdateStatus(res.data.ticket.status);
      }
    } catch (err: any) {
      console.error('Failed to load ticket details:', err);
    }
  };

  const loadQueue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiRequest<{ success: boolean; data: any[] }>(
        `/support/queue${statusFilter ? `?status=${statusFilter}` : ''}`,
      );
      if (res.success && res.data) {
        setQueue(res.data);
        if (res.data.length > 0 && !selectedTicket) {
          loadTicketDetails(res.data[0].ticketId);
        }
      }
    } catch (err: any) {
      console.error('Failed to load support queue:', err);
      setError('Unable to load client concierge support queue.');
    } finally {
      setIsLoading(false);
    }
  };

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

    if (user) loadQueue();
  }, [user, authLoading, router, statusFilter]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedTicket) return;
    setIsReplying(true);

    try {
      const res = await apiRequest<{ success: boolean; data: any }>(
        `/support/tickets/${selectedTicket.ticketId}/reply`,
        {
          method: 'POST',
          body: JSON.stringify({
            message: messageText.trim(),
            isInternalNote,
            status: updateStatus,
          }),
        },
      );

      if (res.success) {
        setMessageText('');
        setIsInternalNote(false);
        loadTicketDetails(selectedTicket.ticketId);
        setQueue((prev) =>
          prev.map((t) =>
            t.ticketId === selectedTicket.ticketId
              ? { ...t, status: updateStatus, updatedAt: new Date().toISOString() }
              : t,
          ),
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to send response');
    } finally {
      setIsReplying(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-5 h-[600px] rounded-2xl" />
          <Skeleton className="lg:col-span-7 h-[600px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <StaffHeader
        title="Concierge Customer Support Desk"
        subtitle="Manage client inquiries, physical bullion delivery tracking, and internal compliance collaboration notes with strict customer privacy isolation."
      />

      {error && <ErrorState message={error} onRetry={loadQueue} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Ticket Queue */}
        <div className="lg:col-span-5 rounded-3xl bg-aurum-card border border-aurum-border p-5 space-y-4 shadow-card-luxury">
          <div className="flex items-center justify-between pb-3 border-b border-aurum-border">
            <h3 className="font-serif-luxury text-base font-bold text-aurum-text">
              Active Support Tickets
            </h3>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-aurum-surface border border-aurum-border text-xs text-aurum-text font-semibold focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_ON_CUSTOMER">Waiting on Client</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {queue.length === 0 ? (
            <EmptyState
              icon={<Headphones className="w-6 h-6" />}
              title="Ticket Queue Clear"
              description="No tickets currently match the selected filter."
            />
          ) : (
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {queue.map((ticket) => {
                const isSelected = selectedTicket?.ticketId === ticket.ticketId;
                return (
                  <div
                    key={ticket._id || ticket.ticketId}
                    onClick={() => loadTicketDetails(ticket.ticketId)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-aurum-surface border-aurum-gold/60 shadow-gold-glow'
                        : 'bg-aurum-surface/60 border-aurum-border hover:border-aurum-gold/30'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="font-mono text-[11px] font-bold text-aurum-gold">
                        {ticket.ticketId}
                      </span>
                      <Badge
                        variant={
                          ticket.priority === 'URGENT'
                            ? 'rose'
                            : ticket.priority === 'HIGH'
                            ? 'amber'
                            : 'slate'
                        }
                        size="sm"
                      >
                        {ticket.priority}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-xs text-aurum-text truncate mb-1">
                      {ticket.subject}
                    </h4>

                    <div className="flex justify-between items-center text-[10px] text-aurum-text-dim pt-2 border-t border-aurum-border/40 font-mono">
                      <span>{ticket.userId?.fullName || 'Client'}</span>
                      <span>{formatDateTime(ticket.updatedAt || ticket.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Ticket Conversation & Private Notes */}
        <div className="lg:col-span-7 rounded-3xl bg-aurum-card border border-aurum-border p-6 sm:p-8 space-y-6 shadow-card-luxury">
          {!selectedTicket ? (
            <EmptyState
              icon={<MessageSquare className="w-8 h-8 text-aurum-gold" />}
              title="No Ticket Selected"
              description="Choose a ticket from the queue on the left to read conversation history and compose a reply."
            />
          ) : (
            <>
              {/* Ticket Details Header */}
              <div className="pb-4 border-b border-aurum-border space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-aurum-gold">
                    {selectedTicket.ticketId}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="gold" size="sm">
                      {selectedTicket.status}
                    </Badge>
                    <Badge variant="slate" size="sm">
                      {selectedTicket.category || 'GENERAL'}
                    </Badge>
                  </div>
                </div>

                <h3 className="font-serif-luxury text-xl font-bold text-aurum-text">
                  {selectedTicket.subject}
                </h3>

                <p className="text-xs text-aurum-text-muted">
                  Client:{' '}
                  <strong className="text-aurum-text">
                    {selectedTicket.userId?.fullName}
                  </strong>{' '}
                  ({selectedTicket.userId?.email})
                </p>
              </div>

              {/* Messages Thread */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {messages.map((msg, index) => {
                  const isStaff = msg.senderRole !== Role.CUSTOMER;
                  const isPrivate = msg.isInternalNote;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl border text-xs space-y-2 ${
                        isPrivate
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                          : isStaff
                          ? 'bg-aurum-surface border-aurum-gold/30 text-aurum-text'
                          : 'bg-aurum-surface/40 border-aurum-border text-aurum-text'
                      }`}
                    >
                      <div className="flex justify-between items-center font-mono text-[10px]">
                        <div className="flex items-center space-x-1.5">
                          {isPrivate && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase flex items-center space-x-1">
                              <EyeOff className="w-2.5 h-2.5 mr-0.5" />
                              Private Staff Note
                            </span>
                          )}
                          <span className="font-bold text-aurum-text">
                            {msg.senderId?.fullName || msg.senderRole}
                          </span>
                        </div>
                        <span className="text-aurum-text-dim">
                          {formatDateTime(msg.createdAt)}
                        </span>
                      </div>

                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="space-y-4 pt-4 border-t border-aurum-border">
                <div className="flex items-center justify-between">
                  {/* Internal Note Toggle */}
                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-aurum-text">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-aurum-border text-aurum-gold focus:ring-aurum-gold"
                    />
                    <span className="flex items-center space-x-1 text-amber-400">
                      <Lock className="w-3 h-3" />
                      <span>Internal Staff-Only Note (Hidden from Customer)</span>
                    </span>
                  </label>

                  {/* Status Dropdown */}
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value as TicketStatus)}
                    className="px-2.5 py-1 rounded-lg bg-aurum-surface border border-aurum-border text-xs text-aurum-text font-semibold focus:outline-none"
                  >
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="WAITING_ON_CUSTOMER">Waiting on Customer</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={
                    isInternalNote
                      ? 'Write a private compliance/vault note that only internal staff can view...'
                      : 'Type official response to client...'
                  }
                  rows={3}
                  className={`w-full p-3 rounded-2xl border text-xs text-aurum-text focus:outline-none ${
                    isInternalNote
                      ? 'bg-amber-500/5 border-amber-500/40 focus:border-amber-400'
                      : 'bg-aurum-surface border-aurum-border focus:border-aurum-gold/60'
                  }`}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant={isInternalNote ? 'secondary' : 'primary'}
                    size="sm"
                    isLoading={isReplying}
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    {isInternalNote ? 'Log Private Staff Note' : 'Send Client Reply'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
