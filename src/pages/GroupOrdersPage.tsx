import React, { useState } from 'react';
import {
  Users,
  Plus,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Share2,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateGroupOrderSplit } from '../utils/rules';
import { RupeeSymbol } from '../components/Currency';

export const GroupOrdersPage: React.FC = () => {
  const { groupOrders, joinGroupOrder, addToast, setCurrentView } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<string>(groupOrders[0]?.id || '');
  const [joinQuantity, setJoinQuantity] = useState<number>(5);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newLocality, setNewLocality] = useState('');
  const [newCity, setNewCity] = useState('');

  const currentGroup = groupOrders.find((g) => g.id === selectedGroup) || groupOrders[0];

  const splitInfo = calculateGroupOrderSplit(
    currentGroup.currentQuantityKg,
    currentGroup.participantsCount,
    60
  );

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    joinGroupOrder(currentGroup.id, joinQuantity);
  };

  const handleShareInvite = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}#group/${currentGroup.id}`
    );
    addToast('success', 'Group invite link copied! Share with your apartment or locality WhatsApp group.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Hyperlocal Group Orders</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
              Hyperlocal Group Orders with Neighbours
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Order farm produce collectively with families in your apartment or neighborhood. Split delivery fees and unlock volume savings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Neighbourhood Hub</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Active Hubs on left, Details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Hub Selector List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
            Open Neighbourhood Hubs Near You
          </h2>

          <div className="space-y-3">
            {groupOrders.map((grp) => {
              const isSelected = grp.id === currentGroup.id;
              const progressPct = Math.min(
                100,
                Math.round((grp.currentQuantityKg / grp.targetQuantityKg) * 100)
              );

              return (
                <div
                  key={grp.id}
                  onClick={() => setSelectedGroup(grp.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-700 bg-white shadow-md ring-2 ring-emerald-600/20'
                      : 'border-stone-200 bg-stone-50/70 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm text-stone-900">{grp.groupTitle}</h3>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {grp.participantsCount} Families
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {grp.locality}, {grp.city}
                    </span>
                  </p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-stone-600 font-medium">
                      <span>Progress towards Bulk Tier:</span>
                      <span>
                        {grp.currentQuantityKg} / {grp.targetQuantityKg} kg ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-950 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Strict Customer Privacy Protection
            </span>
            <p className="text-[11px] text-emerald-900/90 leading-relaxed">
              Your personal phone number and exact apartment unit number are strictly kept confidential and never shown to other group participants. Deliveries arrive at your common lobby or designated volunteer hub.
            </p>
          </div>
        </div>

        {/* Selected Hub Details & Join Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-5">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
                  Active Neighbourhood Hub
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-900">
                  {currentGroup.groupTitle}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Organized by: {currentGroup.organizerName} • Deadline: {new Date(currentGroup.deadline).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={handleShareInvite}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Invite Neighbours</span>
              </button>
            </div>

            {/* Split Breakdown Card */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-xs text-stone-500 block">Combined Harvest Weight</span>
                <strong className="text-xl font-bold text-stone-900 font-serif">
                  {currentGroup.currentQuantityKg} kg
                </strong>
                <span className="text-[10px] text-stone-400 block">Across {currentGroup.participantsCount} households</span>
              </div>

              <div>
                <span className="text-xs text-stone-500 block">Bulk Tier Savings</span>
                <strong className="text-xl font-bold text-emerald-900 font-serif">
                  {splitInfo.discountPercent}% OFF
                </strong>
                <span className="text-[10px] text-emerald-700 block">Applied to farm produce</span>
              </div>

              <div>
                <span className="text-xs text-stone-500 block">Per-Household Delivery</span>
                <strong className="text-xl font-bold text-stone-900 font-serif flex items-center">
                  <RupeeSymbol size={18} className="mr-0.5" />{splitInfo.perPersonDeliveryFee}
                </strong>
                <span className="text-[10px] text-stone-400 flex items-center">Split evenly (was <RupeeSymbol size={9} className="mx-0.5" />60)</span>
              </div>
            </div>

            {/* Harvest items offered in this group */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Fresh Farm Produce in this Collective Order
              </h3>

              <div className="space-y-2">
                {currentGroup.itemsOffered.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="font-bold text-stone-900">{item.title}</strong>
                      <span className="text-stone-500 block text-[11px]">
                        Farmer: {item.farmerName}
                      </span>
                    </div>
                    <span className="font-extrabold text-stone-900 inline-flex items-center">
                      <RupeeSymbol size={11} className="mr-0.5" />{item.basePrice}/{item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Participation Form */}
            <form onSubmit={handleJoin} className="pt-4 border-t border-stone-200 space-y-4">
              <h3 className="text-sm font-bold text-stone-900">
                Join this Group Order
              </h3>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Your Quantity Commitment (kg):
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={joinQuantity}
                    onChange={(e) => setJoinQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900"
                  />
                </div>

                <div className="self-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Confirm +{joinQuantity} kg Participation
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-stone-500">
                When the group order deadline locks on {new Date(currentGroup.deadline).toLocaleDateString()}, the farmer receives a single aggregated harvest order. You will receive an SMS and WhatsApp notification with your delivery pickup slot.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Create New Group Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold font-serif text-stone-900">
              Start a Neighbourhood Hub
            </h3>
            <p className="text-xs text-stone-500">
              Become a volunteer hub organizer for your apartment or residential colony.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Community Hub Name</label>
                <input
                  type="text"
                  placeholder="e.g. Prestige Shantiniketan Tower 8 Collective"
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Locality</label>
                <input
                  type="text"
                  placeholder="e.g. Whitefield"
                  value={newLocality}
                  onChange={(e) => setNewLocality(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">City & State</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Karnataka"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newGroupTitle) {
                    addToast('success', `Neighbourhood Hub "${newGroupTitle}" created!`);
                    setShowCreateModal(false);
                  }
                }}
                className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl"
              >
                Create Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
