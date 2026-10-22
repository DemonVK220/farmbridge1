import React, { useState } from 'react';
import {
  ShieldCheck,
  Phone,
  MapPin,
  CheckCircle2,
  Award,
  FlaskConical,
  Camera,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LiveCaptureCameraModal } from '../components/LiveCaptureCameraModal';

export const VerificationCentrePage: React.FC = () => {
  const { farmers, verifyFarmerBadge, addToast, setCurrentView } = useApp();
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState('+91 98401 •••••');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const selectedFarmer = farmers[0]; // S. Muthuvel

  const handleVerifyPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.length === 4) {
      setOtpVerified(true);
      addToast('success', 'Level 1: Phone ownership verified via secure OTP!');
    } else {
      addToast('error', 'Please enter a valid 4-digit demo OTP (e.g. 1234).');
    }
  };

  const handleLiveCameraCaptureComplete = (imgUrl: string, metadata: any) => {
    verifyFarmerBadge(selectedFarmer.id, 2);
    addToast('success', `Level 2: Live-captured farm photo verified at ${metadata.approxVillage}!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Verification Centre</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
          The 5-Level Farmer Verification Ladder
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">
          Verification on FarmBridge is evidence-based. We never award badges merely for filling out a form or paying a subscription. Every level specifies what was checked, who checked it, and when it occurred.
        </p>
      </div>

      {/* 5-Level Interactive Walkthrough */}
      <div className="space-y-6">
        {/* Level 1: Phone Verified */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Level 1: Phone Verified
                </h3>
                <span className="text-xs text-stone-500">
                  Authentication Badge: <strong>Phone Verified</strong>
                </span>
              </div>
            </div>

            <span className="bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
              Identity Verification
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs text-stone-700">
            <div className="lg:col-span-7 space-y-2">
              <h4 className="font-bold text-stone-900">What is checked:</h4>
              <p className="leading-relaxed">
                Farmer&apos;s active mobile number is verified through a one-time passcode (OTP) with anti-abuse rate limits.
              </p>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-600">
                <strong>Public disclosure note:</strong> Confirms direct phone access only. It does not establish farm ownership, physical cultivation, or product quality.
              </div>
            </div>

            <div className="lg:col-span-5 bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <strong className="block font-bold text-stone-900">Test Level 1 OTP Verification:</strong>
              <form onSubmit={handleVerifyPhone} className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Demo OTP (1234)"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-32 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono text-center font-bold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Verify OTP
                </button>
              </form>
              {otpVerified && (
                <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Phone Verified Timestamp Recorded!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Level 2: Farm Evidence Reviewed */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Level 2: Farm Evidence Reviewed
                </h3>
                <span className="text-xs text-stone-500">
                  Authentication Badge: <strong>Farm Evidence Reviewed</strong>
                </span>
              </div>
            </div>

            <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
              Land Evidence & Live Camera
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs text-stone-700">
            <div className="lg:col-span-7 space-y-2">
              <h4 className="font-bold text-stone-900">Requirements & Evidence:</h4>
              <ul className="list-disc pl-4 space-y-1 leading-relaxed">
                <li>Land record (Patta, Khasra, 7/12 extract) or approved proof of farming rights.</li>
                <li>PM-KISAN registration number where applicable and voluntarily supplied (never mandatory).</li>
                <li>
                  <strong>Live-captured camera photo</strong> with timestamp and GPS accuracy radius. Gallery uploads are disabled for this step to prevent internet stock photo spoofing.
                </li>
              </ul>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <strong>Privacy Policy:</strong> Precise farm coordinates and private land documents are strictly kept internal. Only generalised village/taluk is shown publicly to customers.
              </div>
            </div>

            <div className="lg:col-span-5 bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <strong className="block font-bold text-stone-900">Live Device Camera Flow:</strong>
              <p className="text-[11px] text-stone-500">
                Test the device camera verification modal directly in your browser.
              </p>
              <button
                type="button"
                onClick={() => setCameraModalOpen(true)}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Launch Live Camera Verification</span>
              </button>
            </div>
          </div>
        </div>

        {/* Level 3: Locally Verified */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Level 3: Locally Verified
                </h3>
                <span className="text-xs text-stone-500">
                  Authentication Badge: <strong>Locally Verified</strong>
                </span>
              </div>
            </div>

            <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
              Institutional Endorsement
            </span>
          </div>

          <div className="text-xs text-stone-700 space-y-2">
            <h4 className="font-bold text-stone-900">Confirmation Sources:</h4>
            <p className="leading-relaxed">
              Accepts confirmation from an authorized local Agricultural Extension Officer, registered Farmer Producer Organisation (FPO) director, or Gram Panchayat Sarpanch/Secretary.
              We log the verifier identity, role, date, and field evidence checked.
            </p>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-600">
              <strong>Integrity rule:</strong> We do not imply government endorsement unless an authorized official body has physically certified the farm visit.
            </div>
          </div>
        </div>

        {/* Level 4: Certificate Verified */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Level 4: Certificate Verified
                </h3>
                <span className="text-xs text-stone-500">
                  Authentication Badge: <strong>Certificate Verified: [Certificate Type]</strong>
                </span>
              </div>
            </div>

            <span className="bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
              Organic & Regulatory Certifications
            </span>
          </div>

          <div className="text-xs text-stone-700 space-y-2">
            <h4 className="font-bold text-stone-900">Supported Authoritative Standards:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <strong className="block text-stone-900">Jaivik Bharat</strong>
                <span className="text-[11px] text-stone-500">FSSAI organic logo certification</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <strong className="block text-stone-900">PGS-India Organic</strong>
                <span className="text-[11px] text-stone-500">Participatory Guarantee System</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <strong className="block text-stone-900">NPOP Certification</strong>
                <span className="text-[11px] text-stone-500">National Organic Programme</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <strong className="block text-stone-900">FSSAI Food License</strong>
                <span className="text-[11px] text-stone-500">Primary produce packing licence</span>
              </div>
            </div>
            <p className="text-stone-500 text-[11px] pt-1">
              Badges are automatically suspended if a certificate passes its recorded expiration date without renewal.
            </p>
          </div>
        </div>

        {/* Level 5: Residue Report Verified */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-emerald-100 flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Level 5: Pesticide-Residue Laboratory Report
                </h3>
                <span className="text-xs text-stone-500">
                  Authentication Badge: <strong>Residue Report Verified (Batch Specific)</strong>
                </span>
              </div>
            </div>

            <span className="bg-emerald-900 text-white text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
              NABL Laboratory Tested
            </span>
          </div>

          <div className="text-xs text-stone-700 space-y-2">
            <h4 className="font-bold text-stone-900">Batch-Linked Testing:</h4>
            <p className="leading-relaxed">
              Laboratory test reports from NABL-accredited facilities are validated for specific harvest batches.
              We record the laboratory accreditation number, test parameters (e.g. 84 organochlorine & organophosphate chemical markers), and compliant results.
            </p>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-600">
              <strong>Transparent Scope:</strong> A passing report is linked to its specific harvest batch. It is not advertised as a perpetual claim for all future seasons.
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Assisted Onboarding Path */}
      <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
            Inclusive Digital Access
          </span>
          <h3 className="text-xl font-bold font-serif">
            Farmers Without Smartphones?
          </h3>
          <p className="text-xs text-stone-300 max-w-xl">
            We offer in-person verification appointments through our proposed network of Village Common Service Centres (CSC) and local Farmer Producer Organisations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('assisted_onboarding')}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
        >
          View CSC Assisted Flow
        </button>
      </div>

      {/* Live Camera Modal */}
      <LiveCaptureCameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCaptureComplete={handleLiveCameraCaptureComplete}
        title="Level 2 Farm Proof: Live Camera Capture"
        cropOrFarmContext="Pennagaram Farm Evidence Capture"
      />
    </div>
  );
};
