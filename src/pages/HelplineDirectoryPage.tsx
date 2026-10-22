import React, { useState } from 'react';
import {
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Info,
  Calendar,
  CheckCircle2,
  Edit2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HelplineDirectoryPage: React.FC = () => {
  const { helplines, currentRole, updateHelplineVerification } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editVerified, setEditVerified] = useState(true);

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditNotes(item.notes);
    setEditVerified(item.isVerified);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateHelplineVerification(editingId, editVerified, editNotes);
      setEditingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Help & Helplines</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
              Agricultural Helplines & Official Resources
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">
              Verified national directory of government agricultural helplines, crop insurance desks, consumer grievance channels, and cyber fraud reporting. Every record lists its official source and last verified timestamp.
            </p>
          </div>
        </div>
      </div>

      {/* Verification Transparency Policy Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-xs text-amber-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-bold">Helpline Verification & Safety Rule:</strong>
          <p className="leading-relaxed">
            Government numbers and operating timings change over time. Every listing below includes the authoritative government portal link. Per FarmBridge safety policy, contacts are verified against active ministry circulars; any unverified desk number is prominently flagged as &ldquo;Awaiting official verification&rdquo; until authenticated by our desk.
          </p>
        </div>
      </div>

      {/* Helplines List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helplines.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-stone-900 font-serif">
                    {item.serviceName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {item.isVerified ? (
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        Verified Active Contact
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        Awaiting Official Verification
                      </span>
                    )}
                  </div>
                </div>

                {currentRole === 'admin' && (
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    title="Audit or update helpline record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Audit</span>
                  </button>
                )}
              </div>

              {/* Purpose */}
              <p className="text-xs text-stone-700 leading-relaxed">
                {item.intendedUse}
              </p>

              {/* Phone and Hours */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Helpline Number:</span>
                  <strong className="text-sm font-bold text-stone-900 font-mono tracking-wide">
                    {item.phoneNumber}
                  </strong>
                </div>

                <div className="flex items-start justify-between text-stone-600">
                  <span className="text-stone-500">Operating Hours:</span>
                  <span className="text-right font-medium max-w-[200px]">{item.operatingHours}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="text-[11px] text-stone-500 leading-relaxed">
                {item.notes}
              </div>
            </div>

            {/* Actions: Call button & Official Source */}
            <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between text-xs">
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-800 hover:underline flex items-center gap-1 font-semibold text-xs"
              >
                <span>Official Portal Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${item.phoneNumber.split('/')[0].replace(/[^0-9]/g, '')}`}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>

            <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1">
              <span>Last Checked by Desk: {item.lastVerifiedDate}</span>
              <span>Information may change; confirm on official portal</span>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Audit Edit Modal */}
      {editingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setEditingId(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-stone-900 font-serif">
                Audit Helpline Verification Record
              </h3>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold">
                <input
                  type="checkbox"
                  checked={editVerified}
                  onChange={(e) => setEditVerified(e.target.checked)}
                  className="accent-emerald-800"
                />
                <span>Confirm number is actively published on official ministry portal</span>
              </label>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Verification Notes & Source Citation:
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="flex-1 py-2 bg-stone-100 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-800 text-white rounded-xl font-bold"
                >
                  Save Audit Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
