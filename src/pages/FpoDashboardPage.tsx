import React, { useState } from 'react';
import {
  Users,
  Building2,
  Package,
  Plus,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FpoDashboardPage: React.FC = () => {
  const { farmers, addToast } = useApp();
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberAcreage, setMemberAcreage] = useState(3.0);
  const [memberVillage, setMemberVillage] = useState('Pennagaram');

  const fpoName = 'Dharmapuri Organic Farmers Producer Company Ltd.';
  const cinNo = 'U01100TN2022PTC149812';

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', `Member farmer ${memberName} registered under ${fpoName}!`);
    setShowAddMember(false);
    setMemberName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
            FPO Collective Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white mt-1">
            {fpoName}
          </h1>
          <p className="text-xs text-emerald-200 mt-0.5">
            Registered FPO • CIN #{cinNo} • 48 Shareholder Member Farmers
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddMember(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Member Farmer</span>
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-stone-200">
          <span className="text-stone-500 font-medium block">Member Farmers</span>
          <strong className="text-2xl font-bold font-serif text-stone-900 block mt-1">
            48 Members
          </strong>
          <span className="text-stone-400 block mt-0.5">Across 6 Panchayat Villages</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200">
          <span className="text-stone-500 font-medium block">Collective Cultivation</span>
          <strong className="text-2xl font-bold font-serif text-stone-900 block mt-1">
            142 Acres
          </strong>
          <span className="text-emerald-700 font-semibold block mt-0.5">
            PGS Organic Certified
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200">
          <span className="text-stone-500 font-medium block">Aggregated Produce Sold</span>
          <strong className="text-2xl font-bold font-serif text-stone-900 block mt-1">
            54.2 MT
          </strong>
          <span className="text-stone-400 block mt-0.5">This Agricultural Year</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200">
          <span className="text-stone-500 font-medium block">Direct Farmer Realization</span>
          <strong className="text-2xl font-bold font-serif text-emerald-950 block mt-1">
            92.4%
          </strong>
          <span className="text-stone-400 block mt-0.5">Vs 58% Traditional Mandi</span>
        </div>
      </div>

      {/* Roster of Member Farmers */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 font-serif">
          Associated Member Farmers Roster
        </h2>

        <div className="divide-y divide-stone-100 text-xs">
          {farmers.map((farmer) => (
            <div
              key={farmer.id}
              className="py-3.5 first:pt-0 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={farmer.avatarUrl}
                  alt={farmer.name}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-600"
                />
                <div>
                  <strong className="text-stone-900 font-bold block">{farmer.name}</strong>
                  <span className="text-stone-500 text-[11px]">
                    {farmer.approxVillage} • {farmer.landAcres} Acres • Level {farmer.verificationLevel}
                  </span>
                </div>
              </div>

              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-1 rounded-full">
                Active Aggregation Member
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowAddMember(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold font-serif text-stone-900">
              Register FPO Member Farmer
            </h3>
            <p className="text-xs text-stone-500">
              Add a verified grower to your FPO collective roster for aggregated batch listings.
            </p>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Farmer Full Name:</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Mobile Number:</label>
                <input
                  type="tel"
                  required
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Village:</label>
                  <input
                    type="text"
                    required
                    value={memberVillage}
                    onChange={(e) => setMemberVillage(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Cultivated Acres:</label>
                  <input
                    type="number"
                    step={0.1}
                    required
                    value={memberAcreage}
                    onChange={(e) => setMemberAcreage(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="flex-1 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-800 text-white rounded-xl font-bold"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
