import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Package,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Camera,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LiveCaptureCameraModal } from '../components/LiveCaptureCameraModal';
import { RupeeSymbol } from '../components/Currency';

export const FarmerDashboardPage: React.FC = () => {
  const {
    products,
    farmers,
    batches,
    addFarmerListing,
    setCurrentView,
    navigateToBatch,
    addToast,
  } = useApp();

  const currentFarmer = farmers[0]; // S. Muthuvel
  const farmerBatches = batches.filter((b) => b.farmerId === currentFarmer.id);
  const farmerListings = products.filter((p) => p.farmerId === currentFarmer.id);

  // New Listing Form Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCropKey, setNewCropKey] = useState('tomatoes');
  const [newTitle, setNewTitle] = useState('');
  const [newVariety, setNewVariety] = useState('PKM-1 Heirloom');
  const [newQuantity, setNewQuantity] = useState(500);
  const [newAcreage, setNewAcreage] = useState(2.0);
  const [newBasePrice, setNewBasePrice] = useState(38);
  const [newFloorPrice, setNewFloorPrice] = useState(28);
  const [newShelfDays, setNewShelfDays] = useState(5);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addFarmerListing({
      farmerId: currentFarmer.id,
      cropKey: newCropKey,
      title: newTitle || `${newVariety} Harvest`,
      variety: newVariety,
      availableQuantity: newQuantity,
      acreage: newAcreage,
      basePricePerUnit: newBasePrice,
      minFloorPricePerUnit: newFloorPrice,
      expectedShelfLifeDays: newShelfDays,
      category: 'Vegetables',
    });

    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
            Farmer Portal • Simplified Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white mt-1">
            Namaste, {currentFarmer.name}!
          </h1>
          <p className="text-xs text-emerald-200 mt-0.5">
            {currentFarmer.approxVillage} • {currentFarmer.landAcres} Acres Cultivated • Verification Level {currentFarmer.verificationLevel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCameraModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-800/90 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-emerald-300" />
            <span>Live Camera Proof</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List New Harvest Batch</span>
          </button>
        </div>
      </div>

      {/* Simplified Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-stone-900">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Total Harvest Sales</span>
          <strong className="text-2xl font-bold font-serif text-stone-900 flex items-center mt-1">
            <RupeeSymbol size={22} className="mr-0.5" />84,250
          </strong>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center">
            Direct Payout • <RupeeSymbol size={9} className="mx-0.5" />0 platform fees
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Completed Orders</span>
          <strong className="text-2xl font-bold font-serif text-stone-900 block mt-1">
            {currentFarmer.totalCompletedOrders}
          </strong>
          <span className="text-[11px] text-stone-400 font-medium mt-0.5 block">
            Across 18 Local Hubs
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Active Harvest Batches</span>
          <strong className="text-2xl font-bold font-serif text-stone-900 block mt-1">
            {farmerBatches.length} Batches
          </strong>
          <span className="text-[11px] text-stone-400 font-medium mt-0.5 block">
            Batch QR Trace Enabled
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Customer Rating</span>
          <strong className="text-2xl font-bold font-serif text-amber-600 block mt-1">
            ★ {currentFarmer.rating}
          </strong>
          <span className="text-[11px] text-stone-400 font-medium mt-0.5 block">
            From verified orders only
          </span>
        </div>
      </div>

      {/* Current Batches & Freshness Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-stone-900">
            Your Active Harvest Batches
          </h2>
          <span className="text-xs text-stone-500">
            Protected floor pricing and automated surplus decay
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {farmerListings.map((item) => (
            <div
              key={item.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                />
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <span>Batch #{item.batchId}</span>
                    <span>•</span>
                    <span>Stock: {item.availableQuantity} {item.unit}</span>
                    <span>•</span>
                    <span>Harvested: {new Date(item.harvestDate).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="font-bold text-emerald-900 inline-flex items-center">
                      <RupeeSymbol size={11} className="mr-0.5" />{item.basePricePerUnit}/{item.unit}
                    </span>
                    <span className="text-stone-400 inline-flex items-center">
                      Floor Min: <RupeeSymbol size={10} className="mx-0.5" />{item.minFloorPricePerUnit}/{item.unit}
                    </span>
                    {item.isFlaggedForYieldReview && (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.2 rounded-full">
                        Under Yield Review
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => navigateToBatch(item.batchId)}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  View QR Trace
                </button>
                <button
                  type="button"
                  onClick={() => addToast('info', 'Batch inventory updated.')}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Update Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Listing Modal with Yield Sanity Check */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 text-stone-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900 font-serif">
                  List New Harvest Batch
                </h3>
                <span className="text-xs text-stone-500">
                  Includes automatic yield sanity check & floor price protection
                </span>
              </div>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Produce Name & Variety:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified Organic Country Tomatoes (PKM-1)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Crop Type:</label>
                  <select
                    value={newCropKey}
                    onChange={(e) => setNewCropKey(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="tomatoes">Tomatoes</option>
                    <option value="onions">Onions</option>
                    <option value="spinach">Spinach (Palak)</option>
                    <option value="millets">Millets (Ragi)</option>
                    <option value="rice">Rice (Basmati)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Plot Area (Acres):</label>
                  <input
                    type="number"
                    step={0.1}
                    required
                    value={newAcreage}
                    onChange={(e) => setNewAcreage(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Quantity (kg):</label>
                  <input
                    type="number"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1 flex items-center">Price (<RupeeSymbol size={10} className="mx-0.5" />/kg):</label>
                  <input
                    type="number"
                    required
                    value={newBasePrice}
                    onChange={(e) => setNewBasePrice(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1 flex items-center">Floor Min (<RupeeSymbol size={10} className="mx-0.5" />/kg):</label>
                  <input
                    type="number"
                    required
                    value={newFloorPrice}
                    onChange={(e) => setNewFloorPrice(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-[11px] leading-relaxed">
                Yield Check Rule: Listing quantity will be checked against standard agricultural extension harvest ranges for {newAcreage} acres of {newCropKey}. If volume is unusual, it will enter fair administrative review without penalty.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl"
                >
                  Publish Harvest Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Camera Modal */}
      <LiveCaptureCameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCaptureComplete={() => {
          addToast('success', 'Live camera farm proof recorded on-field!');
        }}
      />
    </div>
  );
};
