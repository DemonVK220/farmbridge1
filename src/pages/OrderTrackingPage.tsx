import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  ShieldCheck,
  AlertTriangle,
  Star,
  QrCode,
  MapPin,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderRecord } from '../types';
import { QRCodeModal } from '../components/QRCodeModal';

export const OrderTrackingPage: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    setCurrentView,
    updateOrderStatus,
    rateOrder,
    reportOrderIssue,
  } = useApp();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Rating state
  const [qualityRating, setQualityRating] = useState(5);
  const [freshnessRating, setFreshnessRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Issue reporting state
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueCategory, setIssueCategory] = useState<
    'quality' | 'quantity' | 'packaging' | 'delivery' | 'wrong_produce'
  >('quality');
  const [issueDescription, setIssueDescription] = useState('');

  const [qrModalOpen, setQrModalOpen] = useState(false);

  const stages: {
    key: OrderRecord['orderStatus'];
    title: string;
    description: string;
  }[] = [
    {
      key: 'order_placed',
      title: 'Order Placed',
      description: 'Order confirmed with zero platform fee.',
    },
    {
      key: 'farmer_confirmed',
      title: 'Farmer Confirmed',
      description: 'Farmer acknowledged batch inventory reservation.',
    },
    {
      key: 'produce_prepared',
      title: 'Produce Prepared',
      description: 'Produce sorted, weighed, and crated with batch tags.',
    },
    {
      key: 'picked_up',
      title: 'Picked Up by Partner',
      description: 'Local logistics partner verified handover at farm gate.',
    },
    {
      key: 'in_transit',
      title: 'In Transit',
      description: 'Produce en route in temperature-shielded delivery container.',
    },
    {
      key: 'delivered',
      title: 'Delivered',
      description: 'Secure handover confirmed with customer OTP or QR scan.',
    },
  ];

  const getStageIndex = (status: OrderRecord['orderStatus']) => {
    switch (status) {
      case 'order_placed':
        return 0;
      case 'farmer_confirmed':
        return 1;
      case 'produce_prepared':
        return 2;
      case 'ready_for_pickup':
        return 2;
      case 'picked_up':
        return 3;
      case 'in_transit':
        return 4;
      case 'delivered':
      case 'completed':
        return 5;
      case 'issue_reported':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIdx = getStageIndex(order.orderStatus);

  const handleSimulateNextStage = () => {
    if (order.orderStatus === 'order_placed') {
      updateOrderStatus(order.id, 'farmer_confirmed', 'Farmer confirmed batch stock.');
    } else if (order.orderStatus === 'farmer_confirmed') {
      updateOrderStatus(order.id, 'produce_prepared', 'Crates sorted and weighed at farm shed.');
    } else if (order.orderStatus === 'produce_prepared') {
      updateOrderStatus(order.id, 'picked_up', 'Handed over to verified local delivery partner.');
    } else if (order.orderStatus === 'picked_up') {
      updateOrderStatus(order.id, 'in_transit', 'Out for delivery to customer address.');
    } else if (order.orderStatus === 'in_transit') {
      updateOrderStatus(
        order.id,
        'delivered',
        `Package delivered to doorstep. Verified by Customer OTP ${order.confirmationOtp}.`
      );
    }
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateOrder(order.id, qualityRating, freshnessRating, deliveryRating, ratingComment);
  };

  const handleReportIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) return;
    reportOrderIssue(order.id, issueCategory, issueDescription);
    setShowIssueModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentView('browse')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <span className="text-xs font-mono text-stone-500">Order #{order.orderCode}</span>
      </div>

      {/* Main Tracking Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif text-stone-900">
                Live Order Traceability
              </h1>
              {order.orderStatus === 'delivered' ? (
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Delivered
                </span>
              ) : order.orderStatus === 'issue_reported' ? (
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Under Resolution
                </span>
              ) : (
                <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Active Dispatch
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Destination: {order.deliveryAddress}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-800" />
              <span>Handover QR</span>
            </button>

            {/* Stage advance simulator for testing */}
            {order.orderStatus !== 'delivered' && (
              <button
                type="button"
                onClick={handleSimulateNextStage}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                title="Test button to advance order in prototype"
              >
                Simulate Next Stage →
              </button>
            )}
          </div>
        </div>

        {/* Multi-Stage Visual Timeline */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {stages.map((stage, idx) => {
              const isPastOrCurrent = idx <= currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div
                  key={stage.key}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-emerald-700 bg-emerald-50/80 shadow-xs'
                      : isPastOrCurrent
                      ? 'border-emerald-200 bg-white'
                      : 'border-stone-200 bg-stone-50/70 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? 'bg-emerald-700 text-white'
                          : isPastOrCurrent
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {isPastOrCurrent && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    )}
                  </div>

                  <strong className="block text-xs font-bold text-stone-900 leading-tight">
                    {stage.title}
                  </strong>
                  <span className="text-[10px] text-stone-500 block mt-1 leading-snug">
                    {stage.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Log Feed */}
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Audit Activity Trail
          </h3>

          <div className="space-y-2 text-xs">
            {order.timeline.map((entry, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-stone-800 font-medium">{entry.note}</p>
                  <span className="text-[10px] text-stone-400">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Handover OTP Box */}
        <div className="p-4 bg-emerald-950 text-white rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-emerald-300 font-medium">Delivery Handover Code</span>
            <p className="text-[11px] text-stone-300">
              Share this OTP only when you physically receive and inspect your produce crates.
            </p>
          </div>
          <div className="bg-white text-emerald-950 font-mono font-extrabold text-xl px-4 py-2 rounded-xl tracking-widest shadow-xs">
            {order.confirmationOtp}
          </div>
        </div>

        {/* Actions for Delivered Orders: Verified Ratings & Issue Reports */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-xs text-stone-500">
            Encountered an issue with quality, weight, or delivery?
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowIssueModal(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Report Issue</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('helplines')}
              className="flex-1 sm:flex-none px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Helpline Support</span>
            </button>
          </div>
        </div>

        {/* Verified Rating Form (Accessible when delivered) */}
        {order.orderStatus === 'delivered' && !order.rating && (
          <form
            onSubmit={handleRatingSubmit}
            className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4"
          >
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Rate Your Harvest Experience (Verified Order)
              </h3>
              <p className="text-xs text-emerald-900/80">
                Ratings are only permitted from verified completed orders to prevent fake reviews.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Produce Quality:
                </label>
                <select
                  value={qualityRating}
                  onChange={(e) => setQualityRating(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 rounded-xl p-2 font-bold"
                >
                  <option value={5}>5 Stars - Excellent Grade</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Standard</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Freshness:
                </label>
                <select
                  value={freshnessRating}
                  onChange={(e) => setFreshnessRating(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 rounded-xl p-2 font-bold"
                >
                  <option value={5}>5 Stars - Farm Crisp</option>
                  <option value={4}>4 Stars - Fresh</option>
                  <option value={3}>3 Stars - Fair</option>
                  <option value={2}>2 Stars - Slightly Wilted</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Delivery Care:
                </label>
                <select
                  value={deliveryRating}
                  onChange={(e) => setDeliveryRating(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 rounded-xl p-2 font-bold"
                >
                  <option value={5}>5 Stars - On Time & Intact</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Delayed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Feedback for the Farmer:
              </label>
              <input
                type="text"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Delicious heirloom taste, well packaged in clean crates!"
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Publish Verified Rating
            </button>
          </form>
        )}

        {order.rating && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-950">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <strong>Verified Customer Review Published:</strong> Quality: {order.rating.qualityRating}★ • Freshness: {order.rating.freshnessRating}★ • Delivery: {order.rating.deliveryRating}★
              {order.rating.comment && <p className="italic mt-0.5">&ldquo;{order.rating.comment}&rdquo;</p>}
            </div>
          </div>
        )}
      </div>

      {/* Issue Report Modal */}
      {showIssueModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowIssueModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-stone-900 mb-1 font-serif">
              Report Order Issue
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Our dispute and quality resolution desk reviews customer claims alongside batch evidence.
            </p>

            <form onSubmit={handleReportIssueSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Problem Category:</label>
                <select
                  value={issueCategory}
                  onChange={(e: any) => setIssueCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-semibold"
                >
                  <option value="quality">Product Quality Defect</option>
                  <option value="quantity">Missing Produce or Incorrect Weight</option>
                  <option value="packaging">Transit Crate Damage</option>
                  <option value="delivery">Delivery Failure or Delay</option>
                  <option value="wrong_produce">Wrong Variety Received</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Describe the Issue in Detail:
                </label>
                <textarea
                  required
                  rows={3}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Explain what was received versus what was ordered..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Submit Problem Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Handover Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={`Delivery Pass: ${order.orderCode}`}
        subtitle={`OTP: ${order.confirmationOtp} • Scan to confirm delivery`}
        targetPath={`#order/${order.id}`}
      />
    </div>
  );
};
