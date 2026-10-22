import React, { useState } from 'react';
import {
  CheckCircle,
  Truck,
  ArrowRight,
  QrCode,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QRCodeModal } from '../components/QRCodeModal';
import { RupeeSymbol } from '../components/Currency';

export const OrderConfirmationPage: React.FC = () => {
  const { orders, selectedOrderId, setCurrentView, navigateToOrder } = useApp();
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-md text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800">
            Order Confirmed (Simulated Test)
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif mt-1">
            Thank You, {order.customerName}!
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Your fresh harvest order has been routed directly to the participating farmers.
          </p>
        </div>

        {/* Highlight Codes Box */}
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 grid grid-cols-2 gap-4 max-w-md mx-auto text-center">
          <div>
            <span className="text-[11px] text-stone-500 block uppercase font-bold tracking-wider">
              Order Reference
            </span>
            <strong className="text-lg font-bold text-stone-900 font-mono">
              {order.orderCode}
            </strong>
          </div>

          <div>
            <span className="text-[11px] text-stone-500 block uppercase font-bold tracking-wider">
              Delivery Handover OTP
            </span>
            <strong className="text-lg font-bold text-emerald-900 font-mono tracking-widest">
              {order.confirmationOtp}
            </strong>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => navigateToOrder(order.id)}
            className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl shadow-sm transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order & Delivery Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-800" />
            <span>Show Delivery QR Code</span>
          </button>
        </div>
      </div>

      {/* Order Summary & Farmer Splits Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 font-serif">
          Order Summary & Farm Origin
        </h3>

        <div className="space-y-3 divide-y divide-stone-100 text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between">
              <div>
                <strong className="text-stone-900 block font-semibold">{item.title}</strong>
                <span className="text-stone-500 text-[11px]">
                  Farmer: {item.farmerName} • Batch #{item.batchId}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-stone-900 inline-flex items-center">
                  {item.quantity} {item.unit} × <RupeeSymbol size={11} className="mx-0.5" />{item.unitPrice} = <RupeeSymbol size={11} className="mx-0.5" />{item.totalPrice}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-stone-200 text-xs space-y-1.5 text-stone-600">
          <div className="flex justify-between">
            <span>Produce Total:</span>
            <span className="inline-flex items-center"><RupeeSymbol size={11} />{order.produceSubtotal}</span>
          </div>
          {order.surplusSavings > 0 && (
            <div className="flex justify-between text-orange-700 font-medium">
              <span>Surplus Freshness Discount:</span>
              <span className="inline-flex items-center">-<RupeeSymbol size={11} />{order.surplusSavings}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Third-party Delivery:</span>
            <span className="inline-flex items-center"><RupeeSymbol size={11} />{order.deliveryFee}</span>
          </div>
          <div className="flex justify-between text-emerald-900 font-bold">
            <span>Platform Fee:</span>
            <span className="inline-flex items-center"><RupeeSymbol size={10} className="mr-0.5" />0 (Standard Marketplace)</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900 font-serif">
            <span>Total Payable:</span>
            <span className="inline-flex items-center"><RupeeSymbol size={16} />{order.totalPayable}</span>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Proof of Delivery */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={`Delivery Pass: ${order.orderCode}`}
        subtitle={`OTP: ${order.confirmationOtp} • Show this to delivery partner`}
        targetPath={`#order/${order.id}`}
        onNavigate={() => navigateToOrder(order.id)}
      />
    </div>
  );
};
