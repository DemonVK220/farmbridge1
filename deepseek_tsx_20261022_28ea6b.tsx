import React from 'react';
import { ShoppingBag, MapPin, CalendarCheck, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RupeeSymbol } from '../components/Currency';

export const CustomerDashboardPage: React.FC = () => {
  const { orders, subscriptions, navigateToOrder, setCurrentView, updateOrderStatusAsync, getNextOrderStatus } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2"><span>Home</span><span>/</span><span className="text-stone-900 font-semibold">Household Customer Portal</span></div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif">Customer Orders & Subscriptions</h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">Track active direct farm deliveries, manage weekly baskets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 font-serif">Recent Farm Orders</h2>
            <div className="space-y-4 divide-y divide-stone-100">
              {orders.map((order) => (
                <div key={order.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-sm text-stone-900">Order #{order.orderCode}</span>
                      <span className="text-xs text-stone-500 block">Placed: {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} lines</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-900' : order.orderStatus === 'in_transit' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'}`}>{order.orderStatus.replace('_', ' ')}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between"><span>{item.quantity} {item.unit} × {item.title}</span><strong className="text-stone-900 inline-flex items-center"><RupeeSymbol size={11} className="mr-0.5" />{item.totalPrice}</strong></div>
                    ))}
                    <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                      <span className="flex items-center">Total Paid (Platform Fee <RupeeSymbol size={10} className="mx-0.5" />0):</span>
                      <span className="inline-flex items-center"><RupeeSymbol size={13} className="mr-0.5" />{order.totalPayable}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                    <span className="text-stone-500">Handover OTP: <strong className="font-mono text-emerald-900">{order.confirmationOtp}</strong></span>
                    <div className="flex items-center gap-2">
                      {getNextOrderStatus(order.orderStatus) && (
                        <button onClick={async () => {
                          const next = getNextOrderStatus(order.orderStatus);
                          if (next) { try { await updateOrderStatusAsync(order.id, next, `Self-advanced via Customer Dashboard (demo).`); } catch {} }
                        }} className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold rounded-xl cursor-pointer flex items-center gap-1" title="Demo-only simulator">
                          <Zap className="w-3 h-3" /><span className="capitalize">{getNextOrderStatus(order.orderStatus)?.replace(/_/g, ' ')}</span>
                        </button>
                      )}
                      <button onClick={() => navigateToOrder(order.id)} className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1"><span>Track</span><ChevronRight className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2"><CalendarCheck className="w-4 h-4 text-emerald-700" /><span>Weekly Basket</span></h3>
            {subscriptions.length > 0 ? (
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-stone-500">Plan:</span><strong className="text-stone-900">{subscriptions[0].basketSize}</strong></div>
                <div className="flex justify-between"><span className="text-stone-500">Next:</span><span className="font-semibold">{subscriptions[0].preferredDeliveryDay}, {subscriptions[0].nextDeliveryDate}</span></div>
                <button onClick={() => setCurrentView('weekly_basket')} className="w-full mt-2 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold cursor-pointer">Manage Basket</button>
              </div>
            ) : <p className="text-xs text-stone-500">No active weekly subscription.</p>}
          </div>
          <div className="bg-stone-50 p-5 rounded-3xl border border-stone-200 text-xs text-stone-600 space-y-2">
            <strong className="block text-stone-900 font-bold">Delivery question?</strong>
            <p className="text-[11px] leading-relaxed">Check out our verified helpline directory.</p>
            <button onClick={() => setCurrentView('helplines')} className="text-emerald-800 font-bold underline">Open Helpline Directory →</button>
          </div>
        </div>
      </div>
    </div>
  );
};