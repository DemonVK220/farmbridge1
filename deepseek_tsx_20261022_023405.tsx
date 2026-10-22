import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Truck, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateCheckoutPricing } from '../utils/rules';
import { RupeeSymbol } from '../components/Currency';

export const CheckoutPage: React.FC = () => {
  const { cartItems, placeOrderAsync, setCurrentView, apiMode } = useApp();

  const [customerName, setCustomerName] = useState('V. K. Leon');
  const [customerPhone, setCustomerPhone] = useState('+91 98401 23456');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103');
  const [deliveryMethod, setDeliveryMethod] = useState<'home_delivery' | 'farm_pickup'>('home_delivery');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'CashOnDelivery'>('UPI');
  const [upiId, setUpiId] = useState('vkleon@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slotWindows = [
    { id: '06-09' as const, label: 'Early Morning', time: '6 – 9 AM', fee: 0 },
    { id: '09-12' as const, label: 'Morning', time: '9 AM – 12 PM', fee: 0 },
    { id: '12-15' as const, label: 'Afternoon', time: '12 – 3 PM', fee: 0 },
    { id: '15-18' as const, label: 'Evening', time: '3 – 6 PM', fee: 0 },
    { id: '18-21' as const, label: 'Night', time: '6 – 9 PM', fee: 20 },
  ];
  const availableDates = Array.from({ length: 3 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return { iso: d.toISOString().split('T')[0], label: i === 0 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) };
  });
  const [selectedDate, setSelectedDate] = useState(availableDates[0].iso);
  const [selectedWindow, setSelectedWindow] = useState<typeof slotWindows[0]['id']>('09-12');

  const pricing = calculateCheckoutPricing(
    cartItems.map((item) => ({
      farmerId: item.farmer.id, farmerName: item.farmer.name,
      quantity: item.quantity, basePrice: item.baseUnitPrice, discountedPrice: item.effectiveUnitPrice,
    })),
    deliveryMethod
  );

  const slotFee = deliveryMethod === 'home_delivery' ? (slotWindows.find((w) => w.id === selectedWindow)?.fee || 0) : 0;
  const finalTotal = pricing.totalPayable + slotFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress.trim() || !customerName.trim() || !customerPhone.trim()) {
      alert('Please fill in your delivery address, name, and phone number.');
      return;
    }
    setIsSubmitting(true);
    const slot = deliveryMethod === 'home_delivery' ? { date: selectedDate, window: selectedWindow, fee: slotFee } : undefined;
    try {
      await placeOrderAsync(deliveryAddress, customerName, customerPhone, deliveryMethod, paymentMethod, slot);
    } catch { /* handled */ } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentView('cart')} className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /><span>Return to Basket</span>
        </button>
        <span className="text-xs text-stone-500 flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-700" /><span>Upfront Fair Trade Checkout</span></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 font-serif">1. Delivery & Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Phone (OTP)</label>
                <input type="tel" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Fulfillment Mode:</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setDeliveryMethod('home_delivery')} className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${deliveryMethod === 'home_delivery' ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold' : 'border-stone-200 bg-stone-50 text-stone-700'}`}>
                  <div className="flex items-center gap-2 mb-1"><Truck className="w-4 h-4 text-emerald-700" /><span className="text-xs">Direct Home Delivery</span></div>
                  <span className="text-[11px] text-stone-500 font-normal block">Insulated crates</span>
                </button>
                <button type="button" onClick={() => setDeliveryMethod('farm_pickup')} className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${deliveryMethod === 'farm_pickup' ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold' : 'border-stone-200 bg-stone-50 text-stone-700'}`}>
                  <div className="flex items-center gap-2 mb-1"><CheckCircle className="w-4 h-4 text-emerald-700" /><span className="text-xs inline-flex items-center">Farm Pickup (<RupeeSymbol size={10} className="mr-0.5" />0)</span></div>
                  <span className="text-[11px] text-stone-500 font-normal block">Collect from farmer shed</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Full Delivery Address & PIN Code</label>
              <textarea required rows={2} value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700" />
            </div>

            {deliveryMethod === 'home_delivery' && (
              <div className="pt-2 border-t border-stone-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">Preferred Delivery Date</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableDates.map((d) => (
                      <button key={d.iso} type="button" onClick={() => setSelectedDate(d.iso)} className={`py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${selectedDate === d.iso ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20' : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-white'}`}>{d.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">Preferred Time Window</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {slotWindows.map((w) => {
                      const active = selectedWindow === w.id;
                      return (
                        <button key={w.id} type="button" onClick={() => setSelectedWindow(w.id)} className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${active ? 'border-emerald-700 bg-emerald-50 ring-2 ring-emerald-600/20' : 'border-stone-200 bg-stone-50 hover:bg-white'}`}>
                          <span className={`block text-[11px] font-bold ${active ? 'text-emerald-950' : 'text-stone-800'}`}>{w.label}</span>
                          <span className="block text-[10px] text-stone-500 mt-0.5">{w.time}</span>
                          <span className={`block text-[10px] font-semibold mt-1 inline-flex items-center ${w.fee > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>{w.fee > 0 ? <>+<RupeeSymbol size={9} className="mx-0.5" />{w.fee} surcharge</> : 'No extra fee'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-900 font-serif">2. Payment Method</h2>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">{apiMode === 'real' ? 'Real Backend · Simulated Payment' : 'Simulated Test Gateway'}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Prototype Demonstration Mode:</strong>
                <span>Payments are safely simulated. Production connects to RBI-licensed gateways and automated farmer UPI settlement.</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-emerald-700 bg-emerald-50/60 font-bold' : 'border-stone-200 bg-stone-50'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="accent-emerald-800" />
                <div className="flex-1"><span className="text-xs text-stone-900 block font-bold">UPI (Google Pay / PhonePe / Paytm / BHIM)</span><span className="text-[11px] text-stone-500 font-normal">Instant bank-to-farmer VPA</span></div>
              </label>
              {paymentMethod === 'UPI' && (
                <div className="pl-6 pt-1">
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Simulated UPI ID:</label>
                  <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono" />
                </div>
              )}
              <label className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-emerald-700 bg-emerald-50/60 font-bold' : 'border-stone-200 bg-stone-50'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} className="accent-emerald-800" />
                <div className="flex-1"><span className="text-xs text-stone-900 block font-bold">Debit / Credit Card / NetBanking</span><span className="text-[11px] text-stone-500 font-normal">Secure 3D-secure simulated payment</span></div>
              </label>
              <label className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'CashOnDelivery' ? 'border-emerald-700 bg-emerald-50/60 font-bold' : 'border-stone-200 bg-stone-50'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'CashOnDelivery'} onChange={() => setPaymentMethod('CashOnDelivery')} className="accent-emerald-800" />
                <div className="flex-1"><span className="text-xs text-stone-900 block font-bold">Cash / UPI upon Delivery</span><span className="text-[11px] text-stone-500 font-normal">Inspect freshness with delivery partner first</span></div>
              </label>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4 disabled:opacity-60">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{isSubmitting ? 'Confirming Order...' : <span className="inline-flex items-center">Confirm & Place Order (<RupeeSymbol size={14} className="ml-0.5" />{finalTotal})</span>}</span>
            </button>
          </div>
        </form>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-serif">Full Upfront Breakdown</h3>
            <div className="space-y-2 text-xs">
              {pricing.farmerSplits.map((split) => (
                <div key={split.farmerId} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div><strong className="block text-stone-900 font-semibold">{split.farmerName}</strong><span className="text-[10px] text-stone-500">{split.itemsCount} produce units</span></div>
                  <span className="font-bold text-stone-900 inline-flex items-center"><RupeeSymbol size={11} />{split.subtotal}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-xs text-stone-700 pt-3 border-t border-stone-200">
              <div className="flex justify-between"><span className="text-stone-500">Produce Subtotal:</span><span className="inline-flex items-center"><RupeeSymbol size={11} />{pricing.itemsSubtotal}</span></div>
              {pricing.totalSurplusSavings > 0 && <div className="flex justify-between text-orange-700 font-semibold"><span>Surplus Freshness Discount:</span><span className="inline-flex items-center">-<RupeeSymbol size={11} />{pricing.totalSurplusSavings}</span></div>}
              <div className="flex justify-between"><span className="text-stone-500">Third-party Delivery ({pricing.farmerSplits.length} farm hub):</span><span className="inline-flex items-center"><RupeeSymbol size={11} />{pricing.deliveryCharge}</span></div>
              {slotFee > 0 && <div className="flex justify-between text-amber-800"><span>Preferred Slot Surcharge:</span><span className="inline-flex items-center">+<RupeeSymbol size={11} />{slotFee}</span></div>}
              <div className="flex justify-between items-center text-emerald-900 font-bold bg-emerald-50 p-2 rounded-xl"><span>FarmBridge Platform Fee:</span><span className="text-xs uppercase inline-flex items-center"><RupeeSymbol size={10} className="mr-0.5" />0 (Free)</span></div>
              <div className="flex justify-between text-stone-500"><span>GST & Statutory Taxes:</span><span className="inline-flex items-center"><RupeeSymbol size={11} />0 (Agricultural Exemption)</span></div>
            </div>
            <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Total Payable Now:</span>
                <span className="text-2xl font-extrabold text-stone-900 font-serif inline-flex items-center"><RupeeSymbol size={20} />{finalTotal}</span>
              </div>
              <span className="text-[11px] text-emerald-800 font-semibold">100% upfront transparency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};