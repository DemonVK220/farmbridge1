import React from 'react';
import { Clock, Sparkles, ShieldAlert } from 'lucide-react';
import { calculateSurplusDiscount } from '../utils/rules';
import { RupeeSymbol } from './Currency';

interface FreshnessCountdownProps {
  harvestDateStr: string;
  shelfLifeDays: number;
  basePrice: number;
  minFloorPrice: number;
  unit: string;
}

export const FreshnessCountdown: React.FC<FreshnessCountdownProps> = ({
  harvestDateStr,
  shelfLifeDays,
  basePrice,
  minFloorPrice,
  unit,
}) => {
  const surplus = calculateSurplusDiscount(
    harvestDateStr,
    shelfLifeDays,
    basePrice,
    minFloorPrice
  );

  const totalShelfHours = shelfLifeDays * 24;
  const hoursLeft = Math.max(0, totalShelfHours - surplus.hoursElapsed);
  const daysLeft = Math.floor(hoursLeft / 24);
  const remainingHours = hoursLeft % 24;

  const progressPercent = Math.min(100, Math.round((surplus.hoursElapsed / totalShelfHours) * 100));

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-stone-800 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Freshness & Harvest Window
        </span>
        {surplus.discountPercent > 0 ? (
          <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-600" />
            {surplus.discountPercent}% Surplus Discount
          </span>
        ) : (
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium text-[11px]">
            Peak Freshness
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between text-stone-600">
        <span>
          Harvested: <strong>{surplus.daysElapsed} day(s) ago</strong> ({surplus.hoursElapsed}h)
        </span>
        <span className="font-medium text-stone-900">
          Optimal Window: {daysLeft}d {remainingHours}h remaining
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            progressPercent > 70
              ? 'bg-orange-500'
              : progressPercent > 40
              ? 'bg-amber-500'
              : 'bg-emerald-600'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200">
        <span className="text-stone-500 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-emerald-700" />
          <span>Floor: Min </span>
          <span className="inline-flex items-center font-bold text-stone-700">
            <RupeeSymbol size={10} />
            {minFloorPrice}/{unit}
          </span>
        </span>
        <span className="text-stone-600 font-medium">
          {surplus.discountPercent > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="line-through text-stone-400 inline-flex items-center">
                <RupeeSymbol size={10} />
                {basePrice}
              </span>
              <span className="text-emerald-900 font-bold text-xs inline-flex items-center">
                <RupeeSymbol size={11} />
                {surplus.finalPricePerUnit}/{unit}
              </span>
            </span>
          ) : (
            <span className="text-stone-900 font-semibold inline-flex items-center">
              <RupeeSymbol size={11} />
              {basePrice}/{unit}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
