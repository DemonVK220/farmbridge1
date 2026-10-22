  React.useEffect(() => { setVisibleCount(PAGE_SIZE); }, [selectedCategory, searchQuery, minTrustLevel, maxPrice, onlySurplusDeals, sortBy]);
  const { data: filteredResults, isLoading } = useSimulatedLoad(filteredProducts, [selectedCategory, searchQuery, minTrustLevel, maxPrice, onlySurplusDeals, sortBy], 300);
  const displayedProducts = filteredResults.slice(0, visibleCount);
  const hasMore = filteredResults.length > visibleCount;