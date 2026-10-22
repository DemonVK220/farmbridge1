import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  QrCode,
  MapPin,
  Phone,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RupeeSymbol } from '../components/Currency';

export const DeliveryPartnerDashboardPage: React.FC = () => {
  const { orders, updateOrderStatus, addToast } = useApp();
  const [partnerName] = useState('Rajesh K. (EcoExpress Rural Courier)');
  const [partnerVehicle] = useState('KA-05-EV-4192 (Insulated Cargo EV)');
  const [handoverOtpInput, setHandoverOtpInput] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');

  const activeDeliveries = orders.filter((o) => o.orderStatus !== 'completed');
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleVerifyOtpDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (handoverOtpInput === selectedOrder.confirmationOtp) {
      updateOrderStatus(
        selectedOrder.id,
        'delivered',
        `Confirmed delivery by Partner ${partnerName} via customer OTP verification.`
      );
      setHandoverOtpInput('');
      addToast('success', `Delivery confirmed for order #${selectedOrder.orderCode}!`);
    } else {
      addToast('error', 'Invalid OTP! Please cross-check with the receiving customer.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
            Logistics & Delivery Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white mt-1">
            {partnerName}
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Vehicle: {partnerVehicle} • FarmBridge Verified Logistics Hub
          </p>
        </div>

        <div className="bg-stone-800 p-3 rounded-2xl border border-stone-700 text-xs text-right">
          <span className="text-stone-400 block">Assigned Shipments:</span>
          <strong className="text-lg text-emerald-400 font-bold">
            {activeDeliveries.length} Active Run
          </strong>
        </div>
      </div>

      {/* Main Delivery Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Deliveries List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-bold text-stone-900 font-serif">
            Assigned Farm Deliveries
          </h2>

          <div className="space-y-4">
            {orders.map((order) => {
              const isSelected = order.id === selectedOrder?.id;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-700 bg-white shadow-md ring-2 ring-emerald-600/20'
                      : 'border-stone-200 bg-stone-50/70 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <strong className="text-sm font-bold text-stone-900">
                        Order #{order.orderCode}
                      </strong>
                      <span className="text-xs text-stone-500 block">
                        Customer: {order.customerName} ({order.customerPhone})
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 flex items-start gap-1.5 mb-3">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{order.deliveryAddress}</span>
                  </p>

                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs flex justify-between text-stone-600">
                    <span>Produce Crates: {order.items.length} lots</span>
                    <span className="flex items-center">Payable: <RupeeSymbol size={10} className="mx-0.5" />{order.totalPayable} (Paid Online)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Handover Verification & Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Confirm Handover for #{selectedOrder?.orderCode}
            </h3>

            {/* Quick status updater buttons */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-stone-700 block">Update Shipment State:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateOrderStatus(
                      selectedOrder.id,
                      'picked_up',
                      'Inspected and collected from farm gate by partner.'
                    )
                  }
                  className="py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl"
                >
                  Confirm Pickup
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateOrderStatus(
                      selectedOrder.id,
                      'in_transit',
                      'Out for final delivery in refrigerated container.'
                    )
                  }
                  className="py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl"
                >
                  Mark In Transit
                </button>
              </div>
            </div>

            {/* OTP Handover Form */}
            <form onSubmit={handleVerifyOtpDelivery} className="pt-3 border-t border-stone-200 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Customer Handover OTP:
                </label>
                <p className="text-[11px] text-stone-500 mb-2">
                  Ask the customer for the 4-digit OTP shown on their screen or SMS. (Demo hint: {selectedOrder?.confirmationOtp})
                </p>
                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="Enter 4-digit code"
                  value={handoverOtpInput}
                  onChange={(e) => setHandoverOtpInput(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-center font-mono font-bold text-base text-stone-900 tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Verify OTP & Mark Delivered
              </button>
            </form>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500 space-y-1">
              <span className="font-semibold text-stone-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Proof of Delivery Protocol
              </span>
              <p className="text-[11px] leading-relaxed">
                OTP verification ensures proof of delivery before funds are settled to the farmer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
