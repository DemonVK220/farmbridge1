import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Printer,
  ShieldCheck,
  FileText,
  Phone,
  MapPin,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AssistedOnboardingPage: React.FC = () => {
  const { addToast } = useApp();

  const [operatorId, setOperatorId] = useState('CSC-TN-DHM-4102');
  const [operatorName, setOperatorName] = useState('K. Senthil (Village Level Entrepreneur, VLE)');
  const [cscCentre, setCscCentre] = useState('Pennagaram CSC Digital Village Hub');

  // Farmer registration state
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Dharmapuri');
  const [state, setState] = useState('Tamil Nadu');
  const [landAcres, setLandAcres] = useState(2.5);
  const [cropsGrown, setCropsGrown] = useState('Tomatoes, Ragi, Moringa');
  const [farmerConsent, setFarmerConsent] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerConsent) {
      alert('Farmer informed verbal and signed consent is strictly required before submission.');
      return;
    }

    const record = {
      id: `CSC-REG-${Date.now().toString().slice(-5)}`,
      operatorId,
      operatorName,
      farmerName,
      farmerPhone,
      village,
      district,
      state,
      landAcres,
      cropsGrown,
      timestamp: new Date().toISOString(),
    };

    setSubmittedRecord(record);
    addToast(
      'success',
      `Assisted registration completed for ${farmerName}! Verification receipt generated.`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Assisted Onboarding</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>Proposed Assisted Onboarding Network</span>
            </div>
            <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
              Common Service Centre (CSC) Assisted Flow
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Ensuring digital inclusion for rural farmers without smartphones. Authorised local Village Level Entrepreneurs assist with profile creation, document scanning, and SMS order alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Operator Identification Bar */}
      <div className="bg-stone-900 text-white p-5 rounded-3xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-emerald-400 font-bold block uppercase tracking-wider text-[10px]">
            Authenticated CSC VLE Operator Session
          </span>
          <strong className="text-sm text-white">{operatorName}</strong>
          <span className="text-stone-400 block text-[11px]">
            Centre: {cscCentre} • ID #{operatorId}
          </span>
        </div>

        <div className="p-2.5 bg-stone-800 rounded-xl text-stone-300 text-[11px]">
          All assisted actions are recorded in immutable audit logs. Operators do not hold farmer passwords.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Registration Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-stone-900 font-serif">
            Farmer Assisted Profile Intake Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Farmer Full Name (as per Aadhaar / Bank):
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Lal Meena"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Farmer Mobile (SMS Alerts & OTP):
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 94140 12345"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Village / Gram:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramgarh"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">District:</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">State:</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Cultivated Land Area (Acres):
                </label>
                <input
                  type="number"
                  step={0.1}
                  required
                  value={landAcres}
                  onChange={(e) => setLandAcres(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Principal Crops Cultivated:
                </label>
                <input
                  type="text"
                  required
                  value={cropsGrown}
                  onChange={(e) => setCropsGrown(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>
            </div>

            {/* Informed Consent Checkbox */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={farmerConsent}
                  onChange={(e) => setFarmerConsent(e.target.checked)}
                  className="mt-0.5 accent-emerald-800"
                />
                <span className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                  <strong>Farmer Informed Consent:</strong> The farmer is physically present at this CSC centre, has been briefed on the marketplace terms, and consents to receiving SMS order updates and having their harvest batches listed with zero platform fees.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Submit Assisted Onboarding & Generate Physical Slip
            </button>
          </form>
        </div>

        {/* Right: Printable Physical Acknowledgment Slip */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                Physical Acknowledgment Slip
              </h3>
              {submittedRecord && (
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              )}
            </div>

            {submittedRecord ? (
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-300 font-mono text-xs space-y-2 text-stone-800">
                <div className="text-center pb-2 border-b border-stone-200">
                  <strong className="block text-sm">FARMBRIDGE INDIA</strong>
                  <span className="text-[10px] text-stone-500">
                    ASSISTED ONBOARDING RECEIPT
                  </span>
                  <div className="text-[11px] font-bold text-emerald-900 mt-1">
                    Receipt #{submittedRecord.id}
                  </div>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div>Farmer: {submittedRecord.farmerName}</div>
                  <div>Phone: {submittedRecord.farmerPhone}</div>
                  <div>Village: {submittedRecord.village}, {submittedRecord.district}</div>
                  <div>Land: {submittedRecord.landAcres} Acres</div>
                  <div>Crops: {submittedRecord.cropsGrown}</div>
                  <div>Operator: {submittedRecord.operatorName}</div>
                  <div>Time: {new Date(submittedRecord.timestamp).toLocaleString()}</div>
                </div>

                <div className="pt-2 border-t border-stone-200 text-[10px] text-stone-500 text-center">
                  Notice: Keep this slip for your records. Order summaries will arrive via SMS text.
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 p-8 rounded-2xl border border-dashed border-stone-300 text-center text-xs text-stone-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-stone-300" />
                <p>Fill in the assisted profile intake form on the left to generate a printable confirmation slip for the farmer.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
