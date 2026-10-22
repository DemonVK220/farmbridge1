import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  Scale,
  PhoneCall,
  FileText,
  TrendingUp,
  RotateCcw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminDashboardPage: React.FC = () => {
  const {
    farmers,
    products,
    helplines,
    orders,
    approveFlaggedListing,
    verifyFarmerBadge,
    addToast,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verification' | 'yield_flags' | 'helplines' | 'strikes'>(
    'yield_flags'
  );

  const flaggedProducts = products.filter((p) => p.isFlaggedForYieldReview);
  const pendingFarmerVerifications = farmers.filter((f) => f.verificationLevel < 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
            Administrative & Verification Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white mt-1">
            Platform Trust, Safety & Yield Audit Desk
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Evidence verification queue, suspicious-volume reviews, farmer strikes, and official registry audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
            Audit Mode Active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-2 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('yield_flags')}
          className={`py-3 px-4 border-b-2 cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'yield_flags'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-700" />
          <span>Yield Sanity Queue ({flaggedProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('verification')}
          className={`py-3 px-4 border-b-2 cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'verification'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Farmer Trust Ladder Queue</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('helplines')}
          className={`py-3 px-4 border-b-2 cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'helplines'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>Helpline Registry ({helplines.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('strikes')}
          className={`py-3 px-4 border-b-2 cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'strikes'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-700" />
          <span>Disputes & Strikes System</span>
        </button>
      </div>

      {/* Tab 1: Yield Flags Queue */}
      {activeTab === 'yield_flags' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-serif">
              Suspicious Volume Listings for Fair Review
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Identified by agricultural extension benchmarks. Listings are held for fair manual review to distinguish legitimate bumper crops or leased acreage from unauthorized trader aggregation.
            </p>
          </div>

          {flaggedProducts.length === 0 ? (
            <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
              No pending listings flagged for volume sanity review.
            </div>
          ) : (
            <div className="space-y-4">
              {flaggedProducts.map((p) => {
                const farmer = farmers.find((f) => f.id === p.farmerId);

                return (
                  <div
                    key={p.id}
                    className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="bg-amber-200 text-amber-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          Volume Plausibility Discrepancy
                        </span>
                        <h3 className="font-bold text-sm text-stone-900 mt-1">{p.title}</h3>
                        <p className="text-xs text-stone-500">
                          Farmer: {farmer?.name} • Reported Land: {farmer?.landAcres} Acres
                        </p>
                      </div>

                      <div className="text-right">
                        <strong className="text-base font-bold text-stone-900">
                          {p.availableQuantity.toLocaleString()} {p.unit}
                        </strong>
                        <span className="text-[11px] text-stone-500 block">Proposed Listing</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-amber-300 text-xs text-stone-700 space-y-1">
                      <strong>Algorithm Finding:</strong>
                      <p>{p.yieldCheckReason}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                      <button
                        type="button"
                        onClick={() => approveFlaggedListing(p.id)}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Approve (Documentation Validated)
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          addToast(
                            'info',
                            'Clarification request dispatched to farmer regarding leased land records.'
                          )
                        }
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Request Leased Patta Clarification
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Farmer Verification Queue */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-serif">
              Farmer Evidence Submissions Awaiting Audit
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Review revenue land extracts, FPO endorsements, organic certificates, and NABL laboratory reports.
            </p>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {pendingFarmerVerifications.map((farmer) => (
              <div
                key={farmer.id}
                className="py-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{farmer.name}</h3>
                  <p className="text-stone-500 text-xs">
                    {farmer.approxVillage}, {farmer.district} • {farmer.landAcres} Acres • Current: Level {farmer.verificationLevel}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      verifyFarmerBadge(farmer.id, (farmer.verificationLevel + 1) as any);
                    }}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl"
                  >
                    Upgrade to Level {farmer.verificationLevel + 1}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Helplines */}
      {activeTab === 'helplines' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 font-serif">
                Helpline Verification Registry
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Maintain authoritative source URLs and verify contact accessibility.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('helplines')}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Open Public Directory →
            </button>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {helplines.map((h) => (
              <div key={h.id} className="py-3 flex items-center justify-between">
                <div>
                  <strong className="text-stone-900 block font-bold">{h.serviceName}</strong>
                  <span className="text-stone-500 font-mono">{h.phoneNumber}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      h.isVerified
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {h.isVerified ? 'Verified Active' : 'Awaiting Official Verification'}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Last audit: {h.lastVerifiedDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Strikes System */}
      {activeTab === 'strikes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-serif">
              Farmer Strikes & Transparency Enforcement Policy
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Enforcement process for fraudulent claims, forged certificates, or deliberately false batch details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
              <strong className="block text-stone-900 font-bold">1. Due Process Notice</strong>
              <p className="text-stone-600">
                Farmers receive written notice and 72-hour window to respond or appeal before any badge suspension.
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
              <strong className="block text-stone-900 font-bold">2. Proportionate Action</strong>
              <p className="text-stone-600">
                Distinguishes between honest errors, expired certificates, and deliberate misrepresentation.
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
              <strong className="block text-stone-900 font-bold">3. Reinstatement Path</strong>
              <p className="text-stone-600">
                Cleared appeals restore badges with audit logging for customer accountability.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
