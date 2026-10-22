import React, { useState } from 'react';
import {
  Building2,
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RupeeSymbol } from '../components/Currency';

export const BusinessBuyerDashboardPage: React.FC = () => {
  const { rfqs, addToast, setCurrentView } = useApp();
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [crop, setCrop] = useState('Nashik Red Onions (Medium Grade)');
  const [qty, setQty] = useState(1000);
  const [targetPrice, setTargetPrice] = useState(26);
  const [deliveryDate, setDeliveryDate] = useState('2026-10-28');
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Standard Commercial'>('Grade A');

  const handleCreateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', `RFQ for ${qty} kg ${crop} published to regional farmer network!`);
    setShowRfqModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
            Institutional & Wholesale Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white mt-1">
            B2B Commercial Procurement Desk
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Bulk direct farm sourcing for restaurants, hostels, retail chains, and food processing units.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRfqModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Request for Quotation (RFQ)</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-stone-200">
          <span className="text-stone-500 font-medium block">Active RFQs</span>
          <strong className="text-2xl font-bold font-serif text-stone-900 block mt-1">
            {rfqs.length} Requests
          </strong>
          <span className="text-stone-400 block mt-0.5">5 Farmer Quotations Received</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200">
          <span className="text-stone-500 font-medium block">Monthly Procurement</span>
          <strong className="text-2xl font-bold font-serif text-stone-900 block mt-1">
            18.4 Metric Tonnes
          </strong>
          <span className="text-emerald-700 font-semibold block mt-0.5">
            Direct Farm Sourced
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200">
          <span className="text-stone-500 font-medium block">Average Cost Saving</span>
          <strong className="text-2xl font-bold font-serif text-emerald-950 block mt-1">
            14.2%
          </strong>
          <span className="text-stone-400 block mt-0.5">Vs Mandi Middlemen Markup</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200">
          <span className="text-stone-500 font-medium block">GST Invoices</span>
          <strong className="text-2xl font-bold font-serif text-stone-900 block mt-1">
            100% Tax Compliant
          </strong>
          <span className="text-stone-400 block mt-0.5">Instant Digital Receipts</span>
        </div>
      </div>

      {/* Active RFQs List */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 font-serif">
          Active Wholesale Requests for Quotation (RFQs)
        </h2>

        <div className="divide-y divide-stone-100 text-xs">
          {rfqs.map((rfq) => (
            <div
              key={rfq.id}
              className="py-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-stone-900">{rfq.cropRequired}</h3>
                  <span className="bg-stone-100 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {rfq.qualityGrade}
                  </span>
                </div>
                <p className="text-stone-500 text-xs mt-1 flex items-center flex-wrap">
                  <span>Quantity: <strong>{rfq.quantityRequiredKg.toLocaleString()} kg</strong></span>
                  <span className="mx-1.5">•</span>
                  <span className="inline-flex items-center">Target: <RupeeSymbol size={11} className="mx-0.5" />{rfq.targetPricePerKg}/kg</span>
                  <span className="mx-1.5">•</span>
                  <span>Required by: {rfq.deliveryDate}</span>
                </p>
                <span className="text-[11px] text-emerald-800 font-medium mt-0.5 block">
                  Buyer: {rfq.buyerName} ({rfq.organization})
                </span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-stone-500 font-medium">
                  {rfq.quotesCount} Farmer Offers
                </span>
                <button
                  type="button"
                  onClick={() => addToast('info', 'Opening comparative quote sheets...')}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Compare Quotes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RFQ Creation Modal */}
      {showRfqModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowRfqModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold font-serif text-stone-900">
              Create Bulk Procurement Request (RFQ)
            </h3>
            <p className="text-xs text-stone-500">
              Broadcast your commercial requirements directly to verified farmers and FPOs in the producing districts.
            </p>

            <form onSubmit={handleCreateRfq} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Produce Required & Specs:</label>
                <input
                  type="text"
                  required
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Quantity (kg):</label>
                  <input
                    type="number"
                    required
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1 flex items-center">Target Price (<RupeeSymbol size={10} className="mx-0.5" />/kg):</label>
                  <input
                    type="number"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Quality Grade:</label>
                  <select
                    value={grade}
                    onChange={(e: any) => setGrade(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Grade A">Grade A (Premium)</option>
                    <option value="Grade B">Grade B (Standard Commercial)</option>
                    <option value="Standard Commercial">Processing Grade</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Delivery Deadline:</label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRfqModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-800 text-white rounded-xl font-bold"
                >
                  Publish Bulk RFQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
