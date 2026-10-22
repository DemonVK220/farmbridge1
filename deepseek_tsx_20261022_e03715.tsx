import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, XCircle, AlertTriangle, Database, Server, Key, RefreshCw, Zap, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { API_MODE } from '../api/client';
import { tokenStore } from '../utils/tokenStore';

export const DevDiagnosticsPage: React.FC = () => {
  const { currentUser, cartItems, orders, savedProductIds } = useApp();
  const [health, setHealth] = useState<'checking' | 'ok' | 'fail' | 'mock'>('checking');
  const [healthDetail, setHealthDetail] = useState<string>('');

  const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || '/api/v1';
  const HEALTH_URL = API_BASE.replace(/\/api\/v1\/?$/, '/health');

  const checkHealth = async () => {
    if (API_MODE === 'mock') {
      setHealth('mock');
      setHealthDetail('Running in mock mode — backend not contacted.');
      return;
    }
    setHealth('checking');
    try {
      const res = await fetch(HEALTH_URL);
      if (res.ok) {
        const data = await res.json();
        setHealth('ok');
        setHealthDetail(`env=${data.env || '?'} · ${data.timestamp || ''}`);
      } else {
        setHealth('fail');
        setHealthDetail(`HTTP ${res.status} ${res.statusText}`);
      }
    } catch (err: any) {
      setHealth('fail');
      setHealthDetail(err.message || 'Network unreachable');
    }
  };

  useEffect(() => { checkHealth(); }, []);

  const statusIcon = (s: string) => {
    if (s === 'ok') return <CheckCircle2 className="w-4 h-4 text-emerald-700" />;
    if (s === 'fail') return <XCircle className="w-4 h-4 text-red-700" />;
    if (s === 'mock') return <Info className="w-4 h-4 text-blue-700" />;
    return <RefreshCw className="w-4 h-4 text-stone-500 animate-spin" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 text-stone-100 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3 h-3 text-emerald-400" /><span>Developer Diagnostics</span>
          </div>
          <h1 className="text-2xl font-extrabold font-serif text-stone-900">System Status</h1>
          <p className="text-xs text-stone-500 mt-1">Hidden route — accessed via <code className="bg-stone-100 px-1 rounded text-[10px] font-mono">#dev-diagnostics</code>.</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${API_MODE === 'real' ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'}`}>{API_MODE} mode</span>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-serif text-stone-900 flex items-center gap-2"><Server className="w-4 h-4 text-emerald-700" /> Backend Connectivity</h2>
          <button onClick={checkHealth} className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"><RefreshCw className="w-3 h-3" /> Re-check</button>
        </div>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2 text-xs">
          {statusIcon(health)}
          <div className="flex-1">
            <div className="font-bold text-stone-900 capitalize">{health}</div>
            <div className="text-stone-600 mt-0.5">{healthDetail}</div>
            <div className="text-stone-500 text-[10px] mt-1 font-mono">{HEALTH_URL}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
        <h2 className="text-base font-bold font-serif text-stone-900 flex items-center gap-2"><Key className="w-4 h-4 text-emerald-700" /> Session & Auth</h2>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between py-1.5 border-b border-stone-100"><span className="text-stone-500">Signed-in user:</span><strong className="text-stone-900">{currentUser ? `${currentUser.name} (${currentUser.role})` : '—'}</strong></div>
          <div className="flex justify-between py-1.5 border-b border-stone-100"><span className="text-stone-500">JWT present:</span><strong className={tokenStore.isValid() ? 'text-emerald-700' : 'text-stone-500'}>{tokenStore.isValid() ? 'Yes (valid)' : tokenStore.get() ? 'Expired' : 'No'}</strong></div>
          <div className="flex justify-between py-1.5"><span className="text-stone-500">Token expiry:</span><strong className="text-stone-900 font-mono text-[10px]">{tokenStore.expiresAt() || '—'}</strong></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
        <h2 className="text-base font-bold font-serif text-stone-900 flex items-center gap-2"><Database className="w-4 h-4 text-emerald-700" /> Local Persisted State</h2>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center"><div className="text-2xl font-extrabold text-emerald-950 font-serif">{cartItems.length}</div><div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold mt-1">Cart items</div></div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center"><div className="text-2xl font-extrabold text-emerald-950 font-serif">{orders.length}</div><div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold mt-1">Orders</div></div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center"><div className="text-2xl font-extrabold text-emerald-950 font-serif">{savedProductIds.length}</div><div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold mt-1">Saved items</div></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
        <h2 className="text-base font-bold font-serif text-stone-900 flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-700" /> Endpoint Coverage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
          {[
            ['sendOtp', 'POST /auth/send-otp', true],
            ['verifyOtp', 'POST /auth/verify-otp', true],
            ['getProducts', 'GET /products', true],
            ['getProduct', 'GET /products/:id', true],
            ['getFarmers', 'GET /farmers', true],
            ['getFarmer', 'GET /farmers/:id', true],
            ['getBatch', 'GET /batches/:id', true],
            ['createOrder', 'POST /orders', true],
            ['getOrder', 'GET /orders/:id', true],
            ['updateOrderStatus', 'PATCH /orders/:id/status', true],
            ['submitRating', 'POST /orders/:id/rating', true],
            ['reportIssue', 'POST /orders/:id/issue', true],
            ['joinGroupOrder', 'POST /group-orders/:id/join', true],
            ['createSubscription', 'POST /subscriptions', true],
            ['createRfq', 'POST /rfqs', true],
            ['getHelplines', 'GET /helplines', true],
            ['getNotifications', 'GET /notifications', true],
            ['markNotificationRead', 'PATCH /notifications/:id', true],
            ['textSearch', 'POST /search/text', true],
            ['paymentsWebhook', 'POST /payments/webhook', true],
          ].map(([name, path, implemented]) => (
            <div key={name as string} className="flex items-center gap-2 py-1.5 px-2 bg-stone-50 rounded-lg">
              {implemented ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
              <span className="font-mono text-[10px] text-stone-700 flex-1 truncate">{path}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Do not expose this page in production without auth.</strong>
          <p className="leading-relaxed mt-0.5">The diagnostics view reveals backend URLs. In production, gate behind admin role check.</p>
        </div>
      </div>
    </div>
  );
};