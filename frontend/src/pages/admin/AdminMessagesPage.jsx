import React, { useState, useEffect } from 'react';
import { Mail, Check, Users } from 'lucide-react';
import { adminService } from '../../services/api';

export const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [activeTab, setActiveTab] = useState('messages');

  const loadData = async () => {
    try {
      const [msgRes, subRes] = await Promise.all([
        adminService.getContactMessages(),
        adminService.getNewsletterSubscribers(),
      ]);
      if (msgRes.data.success) setMessages(msgRes.data.messages);
      if (subRes.data.success) setSubscribers(subRes.data.subscribers);
    } catch (e) {
      console.warn('Failed to load inquiries:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await adminService.markMessageRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
    } catch (e) {
      alert('Failed to mark read');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-ivory-200 pb-4 flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
            Inbound Communications
          </span>
          <h1 className="font-serif text-3xl font-semibold text-charcoal-900 tracking-tight">
            Client Messages &amp; Subscribers
          </h1>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'messages' ? 'bg-charcoal-800 text-ivory-50' : 'bg-ivory-200 text-charcoal-700'
            }`}
          >
            Inquiries ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'subscribers' ? 'bg-charcoal-800 text-ivory-50' : 'bg-ivory-200 text-charcoal-700'
            }`}
          >
            Newsletter Subscribers ({subscribers.length})
          </button>
        </div>
      </div>

      {activeTab === 'messages' ? (
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-xs text-charcoal-500 py-8 text-center">No client inquiries received.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-5 rounded-xl border transition-all ${
                  msg.isRead
                    ? 'bg-ivory-50 border-ivory-200'
                    : 'bg-white border-sage-300 shadow-sm'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ivory-200 pb-2 mb-2 text-xs">
                  <div>
                    <span className="font-bold text-charcoal-900 mr-2">{msg.name}</span>
                    <span className="text-charcoal-500">({msg.email} {msg.phone ? `• ${msg.phone}` : ''})</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] text-charcoal-400">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="text-[11px] text-sage-700 font-semibold hover:underline flex items-center"
                      >
                        <Check className="w-3 h-3 mr-0.5" /> Mark Read
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs font-semibold text-sage-800 uppercase tracking-wider mb-1">
                  Topic: {msg.subject}
                </p>
                <p className="text-xs text-charcoal-700 leading-relaxed font-light whitespace-pre-line">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-ivory-50 border border-ivory-300 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 text-charcoal-600 uppercase tracking-wider font-semibold text-[10px] border-b border-ivory-200">
              <tr>
                <th className="py-3 px-4">Subscriber Email</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Date Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-ivory-100/50">
                  <td className="py-3 px-4 font-semibold text-charcoal-900">{s.email}</td>
                  <td className="py-3 px-4 text-charcoal-600">{s.source}</td>
                  <td className="py-3 px-4 text-charcoal-500">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
