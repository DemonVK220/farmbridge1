import React from 'react';
import { Sprout, PhoneCall, ShieldCheck, Heart, ExternalLink, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();
  const { language, setLanguage } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white">
                <Sprout className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight font-serif">
                  FarmBridge<span className="text-emerald-400">.in</span>
                </span>
                <span className="block text-[11px] text-stone-400">
                  From Farmers to Families, More Directly.
                </span>
              </div>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              A transparent agricultural platform bridging Indian farmers and households.
              Featuring 5-level evidence verification, batch harvest QR traceability, fair mandi price comparisons,
              surplus freshness discounts, and ₹0 platform marketplace fees.
            </p>

            <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700 text-xs space-y-1">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Demonstration Prototype Notice
              </span>
              <p className="text-stone-400 text-[11px]">
                Built as a social-impact prototype for a student innovation challenge. Sample metrics, mandi benchmarks, and simulated checkout are clearly distinguished from live production integrations.
              </p>
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              For Households & Buyers
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('browse')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Browse Fresh Produce
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('farmer_directory')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Verified Farmer Directory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('group_orders')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Neighbourhood Group Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('weekly_basket')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Weekly Produce Baskets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('surplus_deals')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Surplus Freshness Deals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('business_dashboard')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Business & Bulk Procurement
                </button>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              For Farmers & FPOs
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('farmer_dashboard')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Farmer Portal (Simple UI)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('verification_centre')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  5-Level Trust Verification Ladder
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('yield_sanity_check')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Yield Sanity & Anti-Reseller Tool
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('assisted_onboarding')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  CSC Assisted Onboarding (Proposed)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('fpo_dashboard')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  FPO & Farmer Group Aggregation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('pricing')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Plans: ₹0 Free Farmer Listing
                </button>
              </li>
            </ul>
          </div>

          {/* Official Helplines & Assistance */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Helplines</span>
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li>
                <span className="block text-stone-200 font-semibold">Kisan Call Centre (Toll-Free)</span>
                <a
                  href="tel:18001801551"
                  className="text-emerald-400 hover:text-emerald-300 font-bold block"
                >
                  1800-180-1551
                </a>
                <span className="text-[10px] text-stone-500">6 AM – 10 PM (All 7 Days)</span>
              </li>
              <li>
                <span className="block text-stone-200 font-semibold">Crop Insurance (PMFBY)</span>
                <a
                  href="tel:14447"
                  className="text-emerald-400 hover:text-emerald-300 font-bold block"
                >
                  14447
                </a>
              </li>
              <li>
                <span className="block text-stone-200 font-semibold">Consumer Grievance (NCH)</span>
                <a
                  href="tel:1915"
                  className="text-emerald-400 hover:text-emerald-300 font-bold block"
                >
                  1915
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentView('helplines')}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 pt-1 font-medium"
                >
                  <span>View All 6 Verified Helplines</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 FarmBridge India. All rights reserved.</span>
            <span className="text-stone-600">•</span>
            <button
              type="button"
              onClick={() => setCurrentView('legal_privacy')}
              className="hover:text-stone-200 cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-stone-600">•</span>
            <button
              type="button"
              onClick={() => setCurrentView('legal_terms')}
              className="hover:text-stone-200 cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span className="text-stone-600">•</span>
            <button
              type="button"
              onClick={() => setCurrentView('legal_refunds')}
              className="hover:text-stone-200 cursor-pointer"
            >
              Refund & Cancellation Policy
            </button>
            <span className="text-stone-600">•</span>
            <button
              type="button"
              onClick={() => setCurrentView('faq')}
              className="hover:text-stone-200 cursor-pointer"
            >
              FAQ
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-500">Interface Language:</span>
            <div className="flex bg-stone-800 p-0.5 rounded-lg border border-stone-700 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded ${language === 'en' ? 'bg-emerald-700 text-white font-bold' : 'text-stone-400 hover:text-white'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`px-2 py-0.5 rounded ${language === 'ta' ? 'bg-emerald-700 text-white font-bold' : 'text-stone-400 hover:text-white'}`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded ${language === 'hi' ? 'bg-emerald-700 text-white font-bold' : 'text-stone-400 hover:text-white'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
