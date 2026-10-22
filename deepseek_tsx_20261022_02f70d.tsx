      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : displayedProducts.length === 0 ? (
        <EmptyState title="No matching produce found" description="Try adjusting filters or clearing the search query." actionLabel="Reset All Filters" onAction={resetFilters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map((product) => {