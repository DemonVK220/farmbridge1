import React, { useState, useEffect } from 'react';
import { X, MapPin, Plus, Minus, ShoppingCart, ExternalLink, QrCode, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrustBadge } from './TrustBadge';
import { MandiPriceBadge } from './MandiPriceBadge';
import { FreshnessCountdown } from './FreshnessCountdown';
import { RupeeSymbol } from './Currency';
import { calculateSurplusDiscount } from '../utils/rules';

interface Props { productId: string | null; onClose: () => void; }

export const ProductQuickView: React.FC<Props> = ({ productId, onClose }) => {
  const { products, farmers, addToCart, navigateToProduct, navigateToFarmer, navigateToBatch } = useApp();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { setQuantity(1); }, [productId]);
  useEffect(() => {
    if (!productId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [productId, onClose]);

  if (!productId) return null;
  const product = products.find((p) => p.id === productId);
  if (!product) return null;
  const farmer = farmers.find((f) => f.id === product.farmerId) || farmers[0];
  const surplus = calculateSurplusDiscount(product.harvestDate, product.expectedShelfLifeDays, product.basePricePerUnit, product.minFloorPricePerUnit);
  const total = surplus.finalPricePerUnit * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200" onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-4/3 md:aspect-auto md:h-full bg-stone-100 min-h-[240px]">
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">{product.variety}</span>
            <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-white rounded-full shadow-xs cursor-pointer" aria-label="Close">
              <X className="w-4 h-4 text-stone-700" />
            </button>
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-lg">
              Batch #{product.batchId.replace('batch-', '')}
            </div>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <TrustBadge level={farmer.verificationLevel} size="sm" />
                {farmer.certificates?.[0] && <TrustBadge level={4} specificBadge={farmer.certificates[0].type} size="sm" />}
              </div>
              <h2 className="text-lg font-bold font-serif text-stone-900 leading-tight">{product.title}</h2>
              <button onClick={() => { onClose(); navigateToFarmer(farmer.id); }} className="text-xs text-stone-500 hover:text-emerald-700 flex items-center gap-1 mt-1 cursor-pointer">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" /><span>{farmer.name} • {farmer.approxVillage}</span>
              </button>
            </div>
            <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 block">Farm Price / {product.unit}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-emerald-950 font-serif inline-flex items-center">
                      <RupeeSymbol size={18} />{surplus.finalPricePerUnit}
                    </span>
                    {surplus.discountPercent > 0 && <span className="line-through text-stone-400 text-xs inline-flex items-center"><RupeeSymbol size={10} />{product.basePricePerUnit}</span>}
                  </div>
                </div>
                {surplus.discountPercent > 0 && (
                  <span className="bg-orange-100 text-orange-900 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />{surplus.discountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-500">
                <span>Stock: {product.availableQuantity} {product.unit}</span>
                <span className="text-emerald-800 font-bold inline-flex items-center">Platform Fee: <RupeeSymbol size={9} className="ml-0.5" />0</span>
              </div>
            </div>
            <MandiPriceBadge comparison={product.mandiComparison} farmBridgePrice={surplus.finalPricePerUnit} unit={product.unit} />
            <FreshnessCountdown harvestDateStr={product.harvestDate} shelfLifeDays={product.expectedShelfLifeDays} basePrice={product.basePricePerUnit} minFloorPrice={product.minFloorPricePerUnit} unit={product.unit} />
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-stone-300 rounded-2xl bg-stone-50 p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-xl cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                <span className="w-8 text-center font-bold text-xs text-stone-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-xl cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
              </div>
              <button onClick={() => { addToCart(product, quantity); onClose(); }} className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" /><span>Add to Basket (</span><RupeeSymbol size={12} /><span>{total})</span>
              </button>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { onClose(); navigateToProduct(product.id); }} className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /><span>Full Details</span>
              </button>
              <button onClick={() => { onClose(); navigateToBatch(product.batchId); }} className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-emerald-800" /><span>Batch Trace</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};