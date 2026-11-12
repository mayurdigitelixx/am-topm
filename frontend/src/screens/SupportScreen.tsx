import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { apiService } from '../services/apiService';
import type { SupportTicket } from '../types';
import { MessageSquare, PhoneCall, Plus } from 'lucide-react';

export const SupportScreen: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const [tickets, setTickets] = useState<SupportTicket[]>(apiService.getTickets());
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Trip Issue');
  const [description, setDescription] = useState('');

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      showToast('Please fill ticket subject and description');
      return;
    }

    const created = apiService.createTicket({
      subject,
      category,
      description,
    });

    setTickets(apiService.getTickets());
    setShowNewTicket(false);
    setSubject('');
    setDescription('');
    showToast(`Support Ticket ${created.id} submitted successfully!`);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-slate-100">
      <TopBar title="Help & Support" showBack onBack={() => navigateTo('profile')} />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Instant Helpline Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div 
            onClick={() => showToast('Calling AM to PM 24/7 Helpline (+91 1800 200 4848)...')}
            className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center text-center cursor-pointer hover:border-slate-700 transition"
          >
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl mb-1.5">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-200">Call Support</div>
            <div className="text-[10px] text-slate-400 mt-0.5">24/7 Toll Free</div>
          </div>

          <div 
            onClick={() => showToast('Opening WhatsApp Concierge (+91 98201 44829)...')}
            className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center text-center cursor-pointer hover:border-slate-700 transition"
          >
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl mb-1.5">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-200">WhatsApp Help</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Instant Chat</div>
          </div>
        </div>

        {/* Support Tickets Section */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            My Support Tickets
          </div>
          <button
            onClick={() => setShowNewTicket(!showNewTicket)}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Raise Ticket</span>
          </button>
        </div>

        {showNewTicket && (
          <form onSubmit={handleSubmitTicket} className="p-4 bg-slate-900 rounded-2xl border border-amber-500/40 space-y-3 animate-fade-in">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Submit Grievance or Inquiry
            </h3>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              >
                <option value="Trip Issue">Trip Issue</option>
                <option value="Billing & Refund">Billing & Refund</option>
                <option value="Driver Conduct">Driver Conduct</option>
                <option value="App Feedback">App Feedback</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold block mb-1">Subject</label>
              <input
                type="text"
                placeholder="Brief summary of the issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold block mb-1">Description</label>
              <textarea
                placeholder="Detailed explanation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 h-20 resize-none"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNewTicket(false)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold bg-amber-500 text-slate-950 rounded-xl"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {tickets.map((t) => (
            <div key={t.id} className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{t.subject}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  t.status === 'Resolved'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {t.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>
              <div className="text-[10px] text-slate-500 font-mono pt-1">
                Ticket ID: {t.id} • {t.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
