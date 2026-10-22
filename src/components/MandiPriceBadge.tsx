import React, { useState } from 'react';
import { TrendingUp, HelpCircle, X, ExternalLink } from 'lucide-react';
import { MandiPriceComparison } from '../types';
import { RupeeSymbol } from './Currency';

interface MandiPriceBadgeProps {
  comparison: MandiPriceComparison;
  farmBridgePrice: number;
  unit: string;
}

export const MandiPriceBadge: React.FC<MandiPriceBadgeProps> = ({
  comparison,
  farmBridgePrice,
  unit,
}) => {
  const [showModal, setShowModal] = useState(false);

  const priceDiff = farmBridgePrice - comparison.modalPricePerKg;
  const isHigher = priceDiff > 0;

  return (
    <>
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-stone-800">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Mandi Price Benchmark</span>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-stone-500 hover:text-emerald-800 inline-flex items-center gap-1 font-medium underline underline-offset-2 cursor-pointer"
          >
            <span>Compare</span>
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-baseline justify-between text-stone-600">
          <span className="flex items-center gap-0.5">
            {comparison.mandiName} Modal:{' '}
            <strong className="text-stone-900 font-bold ml-1 inline-flex items-center">
              <RupeeSymbol size={11} />
              {comparison.modalPricePerKg}/{unit}
            </strong>
          </span>
          <span className="text-stone-500 text-[11px] inline-flex items-center">
            Range: <RupeeSymbol size={10} className="ml-1" />{comparison.minPricePerKg} - <RupeeSymbol size={10} className="ml-1" />{comparison.maxPricePerKg}
          </span>
        </div>

        <div className="mt-1 pt-1 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <span>Source: {comparison.sourceDataset}</span>
          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-medium text-[10px]">
            Demo Sample Data
          </span>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-stone-900 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-500 hover:bg-stone-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Local Mandi Price vs FarmBridge Direct
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Market: {comparison.mandiName} ({comparison.marketDistrict}) • Date: {comparison.marketDate}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl">
                <span className="text-xs text-stone-500 block mb-1">APMC Mandi Wholesale Modal</span>
                <span className="text-2xl font-extrabold text-stone-800 inline-flex items-center">
                  <RupeeSymbol size={18} />
                  {comparison.modalPricePerKg}
                  <span className="text-xs font-normal text-stone-500">/{unit}</span>
                </span>
                <span className="text-[11px] text-stone-500 flex items-center mt-1">
                  Range: <RupeeSymbol size={10} className="mx-0.5" />{comparison.minPricePerKg} – <RupeeSymbol size={10} className="mx-0.5" />{comparison.maxPricePerKg}
                </span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                <span className="text-xs text-emerald-800 block mb-1">FarmBridge Direct to Door</span>
                <span className="text-2xl font-extrabold text-emerald-900 inline-flex items-center">
                  <RupeeSymbol size={18} />
                  {farmBridgePrice}
                  <span className="text-xs font-normal text-emerald-700">/{unit}</span>
                </span>
                <span className="text-[11px] text-emerald-700 flex items-center mt-1">
                  Platform Fee: strictly <RupeeSymbol size={10} className="mx-0.5" />0
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-700 mb-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-950">
                <strong className="block mb-1 font-semibold">Why Direct and Mandi Prices Differ:</strong>
                <p className="leading-relaxed">{comparison.differenceRationale}</p>
              </div>

              <div className="p-3 bg-stone-100 rounded-xl">
                <p className="text-stone-600">
                  <strong>Official Market Citation:</strong> Prices are referenced from {comparison.sourceDataset}.
                  As mandated by FarmBridge transparency rules, live external mandi API feeds are supplemented with demonstration pilot data where real-time mandi feeds require official state portal keys.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
