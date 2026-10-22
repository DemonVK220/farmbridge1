import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  ShieldCheck,
  QrCode,
  Truck,
  Sparkles,
  Info,
  Clock,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrustBadge } from '../components/TrustBadge';
import { MandiPriceBadge } from '../components/MandiPriceBadge';
import { FreshnessCountdown } from '../components/FreshnessCountdown';
import { QRCodeModal } from '../components/QRCodeModal';
import { calculateSurplusDiscount } from '../utils/rules';
import { RupeeSymbol } from '../components/Currency';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    farmers,
    batches,
    selectedProductId,
    setCurrentView,
    addToCart,
    navigateToFarmer,
    navigateToBatch,
  } = useApp();

  const [quantity, setQuantity] = useState(2);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const farmer = farmers.find((f) => f.id === product.farmerId) || farmers[0];
  const batch = batches.find((b) => b.id === product.batchId);

  const surplus = calculateSurplusDiscount(
    product.harvestDate,
    product.expectedShelfLifeDays,
    product.basePricePerUnit,
    product.minFloorPricePerUnit
  );

  const totalPrice = surplus.finalPricePerUnit * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => setCurrentView('browse')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Browse Produce</span>
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Images & Verification Evidence */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm relative">
            <div className="aspect-16/10 bg-stone-100 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                {product.category} • {product.variety}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="absolute top-4 right-4 p-2.5 bg-white/95 hover:bg-white text-stone-800 rounded-2xl shadow-sm transition-transform hover:scale-105 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-800" />
              <span>Scan QR Trace</span>
            </button>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>
                  Harvest Date:{' '}
                  <strong>{new Date(product.harvestDate).toLocaleDateString()}</strong> (
                  {surplus.daysElapsed} days ago)
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Live Camera Batch Verified</span>
              </div>
            </div>
          </div>

          {/* Description & Storage Recommendations */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-sm text-stone-700">
            <h3 className="text-base font-bold text-stone-900 font-serif">
              About this Harvest & Cultivation
            </h3>
            <p className="leading-relaxed">{product.description}</p>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 space-y-1">
              <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-800" />
                Storage & Freshness Tips from the Farmer
              </h4>
              <p className="text-xs text-emerald-900/90 leading-relaxed">
                {product.storageTips}
              </p>
            </div>
          </div>

          {/* Farmer Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={farmer.avatarUrl}
                  alt={farmer.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 shadow-xs"
                />
                <div>
                  <h3 className="font-bold text-base text-stone-900">{farmer.name}</h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {farmer.approxVillage}, {farmer.district}
                    </span>
                  </p>
                  <span className="text-[11px] text-emerald-800 font-medium">
                    {farmer.farmingType} Farming • {farmer.landAcres} Acres
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigateToFarmer(farmer.id)}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                View Farm Profile
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">{farmer.bio}</p>

            <div className="pt-2 flex flex-wrap gap-1.5">
              <TrustBadge level={farmer.verificationLevel} size="md" />
              {farmer.certificates?.map((c) => (
                <TrustBadge key={c.id} level={4} specificBadge={c.type} size="md" />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Purchase & Pricing Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-md space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800">
                  Direct Harvest Batch
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  Batch: {product.batchId}
                </span>
              </div>
              <h2 className="text-2xl font-bold font-serif text-stone-900">
                {product.title}
              </h2>
            </div>

            {/* Price Box */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-500 block mb-0.5">Farm Price per {product.unit}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-950 font-serif inline-flex items-center">
                      <RupeeSymbol size={22} />
                      {surplus.finalPricePerUnit}
                    </span>
                    <span className="text-xs text-stone-500 font-normal">/{product.unit}</span>
                    {surplus.discountPercent > 0 && (
                      <span className="line-through text-stone-400 text-sm inline-flex items-center">
                        <RupeeSymbol size={11} />
                        {product.basePricePerUnit}
                      </span>
                    )}
                  </div>
                </div>

                {surplus.discountPercent > 0 && (
                  <span className="bg-orange-100 text-orange-900 font-extrabold text-xs px-2.5 py-1 rounded-full">
                    {surplus.discountPercent}% Surplus Discount
                  </span>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                <span>Available Harvest: <strong>{product.availableQuantity} {product.unit}</strong></span>
                <span className="text-emerald-800 font-bold inline-flex items-center">
                  Platform Fee: <RupeeSymbol size={10} className="ml-1" />0
                </span>
              </div>
            </div>

            {/* Mandi Price Benchmark Comparison */}
            <MandiPriceBadge
              comparison={product.mandiComparison}
              farmBridgePrice={surplus.finalPricePerUnit}
              unit={product.unit}
            />

            {/* Freshness Countdown Widget */}
            <FreshnessCountdown
              harvestDateStr={product.harvestDate}
              shelfLifeDays={product.expectedShelfLifeDays}
              basePrice={product.basePricePerUnit}
              minFloorPrice={product.minFloorPricePerUnit}
              unit={product.unit}
            />

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                Select Quantity ({product.unit}):
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded-2xl bg-stone-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(product.minOrderQuantity, quantity - 1))}
                    className="p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-200 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-200 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-stone-500 inline-flex items-center">
                  Total Subtotal: <strong className="text-stone-900 font-bold text-sm ml-1 inline-flex items-center"><RupeeSymbol size={13} />{totalPrice}</strong>
                </div>
              </div>
            </div>

            {/* Add to Cart & Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => addToCart(product, quantity)}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-emerald-900/20 transition-all hover:scale-101 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Add {quantity} {product.unit} to Basket (</span>
                <RupeeSymbol size={14} />
                <span>{totalPrice})</span>
              </button>

              <button
                type="button"
                onClick={() => navigateToBatch(product.batchId)}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-800" />
                <span>Open Full Batch Traceability & Lab Report</span>
              </button>
            </div>

            {/* Delivery & Transparency Badges */}
            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Hyperlocal delivery or direct farm collection supported</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>100% money-back guarantee for transit damage or incorrect weight</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={product.title}
        subtitle={`Batch ID: ${product.batchId} • Harvested: ${new Date(product.harvestDate).toLocaleDateString()}`}
        targetPath={`#batch/${product.batchId}`}
        onNavigate={() => navigateToBatch(product.batchId)}
      />
    </div>
  );
};
