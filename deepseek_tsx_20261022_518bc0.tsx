import React, { useState } from 'react';
import { Send, CheckCircle2, Building2, Sprout, MessageSquare, Phone, MapPin, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { addToast, setCurrentView } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<'general' | 'farmer' | 'order' | 'press' | 'legal'>('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('success', 'Message received! We will respond within 2 business days.');
  };

  const channels = [
    { icon: Sprout, title: 'Farmer Support', detail: 'Onboarding, verification, or listing help', value: 'farmers@farmbridge.in', href: 'mailto:farmers@farmbridge.in' },
    { icon: Building2, title: 'Business & Bulk Procurement', detail: 'RFQs, tenders, hostel/restaurant accounts', value: 'business@farmbridge.in', href: 'mailto:business@farmbridge.in' },
    { icon: MessageSquare, title: 'Order & Delivery Issues', detail: 'Include order code and photos in your message', value: 'support@farmbridge.in', href: 'mailto:support@farmbridge.in' },
    { icon: Phone, title: 'Grievance Officer (as per IT Rules)', detail: 'Formal complaints and data privacy requests', value: 'grievance@farmbridge.in', href: 'mailto:grievance@farmbridge.in' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" /><span>We're Here to Help</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900">Contact FarmBridge India</h1>
        <p className="text-sm text-stone-600 leading-relaxed">Reach the right team for farmer support, business procurement, order issues, or press enquiries. For urgent agricultural government helplines, see our <button onClick={() => setCurrentView('helplines')} className="text-emerald-800 font-semibold underline">Helpline Directory</button>.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto"><CheckCircle2 className="w-9 h-9" /></div>
              <h2 className="text-2xl font-bold font-serif text-stone-900">Message Sent</h2>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">Thank you! Our team typically responds within 2 business days.</p>
              <button onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); }} className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer">Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="text-base font-bold font-serif text-stone-900 mb-3">Send us a message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Your Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Raman" className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Topic *</label>
                <select value={topic} onChange={(e) => setTopic(e.target.value as any)} className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none cursor-pointer">
                  <option value="general">General enquiry</option>
                  <option value="farmer">Farmer onboarding / verification</option>
                  <option value="order">Order, delivery, or refund issue</option>
                  <option value="press">Press & media</option>
                  <option value="legal">Legal, grievance, or privacy request</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Message *</label>
                <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your question or issue. For order-related messages, include your order code." className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-2xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /><span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-bold font-serif text-sm text-stone-900">Direct Email Channels</h3>
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <a key={c.title} href={c.href} className="block p-3 bg-stone-50 hover:bg-emerald-50/70 rounded-2xl border border-stone-200 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <strong className="block text-xs text-stone-900">{c.title}</strong>
                      <span className="text-[10px] text-stone-500 block">{c.detail}</span>
                      <span className="text-xs text-emerald-800 font-semibold mt-0.5 block truncate">{c.value} →</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-5 border border-stone-800 space-y-2">
            <h3 className="font-bold font-serif text-sm text-white flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" />Registered Office</h3>
            <p className="text-[11px] text-stone-400 leading-relaxed">FarmBridge India (Prototype)<br />Innovation Lab — Student Project<br />Bengaluru, Karnataka 560103<br />India</p>
            <p className="text-[10px] text-stone-500 pt-2 border-t border-stone-800">Demonstration prototype for a student innovation challenge.</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950">
            <strong className="block font-bold flex items-center gap-1.5 mb-1"><Clock className="w-3.5 h-3.5" />Response Times</strong>
            <p className="leading-relaxed text-[11px]">Order issues: within 24 hours. Farmer verification: 2–3 business days. Legal/grievance: 30 days as per applicable Indian IT Rules.</p>
          </div>
        </div>
      </div>
    </div>
  );
};