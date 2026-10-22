import React, { useState } from 'react';
import {
  CalendarCheck,
  Check,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RupeeSymbol } from '../components/Currency';

export const WeeklyBasketPage: React.FC = () => {
  const { subscriptions, addToast, setCurrentView } = useApp();

  const [basketSize, setBasketSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [frequency, setFrequency] = useState<'Weekly' | 'Bi-weekly'>('Weekly');
  const [preferredDay, setPreferredDay] = useState<'Wednesday' | 'Saturday' | 'Sunday'>('Saturday');
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>([
    'Chemical-free organic only',
    'Extra leafy greens (Palak/Methi)',
  ]);
  const [activeSub, setActiveSub] = useState(subscriptions[0]);

  const togglePref = (pref: string) => {
    if (dietaryPrefs.includes(pref)) {
      setDietaryPrefs(dietaryPrefs.filter((p) => p !== pref));
    } else {
      setDietaryPrefs([...dietaryPrefs, pref]);
    }
  };

  const handlePauseToggle = () => {
    const newStatus = activeSub.status === 'active' ? 'paused' : 'active';
    setActiveSub({ ...activeSub, status: newStatus });
    addToast(
      newStatus === 'paused' ? 'warning' : 'success',
      `Your weekly produce basket subscription has been ${newStatus}.`
    );
  };

  const handleSkipNext = () => {
    setActiveSub({ ...activeSub, status: 'skipped' });
    addToast('info', 'Next delivery has been skipped. You will not be charged.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Weekly Produce Baskets</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
          Weekly Farm Produce Subscription
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Seasonal, freshly harvested vegetable and fruit baskets delivered regularly. Pause, skip, or cancel at any time with zero lock-in contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Size selection & preferences */}
        <div className="lg:col-span-7 space-y-6">
          {/* Basket Sizes */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 font-serif">
              1. Choose Basket Size
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'Small',
                  title: 'Small Family',
                  people: '2–3 Persons',
                  weight: '6–8 kg',
                  items: '8–10 Varieties',
                  price: 299,
                },
                {
                  id: 'Medium',
                  title: 'Standard Household',
                  people: '4–5 Persons',
                  weight: '11–13 kg',
                  items: '12–14 Varieties',
                  price: 420,
                  popular: true,
                },
                {
                  id: 'Large',
                  title: 'Joint Family',
                  people: '6+ Persons',
                  weight: '18–20 kg',
                  items: '15+ Varieties',
                  price: 640,
                },
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setBasketSize(tier.id as any)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all relative ${
                    basketSize === tier.id
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-600/20'
                      : 'border-stone-200 bg-stone-50 hover:bg-white'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2.5 right-3 bg-emerald-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Most Selected
                    </span>
                  )}
                  <strong className="block text-sm font-bold text-stone-900">{tier.title}</strong>
                  <span className="text-xs text-stone-500 block mb-2">{tier.people}</span>
                  <div className="space-y-0.5 text-[11px] text-stone-600 border-t border-stone-200 pt-2">
                    <div>~{tier.weight} produce</div>
                    <div>{tier.items}</div>
                  </div>
                  <div className="mt-3 text-lg font-extrabold text-emerald-950 font-serif flex items-center">
                    <RupeeSymbol size={16} className="mr-0.5" />{tier.price}
                    <span className="text-xs text-stone-500 font-normal ml-1"> / basket</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule & Day */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 font-serif">
              2. Delivery Frequency & Day
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Frequency:</label>
                <div className="flex gap-2">
                  {['Weekly', 'Bi-weekly'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f as any)}
                      className={`flex-1 py-2 rounded-xl border font-bold cursor-pointer transition-colors ${
                        frequency === f
                          ? 'border-emerald-700 bg-emerald-800 text-white'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Preferred Day:</label>
                <div className="flex gap-2">
                  {['Wednesday', 'Saturday', 'Sunday'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setPreferredDay(d as any)}
                      className={`flex-1 py-2 rounded-xl border font-bold cursor-pointer transition-colors ${
                        preferredDay === d
                          ? 'border-emerald-700 bg-emerald-800 text-white'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Custom Preferences */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 font-serif">
              3. Dietary Customizations & Exclusions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Chemical-free organic only',
                'Extra leafy greens (Palak/Methi)',
                'No bitter gourd / karela',
                'Include native millets / ragi',
                'Seasonal exotic fruits add-on',
                'Jain friendly (no root vegetables)',
              ].map((pref) => {
                const checked = dietaryPrefs.includes(pref);
                return (
                  <label
                    key={pref}
                    onClick={() => togglePref(pref)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-colors ${
                      checked ? 'border-emerald-600 bg-emerald-50/60 font-semibold text-emerald-950' : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        checked ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-stone-300 bg-white'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{pref}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active Subscription & Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Subscription Control
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                  activeSub.status === 'active'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                Status: {activeSub.status}
              </span>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Subscribed Household:</span>
                <strong className="text-stone-900">{activeSub.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Plan:</span>
                <span className="font-semibold">{basketSize} ({frequency})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Next Scheduled Delivery:</span>
                <span className="font-semibold text-emerald-900">
                  {preferredDay}, {activeSub.nextDeliveryDate}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Estimated Cost:</span>
                <strong className="text-sm font-bold text-stone-900 font-serif flex items-center">
                  <RupeeSymbol size={13} className="mr-0.5" />{basketSize === 'Small' ? 299 : basketSize === 'Medium' ? 420 : 640}
                </strong>
              </div>
            </div>

            {/* Upcoming Basket Preview */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Preview Next Basket Harvest
              </h3>
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1">
                <div>• Country Tomatoes (S. Muthuvel, Pennagaram) - 2 kg</div>
                <div>• Nashik Red Onions (Rajesh Patil) - 2 kg</div>
                <div>• Fresh Cut Spinach / Palak (Savitri Devi) - 1 kg</div>
                <div>• Finger Millet Ragi (Organic) - 1 kg</div>
                <div>• Native Green Chillies & Ginger - 500g</div>
                <span className="text-[10px] text-stone-400 block pt-1">
                  Adjustments sent via SMS 24 hours before dispatch for your approval.
                </span>
              </div>
            </div>

            {/* Subscription Controls: Pause, Skip, Cancel */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePauseToggle}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {activeSub.status === 'active' ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Subscription</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Resume Subscription</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSkipNext}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Skip Next Week</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToast('success', 'Subscription preferences saved!');
                }}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Save Basket Settings
              </button>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Transparent Recurring Billing Terms
            </span>
            <p className="text-[11px] text-emerald-900/90 leading-relaxed">
              No automatic sneaky deductions. You receive a payment authorization prompt 24 hours prior to dispatch. If you are travelling, pause anytime with zero cancellation fee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
