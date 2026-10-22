import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateCheckoutPricing } from '../utils/rules';
import { RupeeSymbol } from '../components/Currency';

export const CartPage: React.FC = () => {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart, setCurrentView, navigateToProduct, savedProductIds } = useApp();

  const pricing = calculateCheckoutPricing(
    cartItems.map((item) => ({
      farmerId: item.farmer.id, farmerName: item.farmer.name,
      quantity: item.quantity, basePrice: item.baseUnitPrice, discountedPrice: item.effectiveUnitPrice,
    })),
    'home_delivery'
  );

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto text-stone-400"><ShoppingBag className="w-8 h-8" /></div>
        <h2 className="text-2xl font-bold font-serif text-stone-900">Your Basket is Empty</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">Explore fresh harvest batches directly from verified farmers.</p>
        <button onClick={() => setCurrentView('browse')} className="mt-4 px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl shadow-sm cursor-pointer">Browse Fresh Produce</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">Your Produce Basket</h1>
          <p className="text-xs text-stone-500 mt-1">Produce sourced directly from verified farmers.</p>
        </div>
        <button onClick={clearCart} className="text-xs text-stone-500 hover:text-red-700 underline flex items-center gap-1 cursor-pointer">
          <Trash2 className="w-3.5 h-3.5" /><span>Clear Basket</span>
        </button>
      </div>

      {savedProductIds.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">You have {savedProductIds.length} saved item{savedProductIds.length > 1 ? 's' : ''}</strong>
              <span className="text-[11px] text-emerald-900/90">Open your saved items and add them to this basket.</span>
            </div>
          </div>
          <button onClick={() => setCurrentView('saved')} className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer">Open Saved Items</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          {pricing.farmerSplits.map((split) => {
            const itemsForThisFarmer = cartItems.filter((item) => item.farmer.id === split.farmerId);
            return (
              <div key={split.farmerId} className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Farm Dispatch: <strong className="text-stone-900 font-bold">{split.farmerName}</strong></span>
                  </div>
                  <span className="text-stone-500 inline-flex items-center">Farm Subtotal: <strong className="ml-1 inline-flex items-center"><RupeeSymbol size={11} />{split.subtotal}</strong></span>
                </div>
                <div className="divide-y divide-stone-100 p-4 space-y-3">
                  {itemsForThisFarmer.map((item) => (
                    <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-4 justify-between">
                      <img src={item.product.imageUrl} alt={item.product.title} className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 onClick={() => navigateToProduct(item.product.id)} className="font-bold text-xs text-stone-900 hover:text-emerald-800 cursor-pointer truncate">{item.product.title}</h4>
                        <span className="text-[11px] text-stone-500 block">Variety: {item.product.variety} • Batch #{item.product.batchId}</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-extrabold text-xs text-stone-900 inline-flex items-center"><RupeeSymbol size={11} />{item.effectiveUnitPrice}/{item.product.unit}</span>
                          {item.discountPercent > 0 && <span className="line-through text-[11px] text-stone-400 inline-flex items-center"><RupeeSymbol size={10} />{item.baseUnitPrice}</span>}
                          {item.discountPercent > 0 && <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.2 rounded">{item.discountPercent}% Off</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border border-stone-300 rounded-xl bg-stone-50 p-0.5 shrink-0">
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-1 text-stone-600 hover:bg-stone-200 rounded-lg cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-8 text-center font-bold text-xs text-stone-900">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-1 text-stone-600 hover:bg-stone-200 rounded-lg cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="text-right shrink-0">
                        <strong className="block text-xs font-bold text-stone-900 inline-flex items-center"><RupeeSymbol size={11} />{item.effectiveUnitPrice * item.quantity}</strong>
                        <button onClick={() => removeFromCart(item.product.id)} className="block text-[10px] text-stone-400 hover:text-red-700 underline mt-1 cursor-pointer">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-serif">Full Upfront Cost Summary</h3>
            <div className="space-y-2.5 text-xs text-stone-700 pb-4 border-b border-stone-200">
              <div className="flex justify-between"><span className="text-stone-500">Produce Subtotal:</span><span className="inline-flex items-center"><RupeeSymbol size={11} />{pricing.itemsSubtotal}</span></div>
              {pricing.totalSurplusSavings > 0 && (
                <div className="flex justify-between text-orange-700 font-medium">
                  <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />Surplus Freshness Savings:</span>
                  <span className="inline-flex items-center">-<RupeeSymbol size={11} />{pricing.totalSurplusSavings}</span>
                </div>
              )}
              <div className="flex justify-between"><span className="text-stone-500">Third-party Delivery ({pricing.farmerSplits.length} farm origin):</span><span className="inline-flex items-center"><RupeeSymbol size={11} />{pricing.deliveryCharge}</span></div>
              <div className="flex justify-between items-center text-emerald-900 font-bold bg-emerald-50 p-2 rounded-xl"><span>FarmBridge Platform Fee:</span><span className="text-xs uppercase tracking-wide inline-flex items-center"><RupeeSymbol size={11} className="mr-0.5" />0 (Free)</span></div>
              <div className="flex justify-between text-stone-500"><span>GST on Fresh Produce:</span><span className="inline-flex items-center"><RupeeSymbol size={11} />0 (Exempted)</span></div>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-xs text-stone-500 block">Total Payable:</span>
                <span className="text-2xl font-extrabold text-stone-900 font-serif inline-flex items-center"><RupeeSymbol size={20} />{pricing.totalPayable}</span>
              </div>
              <span className="text-[11px] text-stone-500">No hidden charges</span>
            </div>
            <button onClick={() => setCurrentView('checkout')} className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span>Proceed to Upfront Checkout (</span><RupeeSymbol size={14} /><span>{pricing.totalPayable})</span><ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-700" />Direct Payout Guarantee</span>
            <p className="text-[11px] leading-relaxed">100% of produce price goes directly into farmer accounts upon delivery confirmation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};