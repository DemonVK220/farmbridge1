import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { evaluateYieldSanity, CROP_YIELD_BENCHMARKS } from '../utils/rules';

export const YieldSanityCheckPage: React.FC = () => {
  const { addToast } = useApp();

  const [cropKey, setCropKey] = useState('tomatoes');
  const [acreage, setAcreage] = useState(0.5);
  const [quantityKg, setQuantityKg] = useState(45000);
  const [isFpoAggregated, setIsFpoAggregated] = useState(false);
  const [appealExplanation, setAppealExplanation] = useState('');
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  const result = evaluateYieldSanity(cropKey, acreage, quantityKg, isFpoAggregated);
  const benchmark = CROP_YIELD_BENCHMARKS[cropKey] || CROP_YIELD_BENCHMARKS['tomatoes'];

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealExplanation.trim()) return;
    setAppealSubmitted(true);
    addToast(
      'success',
      'Appeal and harvest explanation logged in administrative review queue for fair verification.'
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Yield Sanity Check</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
          Yield Sanity Check & Anti-Reseller Protection
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">
          To protect buyers from traders masquerading as farmers and avoid misleading claims, FarmBridge checks listing volumes against regional agricultural production benchmarks.
        </p>
      </div>

      {/* Core Principle Notice */}
      <div className="bg-stone-900 text-white p-6 rounded-3xl border border-stone-800 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>Fair Review Guarantee • No Automatic Accusations</span>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed">
          A volume discrepancy triggers an <strong>administrative review</strong>, never an instant accusation or ban. Farmers have full opportunity to explain bumper harvests, multi-tier cropping, leased land, or aggregated FPO supply.
        </p>
      </div>

      {/* Interactive Simulator Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Parameters */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-stone-900 font-serif">
            Test Listing Volume Plausibility
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Select Crop:</label>
              <select
                value={cropKey}
                onChange={(e) => setCropKey(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {Object.keys(CROP_YIELD_BENCHMARKS).map((key) => (
                  <option key={key} value={key}>
                    {CROP_YIELD_BENCHMARKS[key].cropName} ({CROP_YIELD_BENCHMARKS[key].category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-700">Cultivated Farm Land Area:</label>
                <span className="font-extrabold text-emerald-900">{acreage} Acre(s)</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={20}
                step={0.1}
                value={acreage}
                onChange={(e) => setAcreage(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Proposed Listing Quantity (kg):
              </label>
              <input
                type="number"
                min={10}
                max={200000}
                step={50}
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Benchmark expected yield for {acreage} acre(s) of {benchmark.cropName}: ~
                {Math.round(benchmark.minYieldPerAcreKg * acreage)} –{' '}
                {Math.round(benchmark.maxYieldPerAcreKg * acreage * 1.35)} kg
              </span>
            </div>

            <label className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isFpoAggregated}
                onChange={(e) => setIsFpoAggregated(e.target.checked)}
                className="accent-emerald-800"
              />
              <div>
                <span className="font-bold text-stone-900 block">
                  FPO / Farmer Group Aggregated Supply
                </span>
                <span className="text-[10px] text-stone-500">
                  Produced by multiple verified member farmers collectively
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right: Real-time Evaluation Result */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className={`p-6 rounded-3xl border shadow-sm space-y-4 transition-colors ${
              result.isFlaggedForReview
                ? 'bg-amber-50/70 border-amber-300'
                : 'bg-emerald-50/70 border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                System Evaluation
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  result.isFlaggedForReview
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-emerald-200 text-emerald-950'
                }`}
              >
                {result.isFlaggedForReview ? 'Under Fair Review' : 'Plausible & Approved'}
              </span>
            </div>

            <div className="flex items-start gap-3">
              {result.isFlaggedForReview ? (
                <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-stone-900">
                  {result.isFlaggedForReview
                    ? 'Listing Exceeds Standard Benchmark Window'
                    : 'Listing Matches Reported Capacity'}
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">{result.reason}</p>
              </div>
            </div>

            <div className="bg-white/80 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Expected Physical Capacity:</span>
                <span className="font-semibold text-stone-900">
                  Up to {result.expectedMaxKg.toLocaleString()} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Proposed Quantity:</span>
                <span className="font-semibold text-stone-900">
                  {quantityKg.toLocaleString()} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Recommended Action:</span>
                <span className="font-bold text-emerald-900">{result.recommendedAction}</span>
              </div>
            </div>

            {/* Appeal Workflow if Flagged */}
            {result.isFlaggedForReview && (
              <div className="pt-3 border-t border-amber-200 space-y-3">
                <h4 className="text-xs font-bold text-stone-900">
                  Farmer Explanation & Appeal Submission
                </h4>

                {!appealSubmitted ? (
                  <form onSubmit={handleAppealSubmit} className="space-y-2">
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. This harvest includes leased adjoining 3 acres under Patta #882, or second picking from high-density trellis cultivation..."
                      value={appealExplanation}
                      onChange={(e) => setAppealExplanation(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Submit Bumper Harvest Explanation
                    </button>
                  </form>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>
                      Explanation recorded in Audit Log. Administrator notified for expedited review.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
