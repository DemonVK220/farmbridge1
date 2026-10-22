import React from 'react';
import { Heart, ShoppingCart, MapPin, ArrowRight, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrustBadge } from '../components/TrustBadge';
import { RupeeSymbol } from '../components/Currency';

export const SavedItemsPage: React.FC = () => {
  const { products, farmers, savedProductIds, toggleSaveProduct, addToCart, navigateToProduct, navigateToFarmer, setCurrentView } = useApp();
  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif flex items-center gap-2">
          <Heart className="w-7 h-7 text-emerald-700" /><span>Saved Produce</span>
        </h1>
        <p className="text-xs text-stone-500 mt-1">Your favourited farm listings.</p>
      </div>
      {savedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto text-stone-400">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-stone-900">No saved items yet</h3>
          <p className="text-xs text-stone-500">Tap the heart icon on any produce listing to save it for later.</p>
          <button onClick={() => setCurrentView('browse')} className="mt-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer">Browse Produce</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProducts.map((product) => {
            const farmer = farmers.find((f) => f.id === product.farmerId) || farmers[0];
            return (
              <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">{product.variety}</span>
                    <button onClick={() => toggleSaveProduct(product.id)} className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-white rounded-xl shadow-xs cursor-pointer" title="Remove">
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    </button>
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-lg">Batch #{product.batchId}</div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <TrustBadge level={farmer.verificationLevel} size="sm" />
                      {farmer.certificates?.[0] && <TrustBadge level={4} specificBadge={farmer.certificates[0].type} size="sm" />}
                    </div>
                    <div>
                      <h3 onClick={() => navigateToProduct(product.id)} className="font-bold text-stone-900 text-base hover:text-emerald-800 cursor-pointer line-clamp-1 leading-snug">{product.title}</h3>
                      <button onClick={() => navigateToFarmer(farmer.id)} className="text-xs text-stone-500 hover:text-emerald-700 flex items-center gap-1 mt-1 cursor-pointer">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" /><span>{farmer.name} • {farmer.approxVillage}</span>
                      </button>
                    </div>
                    <div className="flex items-baseline justify-between pt-1 border-t border-stone-100">
                      <span className="text-lg font-extrabold text-emerald-950 inline-flex items-center">
                        <RupeeSymbol size={15} />{product.basePricePerUnit}<span className="text-xs text-stone-500 font-normal">/{product.unit}</span>
                      </span>
                      <span className="text-[11px] text-stone-500">Stock: {product.availableQuantity} {product.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-stone-100 flex gap-2">
                  <button onClick={() => addToCart(product, 1)} className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5" /><span>Add to Basket</span>
                  </button>
                  <button onClick={() => toggleSaveProduct(product.id)} className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {savedProducts.length > 0 && (
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between flex-wrap gap-2">
          <span>Ready to order? Add everything to your basket in one go.</span>
          <button onClick={() => { savedProducts.forEach((p) => addToCart(p, 1)); setCurrentView('cart'); }} className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5">
            <span>Add All to Cart</span><ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};