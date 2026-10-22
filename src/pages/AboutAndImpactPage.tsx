import React from 'react';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Users,
  Sparkles,
  Heart,
  Scale,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutAndImpactPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Mission */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>Our Social Innovation Challenge</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-serif leading-tight">
          Bridging the Gap Between Indian Farms and Kitchens
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          FarmBridge India was founded to solve a dual paradox in Indian agriculture: farmers struggling with low farm-gate realizations and perishable post-harvest losses, while urban households pay inflated retail markups without knowing the harvest origin, safety, or chemical residues of what they eat.
        </p>
      </div>

      {/* Pillars of Differentiation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-bold text-base text-stone-900 font-serif">
            5-Level Evidence Verification
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            No marketing slogans or vague claims. We verify phone identity, revenue land records, local agricultural extension endorsements, organic certificates, and NABL pesticide residue tests.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-bold text-base text-stone-900 font-serif">
            Mandi Price Benchmark Transparency
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every listing shows the current modal price at the local APMC wholesale yard, explaining exactly why direct farm-graded prices differ based on grading, moisture, packaging, and zero commission.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-bold text-base text-stone-900 font-serif">
            Inclusive Assisted Onboarding
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Recognizing that over 40% of smallholder Indian farmers lack modern smartphones or high digital literacy, our proposed Village Common Service Centre (CSC) network enables physical assisted onboarding.
          </p>
        </div>
      </div>

      {/* Demonstration Pilot Metrics Section */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl space-y-6">
        <div className="max-w-xl space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
            Pilot Target Metrics
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Measured Social Impact
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed">
            Demonstration Data Disclosure: In compliance with our research ethics, these figures represent our student innovation pilot baseline benchmarks across 4 pilot agrarian blocks.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
            <span className="text-3xl font-bold font-serif text-emerald-400 block">124</span>
            <span className="text-xs text-stone-300 font-semibold block mt-1">Verified Farmers</span>
            <span className="text-[10px] text-stone-500 block">Dharmapuri, Nashik, Sonipat, Zira</span>
          </div>

          <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
            <span className="text-3xl font-bold font-serif text-emerald-400 block">1,480+</span>
            <span className="text-xs text-stone-300 font-semibold block mt-1">Completed Deliveries</span>
            <span className="text-[10px] text-stone-500 block">Zero Platform Intermediary Cut</span>
          </div>

          <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
            <span className="text-3xl font-bold font-serif text-emerald-400 block">38.5 MT</span>
            <span className="text-xs text-stone-300 font-semibold block mt-1">Harvest Traced</span>
            <span className="text-[10px] text-stone-500 block">With Batch QR Passports</span>
          </div>

          <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
            <span className="text-3xl font-bold font-serif text-emerald-400 block">6.2 MT</span>
            <span className="text-xs text-stone-300 font-semibold block mt-1">Surplus Harvest Saved</span>
            <span className="text-[10px] text-stone-500 block">Via Freshness Discounts</span>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-200 text-center space-y-4">
        <h3 className="text-2xl font-bold text-emerald-950 font-serif">
          Join the Direct Agricultural Movement
        </h3>
        <p className="text-xs text-stone-600 max-w-md mx-auto">
          Whether you are a farmer wanting fair direct access, or a family seeking trustworthy chemical-tested food, FarmBridge is open for all.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentView('browse')}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Shop Verified Produce
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('farmer_dashboard')}
            className="px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Sell on FarmBridge
          </button>
        </div>
      </div>
    </div>
  );
};
