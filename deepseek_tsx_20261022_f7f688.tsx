import React, { useState } from 'react';
import {
  Sprout, ShieldCheck, Search, ShoppingCart, Truck, CheckCircle2, Scale,
  QrCode, Users, CalendarCheck, Sparkles, ArrowRight, Camera, FlaskConical,
  Award, Phone, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowItWorksPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'buyers' | 'farmers'>('buyers');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const buyerSteps = [
    { icon: Search, title: '1. Discover Verified Farmers', body: 'Filter by crop, village, trust level (1–5) and price. Every listing shows the exact harvest batch, live camera evidence, and APMC mandi comparison.' },
    { icon: ShoppingCart, title: '2. Add to Basket with Transparent Cost', body: 'See produce subtotal, surplus discount, third-party delivery, and ₹0 platform fee BEFORE checkout. No hidden charges appear later.' },
    { icon: Truck, title: '3. Track Live Batch Delivery', body: 'Follow the audit trail: order placed → farmer confirmed → produce prepared → picked up → in transit → delivered with OTP handover.' },
    { icon: QrCode, title: '4. Scan QR for Full Provenance', body: 'Every batch has a public passport: farmer, village, harvest date, NABL lab results, certificate numbers, and photo evidence.' },
    { icon: CheckCircle2, title: '5. Rate Only After Delivery', body: 'Verified ratings only. Quality, freshness, and delivery care are scored post-handover — preventing fake reviews.' },
  ];

  const farmerSteps = [
    { icon: Phone, title: '1. Register with OTP (Level 1)', body: 'Free forever. Phone verification via SMS OTP with anti-abuse rate limits. No Aadhaar, no bank details, no upfront cost.' },
    { icon: Camera, title: '2. Upload Live Farm Evidence (Level 2)', body: 'Direct device camera capture with GPS + timestamp. Gallery uploads disabled for this anti-fraud step. Precise coordinates never shown publicly.' },
    { icon: Users, title: '3. Local Institutional Endorsement (Level 3)', body: 'An authorised Panchayat, FPO director, or Agri Extension Officer confirms physical cultivation.' },
    { icon: Award, title: '4. Certificate Verification (Level 4)', body: 'Jaivik Bharat, PGS, NPOP, or FSSAI licences validated against national registries. Automatically suspended on expiry.' },
    { icon: FlaskConical, title: '5. NABL Residue Testing (Level 5)', body: 'Batch-specific pesticide residue report from an accredited laboratory. Linked to that harvest — never a blanket claim.' },
    { icon: Scale, title: '6. Yield Sanity & Fair Review', body: 'Listings exceeding plausible harvest capacity for your acreage go to human review — never automatic bans.' },
    { icon: Sparkles, title: '7. Surplus Pricing Tools', body: 'Set your floor price. Progressive freshness discounts auto-adjust over time — but never below your minimum.' },
    { icon: CalendarCheck, title: '8. Direct Payouts, ₹0 Commission', body: '100% of produce price settles to your UPI/bank after delivery OTP confirmation.' },
  ];

  const faqs = [
    { q: 'Is FarmBridge really free for farmers?', a: 'Yes. Farmer registration, 5-level verification, listing creation, batch QR codes, and standard order management are all ₹0. Farmer Plus (₹199/mo) is optional and only unlocks analytics — never a shortcut through verification.' },
    { q: 'How do you verify pesticide-free claims?', a: 'We never accept "100% natural" slogans. Level 5 requires an NABL-accredited laboratory report for that specific harvest batch testing 84 organochlorine, organophosphate, and synthetic pyrethroid parameters against FSSAI MRL limits.' },
    { q: 'What if my harvest volume looks suspicious?', a: 'Our Yield Sanity Check compares your listed quantity to agricultural extension benchmarks for your acreage. If it seems high, your listing enters a fair review queue — you get a chance to explain leased land, bumper harvests, or FPO aggregation. No automatic accusation.' },
    { q: 'How does delivery work across multiple farmers?', a: 'When you order from 2+ farms, a third-party logistics partner picks up from each farm origin. Delivery cost = ₹35 base + ₹20 per additional farm pickup — always disclosed upfront.' },
    { q: 'Are mandi prices live?', a: 'In this prototype, mandi benchmarks are clearly labelled demonstration data with source URLs. Production requires API keys from state agricultural marketing portals.' },
    { q: 'What happens if produce arrives damaged?', a: 'File an issue report with a photo within 24 hours of handover. Our dispute desk reviews the delivery log and batch photo before authorizing a refund.' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
          <Sprout className="w-4 h-4 text-emerald-700" /><span>Platform Mechanics</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-serif leading-tight">How FarmBridge Works</h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          A transparent agricultural marketplace built on evidence — not marketing claims. Every badge represents specific, independently-checked evidence.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
          <button onClick={() => setActiveTab('buyers')} className={`px-5 py-2 rounded-xl transition-colors cursor-pointer ${activeTab === 'buyers' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'}`}>For Buyers</button>
          <button onClick={() => setActiveTab('farmers')} className={`px-5 py-2 rounded-xl transition-colors cursor-pointer ${activeTab === 'farmers' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'}`}>For Farmers</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(activeTab === 'buyers' ? buyerSteps : farmerSteps).map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base text-stone-900 font-serif">{step.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">{step.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold font-serif text-white">The 5-Level Trust Ladder at a Glance</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {[
            { lvl: 1, title: 'Phone', desc: 'OTP ownership' },
            { lvl: 2, title: 'Farm Evidence', desc: 'Live camera + land record' },
            { lvl: 3, title: 'Locally Verified', desc: 'Panchayat / FPO / Agri Officer' },
            { lvl: 4, title: 'Certificate', desc: 'Jaivik Bharat, PGS, FSSAI' },
            { lvl: 5, title: 'Residue Tested', desc: 'NABL lab per batch' },
          ].map((s) => (
            <div key={s.lvl} className="bg-stone-800/80 border border-stone-700 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Level {s.lvl}</span>
              <h4 className="font-bold text-sm text-white mt-1">{s.title}</h4>
              <p className="text-[10px] text-stone-400 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="pt-2">
          <button onClick={() => setCurrentView('verification_centre')} className="text-emerald-400 hover:text-emerald-300 font-bold text-xs inline-flex items-center gap-1 cursor-pointer">
            <span>Explore full verification evidence rules</span><ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Sparkles, title: 'Surplus Freshness Deals', body: 'Time-decay discounts auto-apply as shelf life shrinks. Respects farmer floor price strictly.', view: 'surplus_deals' },
          { icon: Users, title: 'Hyperlocal Group Orders', body: 'Neighbours split delivery fees and unlock bulk tiers. Privacy-protected participant list.', view: 'group_orders' },
          { icon: CalendarCheck, title: 'Weekly Produce Baskets', body: 'Seasonal subscription. Pause or skip anytime with no automatic charge before confirmation.', view: 'weekly_basket' },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <Icon className="w-5 h-5 text-emerald-700 mb-2" />
                <h3 className="font-bold text-sm text-stone-900 font-serif">{c.title}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{c.body}</p>
              </div>
              <button onClick={() => setCurrentView(c.view as any)} className="mt-3 text-emerald-800 font-bold text-xs inline-flex items-center gap-1 hover:text-emerald-950 cursor-pointer">
                <span>Explore</span><ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-stone-900 font-serif">Common Questions</h2>
        <div className="space-y-2">
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={f.q} className="border border-stone-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(isOpen ? null : i)} className="w-full text-left p-4 font-bold text-stone-900 flex items-center justify-between hover:bg-stone-50 cursor-pointer text-sm">
                  <span>{f.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isOpen && <div className="p-4 pt-0 text-stone-600 bg-stone-50/50 border-t border-stone-100 text-xs leading-relaxed">{f.a}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-200 text-center space-y-4">
        <h3 className="text-2xl font-bold text-emerald-950 font-serif">Ready to Skip the Middleman?</h3>
        <p className="text-xs text-stone-600 max-w-md mx-auto">Browse verified harvests directly from Indian farmers with transparent mandi comparisons and zero platform fees.</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button onClick={() => setCurrentView('browse')} className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer">Browse Produce</button>
          <button onClick={() => setCurrentView('farmer_dashboard')} className="px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-bold text-xs rounded-xl transition-colors cursor-pointer">Sell as a Farmer</button>
        </div>
      </div>
    </div>
  );
};