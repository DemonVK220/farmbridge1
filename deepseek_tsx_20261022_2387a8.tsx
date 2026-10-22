      <ProductQuickView productId={quickViewId} onClose={() => setQuickViewId(null)} />
      {!isLoading && displayedProducts.length > 0 && hasMore && (
        <div className="flex flex-col items-center gap-2 pt-4">
          <p className="text-xs text-stone-500">Showing <strong>{displayedProducts.length}</strong> of <strong>{filteredResults.length}</strong></p>
          <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs rounded-xl border border-stone-300 shadow-xs cursor-pointer">Load {Math.min(PAGE_SIZE, filteredResults.length - visibleCount)} more</button>
        </div>
      )}