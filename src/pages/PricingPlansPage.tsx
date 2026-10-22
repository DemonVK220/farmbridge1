import React, { useState } from 'react';
import {
  Check,
  ShieldCheck,
  Sparkles,
  Sprout,
  Building2,
  Lock,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RupeeSymbol } from '../components/Currency';

export const PricingPlansPage: React.FC = () => {
  const { addToast } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleSubscribePlan = (planName: string) => {
    addToast('success', `${planName} simulated upgrade active in demo mode.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>Fair Marketplace Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
          Transparent, Fair Plans for Every User
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Standard marketplace listing, farmer verification, and batch traceability are <strong>100% free (₹0)</strong>. We never sell trust badges or compromise safety behind paywalls.
        </p>

        {/* Billing cycle toggle */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-emerald-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              billingCycle === 'annual'
                ? 'bg-emerald-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] bg-emerald-200 text-emerald-950 px-1.5 py-0.2 rounded font-extrabold">
              20% Off
            </span>
          </button>
        </div>
      </div>

      {/* Strict Ethical Policy Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-xs text-amber-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-bold">Inviolable Ethical Commitment:</strong>
          <p className="leading-relaxed">
            Core farmer listing and access to the marketplace remain ₹0. FarmBridge never sells verification badges, never permits paid users to bypass safety evidence, and never charges customers to view batch traceability passports.
          </p>
        </div>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Free Plan */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="bg-stone-100 text-stone-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Core Marketplace
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-serif mt-2">
                Free Farmer Plan
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Everything required to sell directly to households and retail stores.
              </p>
            </div>

            <div className="text-3xl font-extrabold text-stone-900 font-serif flex items-center">
              <RupeeSymbol size={24} className="mr-0.5" />0
              <span className="text-xs font-normal text-stone-500 ml-1"> / forever</span>
            </div>

            <ul className="space-y-2 text-xs text-stone-700">
              {[
                'Public farmer profile & village badge',
                'Unlimited standard crop listings',
                '5-Level evidence verification application',
                'Harvest batch photos & public QR passports',
                'Mandi price comparison benchmarks',
                'Verified customer ratings & reviews',
                'Direct bank/UPI payouts with ₹0 commission',
                'SMS order alerts & assisted onboarding',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            className="w-full py-3 bg-stone-100 text-stone-800 rounded-xl font-bold text-xs cursor-default"
          >
            Included by Default (Free)
          </button>
        </div>

        {/* Farmer Plus */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-700 shadow-md flex flex-col justify-between space-y-6 relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-800 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Analytics & Surplus Tools
          </span>

          <div className="space-y-4">
            <div>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Advanced Farming Insights
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-serif mt-2">
                Farmer Plus
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Demand forecasting, surplus optimization, and commercial crop reports.
              </p>
            </div>

            <div className="text-3xl font-extrabold text-emerald-950 font-serif flex items-center">
              <RupeeSymbol size={24} className="mr-0.5" />{billingCycle === 'annual' ? 159 : 199}
              <span className="text-xs font-normal text-stone-500 ml-1"> / month</span>
            </div>

            <ul className="space-y-2 text-xs text-stone-700">
              {[
                'Everything in Free Plan',
                'Hyperlocal harvest demand trends & alerts',
                'Automated surplus freshness discount tools',
                'Multi-crop soil yield & price forecasting',
                'Priority dispatch routing with logistics partners',
                'Downloadable tax and revenue audit reports',
                'WhatsApp dedicated support line',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSubscribePlan('Farmer Plus')}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Upgrade to Farmer Plus
          </button>
        </div>

        {/* Business Buyer Plus */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="bg-stone-100 text-stone-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Wholesale Buyers
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-serif mt-2">
                Business Buyer Plus
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Bulk procurement suite for restaurants, hostels, and retailers.
              </p>
            </div>

            <div className="text-3xl font-extrabold text-stone-900 font-serif flex items-center">
              <RupeeSymbol size={24} className="mr-0.5" />{billingCycle === 'annual' ? 399 : 499}
              <span className="text-xs font-normal text-stone-500 ml-1"> / month</span>
            </div>

            <ul className="space-y-2 text-xs text-stone-700">
              {[
                'Bulk RFQ broadcast to 100+ verified farms',
                'Multi-supplier price quote comparisons',
                'Custom recurring delivery schedules',
                'Consolidated multi-farm GST invoice downloads',
                'Quality grade specifications & lab audit exports',
                'Dedicated commercial account manager',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSubscribePlan('Business Buyer Plus')}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Activate Business Buyer Plus
          </button>
        </div>
      </div>
    </div>
  );
};
