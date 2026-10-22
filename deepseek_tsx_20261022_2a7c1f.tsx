      {relatedProducts.length > 0 && (
        <div className="pt-4 border-t border-stone-200 space-y-4">
          <h2 className="text-xl font-bold text-stone-900 font-serif">More from {farmer.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedProducts.map((rp) => (
              <div key={rp.id} onClick={() => navigateToProduct(rp.id)} className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col">
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                  <img src={rp.imageUrl} alt={rp.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3"><h3 className="font-bold text-xs text-stone-900 line-clamp-1">{rp.title}</h3>
                  <div className="flex items-baseline justify-between mt-2"><span className="text-base font-extrabold text-emerald-950 inline-flex items-center"><RupeeSymbol size={13} />{rp.basePricePerUnit}</span><span className="text-[10px] text-stone-500">{rp.variety}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}