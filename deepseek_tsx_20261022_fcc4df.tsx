import React from 'react';
import { Sprout, PhoneCall, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();
  const { language, setLanguage } = useLanguage();

  const link = (label: string, view: any) => (
    <li key={view}>
      <button onClick={() => setCurrentView(view)} className="hover:text-emerald-400 transition-colors text-left">{label}</button>
    </li>
  );

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white">
                <Sprout className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight font-serif">FarmBridge<span className="text-emerald-400">.in</span></span>
                <span className="block text-[11px] text-stone-400">From Farmers to Families, More Directly.</span>
              </div>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              A transparent agricultural platform bridging Indian farmers and households. 5-level evidence verification, batch harvest QR traceability, mandi price comparisons, surplus freshness discounts, and ₹0 platform marketplace fees.
            </p>
            <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700 text-xs space-y-1">
              <span className="text-emerald-400 font-semibold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />Demonstration Prototype Notice</span>
              <p className="text-stone-400 text-[11px]">Built as a social-impact prototype for a student innovation challenge. Sample metrics, mandi benchmarks, and simulated checkout are clearly distinguished from live production integrations.</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">For Households</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              {link('Browse Fresh Produce', 'browse')}
              {link('Verified Farmer Directory', 'farmer_directory')}
              {link('Group Orders', 'group_orders')}
              {link('Weekly Produce Baskets', 'weekly_basket')}
              {link('Surplus Freshness Deals', 'surplus_deals')}
              {link('Saved Items', 'saved')}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">For Farmers & FPOs</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              {link('Farmer Dashboard', 'farmer_dashboard')}
              {link('5-Level Verification Ladder', 'verification_centre')}
              {link('Yield Sanity & Anti-Reseller', 'yield_sanity_check')}
              {link('Assisted Onboarding', 'assisted_onboarding')}
              {link('FPO Collective Portal', 'fpo_dashboard')}
              {link('Pricing Plans (₹0 tier)', 'pricing')}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Company & Support</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              {link('How It Works', 'how_it_works')}
              {link('About & Impact', 'impact')}
              {link('Contact Us', 'contact')}
              {link('Accessibility Settings', 'accessibility')}
              {link('FAQ', 'faq')}
              {link('Sign In / Register', 'login')}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /><span>Official Helplines</span>
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li>
                <span className="block text-stone-200 font-semibold">Kisan Call Centre</span>
                <a href="tel:18001801551" className="text-emerald-400 hover:text-emerald-300 font-bold block">1800-180-1551</a>
                <span className="text-[10px] text-stone-500">6 AM – 10 PM (All days)</span>
              </li>
              <li>
                <span className="block text-stone-200 font-semibold">Crop Insurance (PMFBY)</span>
                <a href="tel:14447" className="text-emerald-400 hover:text-emerald-300 font-bold block">14447</a>
              </li>
              <li>
                <span className="block text-stone-200 font-semibold">Consumer Grievance</span>
                <a href="tel:1915" className="text-emerald-400 hover:text-emerald-300 font-bold block">1915</a>
              </li>
              <li>
                <button onClick={() => setCurrentView('helplines')} className="text-xs text-emerald-400 hover:underline flex items-center gap-1 pt-1 font-medium">
                  <span>View All Helplines</span><ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 FarmBridge India. All rights reserved.</span>
            <span className="text-stone-600">•</span>
            <button onClick={() => setCurrentView('legal_privacy')} className="hover:text-stone-200 cursor-pointer">Privacy</button>
            <span className="text-stone-600">•</span>
            <button onClick={() => setCurrentView('legal_terms')} className="hover:text-stone-200 cursor-pointer">Terms</button>
            <span className="text-stone-600">•</span>
            <button onClick={() => setCurrentView('legal_refunds')} className="hover:text-stone-200 cursor-pointer">Refunds</button>
            <span className="text-stone-600">•</span>
            <button onClick={() => setCurrentView('faq')} className="hover:text-stone-200 cursor-pointer">FAQ</button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-500">Language:</span>
            <div className="flex bg-stone-800 p-0.5 rounded-lg border border-stone-700 text-xs">
              {(['en', 'ta', 'hi'] as const).map((lang) => (
                <button key={lang} onClick={() => setLanguage(lang)} className={`px-2 py-0.5 rounded ${language === lang ? 'bg-emerald-700 text-white font-bold' : 'text-stone-400 hover:text-white'}`}>
                  {lang === 'en' ? 'EN' : lang === 'ta' ? 'தமிழ்' : 'हिन्दी'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};