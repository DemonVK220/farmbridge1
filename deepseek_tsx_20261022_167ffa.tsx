import React, { useEffect } from 'react';
import { X, Printer, Sprout, ShieldCheck } from 'lucide-react';
import { OrderRecord } from '../types';
import { RupeeSymbol } from './Currency';

interface Props { order: OrderRecord; onClose: () => void; }

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const OrderInvoiceModal: React.FC<Props> = ({ order, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const slotFee = order.deliverySlot?.fee || 0;
  const slotWindowLabel: Record<string, string> = { '06-09': '6 – 9 AM', '09-12': '9 AM – 12 PM', '12-15': '12 – 3 PM', '15-18': '3 – 6 PM', '18-21': '6 – 9 PM' };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-2xl my-6" onClick={(e) => e.stopPropagation()}>
        <div className="no-print flex justify-end gap-2 mb-3">
          <button onClick={onClose} className="px-3.5 py-2 bg-white/95 hover:bg-white text-stone-800 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5">
            <X className="w-3.5 h-3.5" /><span>Close</span>
          </button>
          <button onClick={() => window.print()} className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5">
            <Printer className="w-3.5 h-3.5" /><span>Print / Save as PDF</span>
          </button>
        </div>
        <div className="print-area bg-white rounded-3xl p-8 shadow-2xl border border-stone-200 space-y-6">
          <div className="flex items-start justify-between border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center"><Sprout className="w-6 h-6 text-emerald-300" /></div>
              <div>
                <div className="font-extrabold text-lg text-emerald-950 font-serif">FarmBridge.in</div>
                <div className="text-[10px] text-stone-500">From Farmers to Families, More Directly.</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider font-bold text-stone-500">Tax Invoice</div>
              <div className="font-mono text-sm font-bold text-stone-900 mt-0.5">{order.orderCode}</div>
              <div className="text-[10px] text-stone-500 mt-0.5">Issued: {fmtDate(order.createdAt)}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase text-stone-500 mb-1">Billed To</div>
              <div className="font-bold text-stone-900">{order.customerName}</div>
              <div className="text-stone-600">{order.customerPhone}</div>
              <div className="text-stone-600 mt-0.5 leading-snug">{order.deliveryAddress}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-stone-500 mb-1">Delivery</div>
              <div className="text-stone-800 font-semibold capitalize">{order.deliveryMethod.replace('_', ' ')}</div>
              {order.deliverySlot ? (
                <div className="text-stone-600 mt-0.5">{fmtDate(order.deliverySlot.date)} • {slotWindowLabel[order.deliverySlot.window]}</div>
              ) : <div className="text-stone-500 mt-0.5 italic">No preferred slot</div>}
              <div className="text-stone-600 mt-1">Payment: <span className="font-semibold">{order.paymentMethod}</span> • {order.paymentStatus === 'demo_paid' ? 'Simulated Paid' : 'Pending'}</div>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-stone-500 mb-2">Direct from Farms</div>
            <div className="space-y-1.5">
              {order.farmerSplits.map((fs) => (
                <div key={fs.farmerId} className="flex justify-between text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
                  <span className="text-stone-800 font-semibold">{fs.farmerName}</span>
                  <span className="inline-flex items-center font-bold text-stone-900"><RupeeSymbol size={11} />{fs.amount}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-stone-500 mb-2">Produce Lines</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-[10px] uppercase text-stone-500">
                  <th className="text-left py-2">Item</th><th className="text-right py-2">Qty</th><th className="text-right py-2">Rate</th><th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, i) => (
                  <tr key={i} className="border-b border-stone-100">
                    <td className="py-2">
                      <div className="font-semibold text-stone-900">{it.title}</div>
                      <div className="text-[10px] text-stone-500">{it.farmerName} • Batch #{it.batchId.replace('batch-', '')}</div>
                    </td>
                    <td className="text-right py-2 text-stone-800">{it.quantity} {it.unit}</td>
                    <td className="text-right py-2 text-stone-800"><span className="inline-flex items-center justify-end"><RupeeSymbol size={10} />{it.unitPrice}</span></td>
                    <td className="text-right py-2 font-bold text-stone-900"><span className="inline-flex items-center justify-end"><RupeeSymbol size={10} />{it.totalPrice}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t-2 border-stone-900 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600"><span>Produce Subtotal</span><span className="inline-flex items-center"><RupeeSymbol size={10} />{order.produceSubtotal}</span></div>
            {order.surplusSavings > 0 && <div className="flex justify-between text-orange-700"><span>Surplus Freshness Savings</span><span className="inline-flex items-center">-<RupeeSymbol size={10} />{order.surplusSavings}</span></div>}
            <div className="flex justify-between text-stone-600"><span>Third-party Delivery</span><span className="inline-flex items-center"><RupeeSymbol size={10} />{order.deliveryFee}</span></div>
            {slotFee > 0 && <div className="flex justify-between text-amber-800"><span>Preferred Slot Surcharge</span><span className="inline-flex items-center">+<RupeeSymbol size={10} />{slotFee}</span></div>}
            <div className="flex justify-between text-emerald-800 font-semibold"><span>FarmBridge Platform Fee</span><span className="inline-flex items-center"><RupeeSymbol size={10} />0</span></div>
            <div className="flex justify-between text-stone-600"><span>GST (Fresh Produce)</span><span className="inline-flex items-center"><RupeeSymbol size={10} />0</span></div>
            <div className="flex justify-between items-baseline border-t border-stone-300 pt-2 mt-1 font-bold text-base text-stone-900">
              <span>Total Payable</span>
              <span className="inline-flex items-center font-serif font-extrabold"><RupeeSymbol size={16} />{order.totalPayable}</span>
            </div>
          </div>
          <div className="pt-4 border-t border-stone-200 text-[10px] text-stone-500 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <ShieldCheck className="w-3 h-3" /><span>Demo Invoice — Not a legal document</span>
            </div>
            <p>This invoice is issued by FarmBridge India as a demonstration prototype. Produce is direct-sourced from verified farmers with zero platform fee.</p>
            <p>Questions? support@farmbridge.in • Helplines: Kisan Call Centre 1800-180-1551, PMFBY 14447</p>
          </div>
        </div>
      </div>
    </div>
  );
};