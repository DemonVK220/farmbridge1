import React from 'react';
import {
  Sparkles,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  MapPin,
  QrCode,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateSurplusDiscount } from '../utils/rules';
import { TrustBadge } from '../components/TrustBadge';
import { MandiPriceBadge } from '../components/MandiPriceBadge';
import { RupeeSymbol } from '../components/Currency';

export const SurplusDealsPage: React.FC = () => {
  const { products, farmers, addToCart, navigateToProduct, navigateToBatch, setCurrentView } =
    useApp();

  const surplusListings = products.filter((p) => p.status === 'active' && p.expectedShelfLifeDays <= 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Surplus Freshness Deals</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-700" />
              <span>Anti-Food Waste Initiative</span>
            </div>
            <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
              Surplus Harvest Freshness Deals
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Time-decay discounts that help farmers sell peak harvests before shelf-life elapses.
              Every deal strictly respects the farmer&apos;s configured minimum floor price.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Policy Disclaimer Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-bold">Food Safety & Shelf-Life Transparency Policy:</strong>
          <p className="leading-relaxed">
            Freshness countdowns represent estimated peak quality windows based on Indian agricultural extension post-harvest guidelines.
            They are not an absolute guarantee of shelf life, which depends on local transit temperature, ventilation, and handling.
            Prices automatically adjust over time to move stock quickly, but never drop below the farmer&apos;s protected floor price.
          </p>
        </div>
      </div>

      {/* Surplus Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surplusListings.map((product) => {
          const farmer = farmers.find((f) => f.id === product.farmerId) || farmers[0];
          const surplus = calculateSurplusDiscount(
            product.harvestDate,
            product.expectedShelfLifeDays,
            product.basePricePerUnit,
            product.minFloorPricePerUnit
          );

          const totalShelfHours = product.expectedShelfLifeDays * 24;
          const hoursLeft = Math.max(0, totalShelfHours - surplus.hoursElapsed);
          const daysLeft = Math.floor(hoursLeft / 24);
          const remHours = hoursLeft % 24;

          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden border border-orange-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-orange-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{surplus.discountPercent}% Freshness Discount</span>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-lg">
                    Batch #{product.batchId}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Trust Badge */}
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

                  <div>
                    <h3
                      onClick={() => navigateToProduct(product.id)}
                      className="font-bold text-base text-stone-900 hover:text-emerald-800 cursor-pointer"
                    >
                      {product.title}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{farmer.name} • {farmer.approxVillage}</span>
                    </p>
                  </div>

                  {/* Pricing Comparison Box */}
                  <div className="bg-orange-50/60 p-3.5 rounded-2xl border border-orange-200/70 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-stone-500 block">Surplus Offer Price</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-emerald-950 font-serif inline-flex items-center">
                            <RupeeSymbol size={20} />
                            {surplus.finalPricePerUnit}
                          </span>
                          <span className="text-xs text-stone-500">/{product.unit}</span>
                          <span className="line-through text-stone-400 text-xs inline-flex items-center">
                            <RupeeSymbol size={11} />
                            {product.basePricePerUnit}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-stone-500 block">Remaining Stock:</span>
                        <strong className="text-xs text-stone-900 font-bold">
                          {product.availableQuantity} {product.unit}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-orange-200/50 flex items-center justify-between text-[11px] text-orange-950 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-700" />
                        Selling Window: {daysLeft}d {remHours}h left
                      </span>
                      <span className="inline-flex items-center">Floor Min: <RupeeSymbol size={10} className="mx-0.5" />{product.minFloorPricePerUnit}/{product.unit}</span>
                    </div>
                  </div>

                  {/* Mandi Comparison */}
                  <MandiPriceBadge
                    comparison={product.mandiComparison}
                    farmBridgePrice={surplus.finalPricePerUnit}
                    unit={product.unit}
                  />
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-stone-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateToBatch(product.batchId)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                >
                  Batch Trace
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(product, 2)}
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                >
                  Claim 2 {product.unit}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
