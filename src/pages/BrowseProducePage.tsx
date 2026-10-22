import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  QrCode,
  Tag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrustBadge } from '../components/TrustBadge';
import { MandiPriceBadge } from '../components/MandiPriceBadge';
import { FreshnessCountdown } from '../components/FreshnessCountdown';
import { QRCodeModal } from '../components/QRCodeModal';
import { RupeeSymbol } from '../components/Currency';

export const BrowseProducePage: React.FC = () => {
  const {
    products,
    farmers,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addToCart,
    navigateToProduct,
    navigateToFarmer,
    navigateToBatch,
  } = useApp();

  const [minTrustLevel, setMinTrustLevel] = useState<number>(1);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [onlySurplusDeals, setOnlySurplusDeals] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'harvest_newest' | 'price_low' | 'price_high'>('harvest_newest');

  // QR Modal state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQrBatch, setSelectedQrBatch] = useState<{ id: string; title: string } | null>(null);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Millets', 'Spices'];

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Must be active listing
      if (item.status !== 'active') return false;

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search query (matches title, variety, cropKey, farmer village)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const farmer = farmers.find((f) => f.id === item.farmerId);
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchVariety = item.variety.toLowerCase().includes(q);
        const matchFarmer = farmer?.name.toLowerCase().includes(q);
        const matchVillage = farmer?.approxVillage.toLowerCase().includes(q);
        if (!matchTitle && !matchVariety && !matchFarmer && !matchVillage) {
          return false;
        }
      }

      // Max price filter
      if (item.basePricePerUnit > maxPrice) {
        return false;
      }

      // Trust Level filter
      const farmer = farmers.find((f) => f.id === item.farmerId);
      if (farmer && farmer.verificationLevel < minTrustLevel) {
        return false;
      }

      // Surplus Deals only
      if (onlySurplusDeals && item.expectedShelfLifeDays > 6) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.basePricePerUnit - b.basePricePerUnit;
      if (sortBy === 'price_high') return b.basePricePerUnit - a.basePricePerUnit;
      return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
    });
  }, [products, farmers, selectedCategory, searchQuery, maxPrice, minTrustLevel, onlySurplusDeals, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMinTrustLevel(1);
    setMaxPrice(200);
    setOnlySurplusDeals(false);
    setSortBy('harvest_newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Browse Produce</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
          Direct Farm Produce Directory
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Explore harvest batches direct from Indian farmers. Every listing displays transparent mandi modal rates, verified trust badges, and harvest batch photos.
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by crop, variety, farmer name, village..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-2xl px-3 py-2.5 focus:outline-none cursor-pointer"
            >
              <option value="harvest_newest">Harvest Date: Most Recent</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Deep Filters: Trust Level & Price */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs items-center">
          {/* Trust Level Selector */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              Minimum Farmer Verification Level:
            </label>
            <select
              value={minTrustLevel}
              onChange={(e) => setMinTrustLevel(Number(e.target.value))}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none font-medium cursor-pointer"
            >
              <option value={1}>Level 1+: Phone Verified</option>
              <option value={2}>Level 2+: Farm Evidence Reviewed</option>
              <option value={3}>Level 3+: Locally Verified</option>
              <option value={4}>Level 4+: Certificate Verified (Organic/FSSAI)</option>
              <option value={5}>Level 5: Residue Report Verified (Lab Tested)</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-stone-700">Max Price per Unit:</label>
              <span className="font-extrabold text-emerald-900 inline-flex items-center">
                <RupeeSymbol size={12} className="mr-0.5" />{maxPrice}/kg
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={200}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
          </div>

          {/* Surplus Toggle & Reset */}
          <div className="flex items-center justify-between gap-3 pt-2 md:pt-0">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlySurplusDeals}
                onChange={(e) => setOnlySurplusDeals(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 accent-emerald-800"
              />
              <span className="text-xs font-semibold text-stone-800">
                Surplus Freshness Discounts Only
              </span>
            </label>

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-stone-500 hover:text-stone-800 underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-600">
        <span>
          Showing <strong>{filteredProducts.length}</strong> verified harvest listing(s)
        </span>
        <span className="text-emerald-800 font-semibold inline-flex items-center">
          Platform Marketplace Fee: <RupeeSymbol size={10} className="mx-0.5" />0
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900">No matching produce found</h3>
          <p className="text-xs text-stone-500">
            Try adjusting your category, price range, or clearing the search query to view all available harvest batches.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const farmer = farmers.find((f) => f.id === product.farmerId) || farmers[0];

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        {product.variety}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedQrBatch({ id: product.batchId, title: product.title });
                        setQrModalOpen(true);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-stone-800 rounded-xl shadow-xs transition-transform hover:scale-110 cursor-pointer"
                      title="Scan QR Traceability Code"
                    >
                      <QrCode className="w-4 h-4 text-emerald-800" />
                    </button>

                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-lg">
                      Batch #{product.batchId}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Verification Ladder Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <TrustBadge level={farmer.verificationLevel} size="sm" />
                      {farmer.certificates?.[0] && (
                        <TrustBadge
                          level={4}
                          specificBadge={farmer.certificates[0].type}
                          size="sm"
                        />
                      )}
                    </div>

                    {/* Title & Farmer Details */}
                    <div>
                      <h3
                        onClick={() => navigateToProduct(product.id)}
                        className="font-bold text-stone-900 text-base hover:text-emerald-800 cursor-pointer transition-colors leading-snug line-clamp-1"
                      >
                        {product.title}
                      </h3>

                      <button
                        type="button"
                        onClick={() => navigateToFarmer(farmer.id)}
                        className="text-xs text-stone-500 hover:text-emerald-700 flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span>
                          {farmer.name} • {farmer.approxVillage}
                        </span>
                      </button>
                    </div>

                    {/* Mandi Comparison */}
                    <MandiPriceBadge
                      comparison={product.mandiComparison}
                      farmBridgePrice={product.basePricePerUnit}
                      unit={product.unit}
                    />

                    {/* Freshness Countdown & Floor Price */}
                    <FreshnessCountdown
                      harvestDateStr={product.harvestDate}
                      shelfLifeDays={product.expectedShelfLifeDays}
                      basePrice={product.basePricePerUnit}
                      minFloorPrice={product.minFloorPricePerUnit}
                      unit={product.unit}
                    />
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateToBatch(product.batchId)}
                    className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center"
                  >
                    View Traceability
                  </button>

                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                  >
                    Add to Basket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Modal for Batch Traceability */}
      {selectedQrBatch && (
        <QRCodeModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          title={`Batch QR: ${selectedQrBatch.title}`}
          subtitle={`Batch ID: ${selectedQrBatch.id}`}
          targetPath={`#batch/${selectedQrBatch.id}`}
          onNavigate={() => navigateToBatch(selectedQrBatch.id)}
        />
      )}
    </div>
  );
};
