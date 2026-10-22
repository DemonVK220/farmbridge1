import React, { useState } from 'react';
import { Search, MapPin, Award, ShieldCheck, ChevronRight, Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrustBadge } from '../components/TrustBadge';

export const FarmerDirectoryPage: React.FC = () => {
  const { farmers, navigateToFarmer, setCurrentView } = useApp();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<number>(0);

  const filteredFarmers = farmers.filter((farmer) => {
    if (levelFilter > 0 && farmer.verificationLevel < levelFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = farmer.name.toLowerCase().includes(q);
      const matchLoc = farmer.approxVillage.toLowerCase().includes(q) || farmer.state.toLowerCase().includes(q);
      const matchCrops = farmer.cropsGrown.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchCrops) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Farmers Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
          Verified Indian Farmers Directory
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Every farmer profile features an evidence-based verification tier, live-captured farm evidence, and verified harvest batches.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by farmer name, district, or crops grown..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
            Verification:
          </span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(Number(e.target.value))}
            className="w-full sm:w-auto bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value={0}>All Trust Levels (1 to 5)</option>
            <option value={2}>Level 2+ (Farm Evidence Checked)</option>
            <option value={3}>Level 3+ (Locally Verified)</option>
            <option value={4}>Level 4+ (Certified Organic/FSSAI)</option>
            <option value={5}>Level 5 (Residue Lab Tested)</option>
          </select>
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarmers.map((farmer) => (
          <div
            key={farmer.id}
            onClick={() => navigateToFarmer(farmer.id)}
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={farmer.avatarUrl}
                    alt={farmer.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 shadow-xs group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {farmer.name}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{farmer.approxVillage}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-amber-600">★ {farmer.rating}</span>
                  <span className="text-[10px] text-stone-400 block">
                    {farmer.totalCompletedOrders} orders
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-1.5">
                <TrustBadge level={farmer.verificationLevel} size="sm" />
                {farmer.certificates?.[0] && (
                  <TrustBadge
                    level={4}
                    specificBadge={farmer.certificates[0].type}
                    size="sm"
                  />
                )}
              </div>

              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {farmer.bio}
              </p>

              {/* Crops list */}
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Crops Cultivated:
                </span>
                <div className="flex flex-wrap gap-1">
                  {farmer.cropsGrown.map((crop) => (
                    <span
                      key={crop}
                      className="bg-stone-100 text-stone-700 text-[11px] font-medium px-2 py-0.5 rounded-lg"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
              <span>{farmer.landAcres} Acres • {farmer.farmingType}</span>
              <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                View Farm Profile <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
