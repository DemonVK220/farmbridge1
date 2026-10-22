import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Users,
  CalendarCheck,
  PhoneCall,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  ChevronRight,
  Sprout,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { TrustBadge } from '../components/TrustBadge';
import { MandiPriceBadge } from '../components/MandiPriceBadge';
import { FreshnessCountdown } from '../components/FreshnessCountdown';
import { RupeeSymbol } from '../components/Currency';

export const HomePage: React.FC = () => {
  const {
    products,
    farmers,
    groupOrders,
    setCurrentView,
    addToCart,
    navigateToProduct,
    navigateToFarmer,
    navigateToBatch,
    setSelectedCategory,
    setSearchQuery,
  } = useApp();

  const { t } = useLanguage();

  const activeProducts = products.filter((p) => p.status === 'active');
  const featuredFresh = activeProducts.slice(0, 3);
  const surplusProducts = activeProducts.filter((p) => p.expectedShelfLifeDays <= 6);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600"
            alt="Indian agricultural fields"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold tracking-wide">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Digital Direct Agricultural Marketplace • Zero Platform Fee</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif">
              Fresh From Farms.{' '}
              <span className="text-emerald-300 underline decoration-emerald-500/50 underline-offset-8">
                Fairer for Everyone.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
              Discover local Indian farmers, see where your food comes from, compare prices transparently with APMC mandis, and buy fresh harvest batches with 5-level verified evidence.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('browse')}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold rounded-2xl text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-102 flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Fresh Produce</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('farmer_dashboard')}
                className="px-5 py-3.5 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 font-bold rounded-2xl text-sm transition-all hover:scale-102 flex items-center gap-2 cursor-pointer"
              >
                <span>Sell on FarmBridge</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('farmer_directory')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white backdrop-blur-xs font-semibold rounded-2xl text-sm transition-all cursor-pointer"
              >
                Explore Nearby Farmers
              </button>
            </div>

            {/* Micro Trust Proofs */}
            <div className="pt-6 border-t border-emerald-800/80 grid grid-cols-3 gap-4 text-xs text-emerald-200">
              <div>
                <strong className="block text-white text-base font-bold font-serif flex items-center">
                  <RupeeSymbol size={16} className="text-white mr-0.5" />0 Platform Fee
                </strong>
                <span className="text-[11px] text-emerald-300">Standard marketplace access</span>
              </div>
              <div>
                <strong className="block text-white text-base font-bold font-serif">5-Level Ladder</strong>
                <span className="text-[11px] text-emerald-300">Evidence-based verification</span>
              </div>
              <div>
                <strong className="block text-white text-base font-bold font-serif">Batch QR Trace</strong>
                <span className="text-[11px] text-emerald-300">Farm photo & lab reports</span>
              </div>
            </div>
          </div>

          {/* Hero Feature Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-100 text-emerald-900 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Featured Harvest Today
                </span>
                <span className="text-xs text-stone-500 font-medium">Batch #FB-TN-TOM-01</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-16/10">
                <img
                  src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800"
                  alt="Country tomatoes"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white p-2 rounded-xl text-xs flex items-center justify-between">
                  <span>Harvested: 21 Oct 06:30 AM</span>
                  <span className="text-emerald-300 font-bold">Residue Tested (NABL)</span>
                </div>
              </div>

              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-stone-900 text-lg">
                      Certified Organic Country Tomatoes
                    </h3>
                    <p className="text-xs text-stone-500">
                      Farmer: S. Muthuvel • Pennagaram, Dharmapuri (TN)
                    </p>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-900 inline-flex items-center">
                    <RupeeSymbol size={18} />42<span className="text-xs text-stone-500 font-normal">/kg</span>
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <TrustBadge level={5} size="sm" />
                  <TrustBadge level={4} specificBadge="Jaivik Bharat" size="sm" />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigateToBatch('batch-tom-01')}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  View Batch Traceability
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const prod = products.find((p) => p.id === 'prod-tomatoes-01');
                    if (prod) addToCart(prod, 2);
                  }}
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Add 2 kg to Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Fast Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-900 font-serif">Shop by Agricultural Category</h2>
          <button
            type="button"
            onClick={() => setCurrentView('browse')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Produce</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'Vegetables', icon: '🥦', count: '14 Varieties' },
            { name: 'Fruits', icon: '🥭', count: '8 Varieties' },
            { name: 'Grains', icon: '🌾', count: '6 Varieties' },
            { name: 'Millets', icon: '🥣', count: '5 Indigenous' },
            { name: 'Pulses', icon: '🫘', count: '4 Varieties' },
            { name: 'Spices', icon: '🌶️', count: '6 Varieties' },
          ].map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.name);
                setCurrentView('browse');
              }}
              className="p-4 bg-white hover:bg-emerald-50/70 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition-all hover:scale-102 shadow-xs group cursor-pointer"
            >
              <span className="text-2xl mb-1.5 block group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-900">
                {cat.name}
              </h3>
              <span className="text-[11px] text-stone-500">{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5-Level Verification Explanation Hub Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-xl space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Honest Agricultural Traceability
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              The 5-Level Farmer Verification Ladder
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              We never make vague &ldquo;100% natural&rdquo; marketing claims. Every trust badge represents specific,
              independently checked evidence with the inspector, method, and date documented.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            {[
              {
                level: 1 as const,
                title: 'Phone Verified',
                desc: 'Verified SMS OTP ownership. Establishes communication identity.',
              },
              {
                level: 2 as const,
                title: 'Farm Evidence Reviewed',
                desc: 'Land record & live camera geo-tagged photo with generalized village.',
              },
              {
                level: 3 as const,
                title: 'Locally Verified',
                desc: 'Field verification by local Panchayat, FPO, or Agri Extension Officer.',
              },
              {
                level: 4 as const,
                title: 'Certificate Verified',
                desc: 'Jaivik Bharat, PGS, NPOP, or FSSAI license audited against national registries.',
              },
              {
                level: 5 as const,
                title: 'Residue Report Verified',
                desc: 'NABL accredited laboratory report confirming chemical residue limits for this batch.',
              },
            ].map((step) => (
              <div
                key={step.level}
                className="bg-stone-800/80 border border-stone-700 p-4 rounded-2xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Level {step.level}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <h3 className="font-bold text-sm text-white">{step.title}</h3>
                <p className="text-[11px] text-stone-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
            <span className="text-stone-400">
              Evidence is audited publicly on each product batch details page.
            </span>
            <button
              type="button"
              onClick={() => setCurrentView('verification_centre')}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Verification Rules</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Fresh Harvest Produce Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 font-serif">Fresh Harvest Today</h2>
            <p className="text-xs text-stone-500">
              Directly harvested from verified farms with batch photos and APMC mandi price comparisons.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('browse')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            <span>See All Listings ({activeProducts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProducts.map((product) => {
            const farmer = farmers.find((f) => f.id === product.farmerId) || farmers[0];
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Image & Batch Tag */}
                  <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-white/90 backdrop-blur-xs text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        {product.variety}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-lg">
                      Batch #{product.batchId}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Trust Ladder Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <TrustBadge level={farmer.verificationLevel} size="sm" />
                      {farmer.certificates?.[0] && (
                        <TrustBadge
                          level={4}
                          specificBadge={farmer.certificates[0].type}
                          size="sm"
                        />
                      )}
                    </div>

                    {/* Title & Farmer Info */}
                    <div>
                      <h3
                        onClick={() => navigateToProduct(product.id)}
                        className="font-bold text-stone-900 text-base hover:text-emerald-800 cursor-pointer transition-colors leading-snug line-clamp-1"
                      >
                        {product.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => navigateToFarmer(farmer.id)}
                        className="text-xs text-stone-500 hover:text-emerald-700 flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span>
                          {farmer.name} • {farmer.approxVillage}
                        </span>
                      </button>
                    </div>

                    {/* Mandi Price Comparison Widget */}
                    <MandiPriceBadge
                      comparison={product.mandiComparison}
                      farmBridgePrice={product.basePricePerUnit}
                      unit={product.unit}
                    />

                    {/* Freshness Countdown & Floor Price */}
                    <FreshnessCountdown
                      harvestDateStr={product.harvestDate}
                      shelfLifeDays={product.expectedShelfLifeDays}
                      basePrice={product.basePricePerUnit}
                      minFloorPrice={product.minFloorPricePerUnit}
                      unit={product.unit}
                    />
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateToBatch(product.batchId)}
                    className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Batch QR Trace
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                  >
                    Add to Basket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hyperlocal Group Orders & Weekly Baskets Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Group Orders Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="bg-amber-200/80 text-amber-900 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-800" />
              Hyperlocal Group Buying
            </span>
            <span className="text-xs font-medium text-amber-800">Save up to 15%</span>
          </div>

          <h3 className="text-2xl font-bold font-serif text-amber-950">
            Order Together with Neighbours
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Aggregate quantities with families in your apartment or locality. Farmers deliver directly in bulk, saving fuel and splitting delivery costs transparently. Customer privacy is strictly preserved.
          </p>

          <div className="space-y-3 pt-2">
            {groupOrders.slice(0, 2).map((grp) => (
              <div
                key={grp.id}
                className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-stone-900">{grp.groupTitle}</h4>
                  <span className="text-[11px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                    {grp.participantsCount} Neighbours Joined
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Locality: {grp.locality}</span>
                  <span>Progress: {grp.currentQuantityKg} / {grp.targetQuantityKg} kg</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (grp.currentQuantityKg / grp.targetQuantityKg) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCurrentView('group_orders')}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Explore & Join Group Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Weekly Baskets Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-200/80 text-emerald-950 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-emerald-800" />
                Weekly Produce Subscription
              </span>
              <span className="text-xs font-semibold text-emerald-800">Pause / Skip Anytime</span>
            </div>

            <h3 className="text-2xl font-bold font-serif text-emerald-950">
              Seasonal Farm Baskets to Your Doorstep
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Curated seasonal vegetables, fruits, and cold-pressed staples from certified local farmers.
              Customise household size, select delivery day, and preview upcoming harvests. Never billed without clear advance confirmation.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="bg-white p-3 rounded-2xl border border-emerald-200">
                <strong className="block font-bold text-stone-900 text-sm">Small</strong>
                <span className="text-stone-500 text-[11px]">2-3 People</span>
                <span className="flex items-center justify-center font-bold text-emerald-900 mt-1">~<RupeeSymbol size={12} className="mx-0.5" />299/wk</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border-2 border-emerald-600 shadow-xs relative">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[9px] font-bold px-2 py-0.2 rounded-full uppercase">
                  Popular
                </span>
                <strong className="block font-bold text-stone-900 text-sm">Medium</strong>
                <span className="text-stone-500 text-[11px]">4-5 People</span>
                <span className="flex items-center justify-center font-bold text-emerald-900 mt-1">~<RupeeSymbol size={12} className="mx-0.5" />420/wk</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-200">
                <strong className="block font-bold text-stone-900 text-sm">Large</strong>
                <span className="text-stone-500 text-[11px]">Joint Family</span>
                <span className="flex items-center justify-center font-bold text-emerald-900 mt-1">~<RupeeSymbol size={12} className="mx-0.5" />640/wk</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => setCurrentView('weekly_basket')}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Subscribe or Preview Basket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Social Impact Demonstration Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Social Innovation Pilot
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Demonstration Pilot Impact
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
              Transparent reporting: In accordance with FarmBridge verification rules, pilot statistics are clearly labelled as demonstration baseline targets until full state-level deployment.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-700/50">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-serif block">
                124+
              </span>
              <span className="text-xs text-emerald-100 font-medium mt-1 block">
                Farmers Onboarded
              </span>
              <span className="text-[10px] text-emerald-300/70 block mt-0.5">Across 4 Pilot States</span>
            </div>

            <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-700/50">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-serif block">
                1,480+
              </span>
              <span className="text-xs text-emerald-100 font-medium mt-1 block">
                Orders Fulfilled
              </span>
              <span className="text-[10px] text-emerald-300/70 block mt-0.5">Zero Platform Fees</span>
            </div>

            <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-700/50">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-serif block">
                38.5 MT
              </span>
              <span className="text-xs text-emerald-100 font-medium mt-1 block">
                Produce Sold Directly
              </span>
              <span className="text-[10px] text-emerald-300/70 block mt-0.5">Grade Verified</span>
            </div>

            <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-700/50">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-serif block">
                6.2 MT
              </span>
              <span className="text-xs text-emerald-100 font-medium mt-1 block">
                Surplus Harvest Redirected
              </span>
              <span className="text-[10px] text-emerald-300/70 block mt-0.5">Freshness Discounted</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCurrentView('impact')}
              className="text-xs text-emerald-300 hover:text-white underline underline-offset-4 font-semibold"
            >
              Learn about our methodology and anti-waste framework →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
