import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  FlaskConical,
  Award,
  MapPin,
  Calendar,
  Package,
  ShieldCheck,
  QrCode,
  Share2,
  Copy,
  Clock,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrustBadge } from '../components/TrustBadge';
import { QRCodeModal } from '../components/QRCodeModal';
import { RupeeSymbol } from '../components/Currency';

export const BatchTraceabilityPage: React.FC = () => {
  const {
    batches,
    farmers,
    products,
    selectedBatchId,
    setCurrentView,
    navigateToFarmer,
    navigateToProduct,
    addToCart,
    addToast,
  } = useApp();

  const [qrModalOpen, setQrModalOpen] = useState(false);

  const batch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const farmer = farmers.find((f) => f.id === batch.farmerId) || farmers[0];
  const associatedProduct = products.find((p) => p.batchId === batch.id);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    addToast('success', 'Traceability passport link copied to clipboard.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentView('browse')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share Passport</span>
          </button>

          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="p-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Show QR Code</span>
          </button>
        </div>
      </div>

      {/* Main Passport Header */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Harvest Passport
            </span>
            <span className="text-xs font-mono text-emerald-300">
              Batch #{batch.id}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            {batch.cropName}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100/90 pt-1">
            <span>Variety: <strong>{batch.variety}</strong></span>
            <span>•</span>
            <span>Harvested: <strong>{new Date(batch.harvestDate).toLocaleDateString()}</strong></span>
            <span>•</span>
            <span>Volume: <strong>{batch.harvestQuantityKg} {batch.unit}</strong></span>
          </div>
        </div>

        {/* Live Photo Evidence & Generalised Location */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 border border-stone-200 relative shadow-inner">
              <img
                src={batch.batchPhotoUrl}
                alt={batch.cropName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-emerald-400" />
                <span>LIVE FIELD CAPTURE</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500">
                  Live Sensor Metadata
                </h3>
                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Capture Device:</span>
                    <span className="font-semibold text-emerald-900">Direct Camera Sensor (No gallery upload)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Timestamp:</span>
                    <span className="font-semibold">{new Date(batch.liveCaptureMetadata.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Generalised Village:</span>
                    <span className="font-semibold">{batch.liveCaptureMetadata.approxVillage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Accuracy Radius:</span>
                    <span className="font-semibold">±{batch.liveCaptureMetadata.accuracyMeters}m (Generalised)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 italic">
                  Privacy Protection: Precise farmer GPS latitude/longitude and private revenue patta documents are redacted from public displays.
                </div>
              </div>

              {/* Farmer Profile Link Card */}
              <div
                onClick={() => navigateToFarmer(farmer.id)}
                className="p-4 bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200 rounded-2xl cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={farmer.avatarUrl}
                    alt={farmer.name}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-700"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">{farmer.name}</h4>
                    <p className="text-[11px] text-stone-500">{farmer.approxVillage}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  Profile <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Trust Verification Ladder for this Farmer/Batch */}
          <div className="border-t border-stone-200 pt-6 space-y-3">
            <h3 className="font-bold text-sm text-stone-900 font-serif">
              Verification Evidence Ladder
            </h3>
            <div className="flex flex-wrap gap-2">
              <TrustBadge level={farmer.verificationLevel} size="md" />
              {farmer.certificates?.map((c) => (
                <TrustBadge key={c.id} level={4} specificBadge={c.type} size="md" />
              ))}
              {batch.labReport && (
                <TrustBadge level={5} specificBadge="Residue Report Verified" size="md" />
              )}
            </div>
          </div>

          {/* Pesticide Residue Laboratory Report Section */}
          {batch.labReport && (
            <div className="border-t border-stone-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-bold text-sm text-stone-900 font-serif">
                    Pesticide Residue Laboratory Report (Level 5)
                  </h3>
                </div>
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-full">
                  NABL Accredited
                </span>
              </div>

              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3 text-xs text-stone-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-stone-500 block">Testing Laboratory:</span>
                    <strong className="text-stone-900">{batch.labReport.laboratoryName}</strong>
                    <span className="text-[11px] text-stone-500 block">
                      NABL Reg #{batch.labReport.nablAccreditationNo}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 block">Report Number & Issue Date:</span>
                    <strong className="text-stone-900">{batch.labReport.reportId}</strong>
                    <span className="text-[11px] text-stone-500 block">
                      Issued: {batch.labReport.reportIssueDate} (Sample: {batch.labReport.sampleCollectionDate})
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-xl text-emerald-950 font-medium">
                  <strong>Lab Finding:</strong> {batch.labReport.publicSummary}
                </div>

                <div className="text-[11px] text-stone-500">
                  Scope Limitation: Tested for 84 active organochlorine, organophosphate, and synthetic pyrethroid residues against FSSAI Maximum Residue Limits (MRL). Report applies to Batch #{batch.id}.
                </div>
              </div>
            </div>
          )}

          {/* Order Action Button */}
          {associatedProduct && (
            <div className="border-t border-stone-200 pt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Direct Farm Listing Available:</span>
                <span className="font-bold text-sm text-stone-900 inline-flex items-center">
                  {associatedProduct.title} (<RupeeSymbol size={11} className="mr-0.5" />{associatedProduct.basePricePerUnit}/{associatedProduct.unit})
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(associatedProduct, 2);
                  setCurrentView('cart');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Add 2 {associatedProduct.unit} to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal for this Batch */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={`Batch Traceability: ${batch.cropName}`}
        subtitle={`Batch ID: ${batch.id}`}
        targetPath={`#batch/${batch.id}`}
      />
    </div>
  );
};
