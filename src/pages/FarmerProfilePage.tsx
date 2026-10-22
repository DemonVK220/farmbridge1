import React from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  Award,
  FlaskConical,
  ShieldCheck,
  Package,
  Star,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrustBadge } from '../components/TrustBadge';
import { RupeeSymbol } from '../components/Currency';

export const FarmerProfilePage: React.FC = () => {
  const {
    farmers,
    products,
    selectedFarmerId,
    setCurrentView,
    navigateToProduct,
    navigateToBatch,
    addToCart,
  } = useApp();

  const farmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];
  const farmerProducts = products.filter((p) => p.farmerId === farmer.id && p.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => setCurrentView('farmer_directory')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Farmers Directory</span>
      </button>

      {/* Hero Farm Header */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="h-44 sm:h-56 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 relative">
          <img
            src={farmer.liveFarmPhotoUrl}
            alt="Farm lands"
            className="w-full h-full object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Geo-stamped Live Camera Field View</span>
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-8 relative -mt-16 sm:-mt-20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={farmer.avatarUrl}
                alt={farmer.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white shrink-0"
              />
              <div className="pb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
                  {farmer.name}
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>
                    {farmer.approxVillage}, {farmer.district}, {farmer.state}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-stone-600 font-medium">
                  <span>Cultivating {farmer.landAcres} Acres</span>
                  <span>•</span>
                  <span>{farmer.farmingType}</span>
                  <span>•</span>
                  <span>Member since {farmer.joinedYear}</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center sm:text-right shrink-0">
              <div className="flex items-center justify-center sm:justify-end gap-1 text-amber-500 font-bold text-lg">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-stone-900">{farmer.rating}</span>
                <span className="text-xs text-stone-500 font-normal">/ 5.0</span>
              </div>
              <span className="text-[11px] text-stone-500 block">
                {farmer.totalCompletedOrders} Verified Completed Orders
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-3xl">
            {farmer.bio}
          </p>

          {/* Badges Bar */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2">
            <TrustBadge level={farmer.verificationLevel} size="md" />
            {farmer.certificates?.map((cert) => (
              <TrustBadge key={cert.id} level={4} specificBadge={cert.type} size="md" />
            ))}
            {farmer.labReports?.[0] && (
              <TrustBadge level={5} specificBadge="Residue Report Verified" size="md" />
            )}
          </div>
        </div>
      </div>

      {/* Verification Evidence Ladder Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>Evidence Verification Audit Trail</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {farmer.badges.map((badge, idx) => (
            <div
              key={idx}
              className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  {badge.title}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full uppercase">
                  Verified
                </span>
              </div>
              <p className="text-stone-600">{badge.description}</p>
              <div className="text-[11px] text-stone-500 flex justify-between pt-1 border-t border-stone-200">
                <span>By: {badge.verifiedBy}</span>
                <span>Date: {badge.verifiedDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Farm Photo & Geo-timestamp Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-700" />
          <span>Live Farm Capture Proof</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="rounded-2xl overflow-hidden aspect-16/10 border border-stone-200">
            <img
              src={farmer.liveFarmPhotoUrl}
              alt="Farm verification evidence"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-2">
            <h3 className="font-bold text-stone-900">Anti-Spoofing Camera Evidence</h3>
            <p className="text-stone-600 leading-relaxed">
              {farmer.farmPhotoMetadata?.notes ||
                'Captured live on device camera sensor. Gallery uploads disabled.'}
            </p>
            <div className="pt-2 border-t border-stone-200 space-y-1 text-stone-500 text-[11px]">
              <div>Generalised Location: {farmer.farmPhotoMetadata?.approxVillage}</div>
              <div>Timestamp: {farmer.farmPhotoMetadata?.timestamp}</div>
              <div>Accuracy Radius: ±{farmer.farmPhotoMetadata?.accuracyMeters}m</div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Produce from this Farmer */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-stone-900 font-serif">
          Active Harvest Batches from {farmer.name}
        </h2>

        {farmerProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center text-xs text-stone-500">
            No active listings currently available from this farm. New harvest batches will appear following seasonal picking.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmerProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="rounded-2xl overflow-hidden aspect-16/10 mb-3 bg-stone-100">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3
                    onClick={() => navigateToProduct(product.id)}
                    className="font-bold text-sm text-stone-900 hover:text-emerald-800 cursor-pointer"
                  >
                    {product.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Harvested: {new Date(product.harvestDate).toLocaleDateString()}
                  </p>
                  <div className="mt-2 text-base font-extrabold text-stone-900 inline-flex items-center">
                    <RupeeSymbol size={14} />
                    {product.basePricePerUnit}
                    <span className="text-xs font-normal text-stone-500">/{product.unit}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => navigateToBatch(product.batchId)}
                    className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold"
                  >
                    Batch Trace
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
