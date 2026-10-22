import React from 'react';
import { Clock, ArrowRight, X, Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RupeeSymbol } from './Currency';

export const RecentlyViewedSection: React.FC = () => {
  const { recentlyViewedIds, products, navigateToProduct, clearRecentlyViewed, setCurrentView } = useApp();
  const recent = recentlyViewedIds.map((id) => products.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (recent.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-700" /><span>Recently Viewed Produce</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">Your last {recent.length} viewed harvest listings</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={clearRecentlyViewed} className="text-xs font-semibold text-stone-500 hover:text-red-700 flex items-center gap-1 cursor-pointer">
            <X className="w-3 h-3" /><span>Clear</span>
          </button>
          <button onClick={() => setCurrentView('browse')} className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer">
            <span>Browse All</span><ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {recent.map((p) => (
          <button key={p.id} onClick={() => navigateToProduct(p.id)}
            className="snap-start shrink-0 w-56 bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer text-left flex flex-col overflow-hidden">
            <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                #{p.batchId.replace('batch-', '')}
              </div>
            </div>
            <div className="p-3 space-y-1">
              <h3 className="font-bold text-xs text-stone-900 line-clamp-1 leading-tight">{p.title}</h3>
              <p className="text-[10px] text-stone-500 flex items-center gap-1">
                <Sprout className="w-2.5 h-2.5 text-emerald-700" /><span className="truncate">{p.variety}</span>
              </p>
              <div className="flex items-baseline justify-between pt-0.5">
                <span className="text-sm font-extrabold text-emerald-950 inline-flex items-center">
                  <RupeeSymbol size={12} />{p.basePricePerUnit}<span className="text-[9px] text-stone-500 font-normal">/{p.unit}</span>
                </span>
                <span className="text-[9px] text-stone-400">Stock {p.availableQuantity}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};