import React, { useState } from 'react';
import { ShieldCheck, Phone, MapPin, Award, CheckCircle2, FlaskConical, Info, X } from 'lucide-react';
import { VerificationBadgeType } from '../types';

interface TrustBadgeProps {
  level: 1 | 2 | 3 | 4 | 5;
  specificBadge?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetailsOnClick?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  level,
  specificBadge,
  size = 'md',
  showDetailsOnClick = true,
}) => {
  const [showModal, setShowModal] = useState(false);

  const getBadgeConfig = () => {
    switch (level) {
      case 5:
        return {
          label: 'Level 5: Residue Report Verified',
          shortLabel: 'L5: Residue Lab Tested',
          bg: 'bg-emerald-900 text-emerald-100 border-emerald-700',
          pillBg: 'bg-emerald-800/80 text-emerald-100',
          icon: FlaskConical,
          description:
            'NABL-accredited laboratory test report confirms zero chemical residues above maximum residue limits (MRL) for this specific harvest batch.',
          evidenceChecked:
            'NABL certificate number, sample collection date, tested pesticide organochlorine & organophosphate parameters, and compliant laboratory sign-off.',
          scopeNotice:
            'Note: Report applies to the tested harvest batch and verified crop; not an eternal claim for future plantings.',
        };
      case 4:
        return {
          label: specificBadge ? `Level 4: ${specificBadge}` : 'Level 4: Certificate Verified',
          shortLabel: specificBadge || 'L4: Certified Organic',
          bg: 'bg-teal-900 text-teal-100 border-teal-700',
          pillBg: 'bg-teal-800/80 text-teal-100',
          icon: Award,
          description:
            'Third-party organic or safety certification (e.g. Jaivik Bharat, PGS-India, NPOP, or FSSAI) verified against authoritative national registries.',
          evidenceChecked:
            'Registration number cross-checked with issuing body (APEDA / PGS Council / FSSAI), validity date, and authorized scope.',
          scopeNotice:
            'Note: Only verified certificates are displayed; unverified claims are held in review.',
        };
      case 3:
        return {
          label: 'Level 3: Locally Verified',
          shortLabel: 'L3: Locally Verified',
          bg: 'bg-amber-900 text-amber-100 border-amber-700',
          pillBg: 'bg-amber-800/80 text-amber-100',
          icon: CheckCircle2,
          description:
            'Physical farming activity verified on-ground by an authorized local agricultural extension officer, Gram Panchayat representative, or registered FPO director.',
          evidenceChecked:
            'In-person field visit, crop season confirmation, village representative verification statement, and audit log.',
          scopeNotice:
            'Note: Confirms physical cultivation in the local farming block; does not replace laboratory chemical tests.',
        };
      case 2:
        return {
          label: 'Level 2: Farm Evidence Reviewed',
          shortLabel: 'L2: Farm Evidence Reviewed',
          bg: 'bg-stone-800 text-stone-200 border-stone-600',
          pillBg: 'bg-stone-700 text-stone-200',
          icon: MapPin,
          description:
            'Official land records (Patta/Khasra/7-12) or accepted farming evidence reviewed along with direct live-capture geo-tagged camera evidence.',
          evidenceChecked:
            'Land revenue documentation, live-device camera photo without gallery uploads, and generalised village coordinates.',
          scopeNotice:
            'Note: Confirms land cultivation rights; customer views generalised village to protect farmer privacy.',
        };
      case 1:
      default:
        return {
          label: 'Level 1: Phone Verified',
          shortLabel: 'L1: Phone Verified',
          bg: 'bg-stone-700 text-stone-300 border-stone-600',
          pillBg: 'bg-stone-600 text-stone-300',
          icon: Phone,
          description:
            'Farmer identity and primary mobile number authenticated using time-limited SMS one-time passcode (OTP).',
          evidenceChecked: 'Mobile phone ownership and OTP verification timestamp.',
          scopeNotice:
            'Note: Confirms access to phone number only; does not establish farm ownership or chemical testing.',
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm md:text-base px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          if (showDetailsOnClick) {
            e.stopPropagation();
            setShowModal(true);
          }
        }}
        className={`inline-flex items-center font-medium rounded-full border shadow-xs transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 cursor-pointer ${
          config.bg
        } ${sizeClasses[size]}`}
        title="Click to view full verification evidence"
      >
        <IconComponent className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
        <span>{size === 'sm' ? config.shortLabel : config.label}</span>
        {showDetailsOnClick && <Info className="w-3 h-3 opacity-70 shrink-0 ml-0.5" />}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-stone-900 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl ${config.bg} text-white`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800">
                  FarmBridge 5-Level Trust Ladder
                </span>
                <h3 className="text-lg font-bold text-stone-900">{config.label}</h3>
              </div>
            </div>

            <div className="space-y-4 text-sm text-stone-700">
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  What was checked?
                </h4>
                <p className="leading-relaxed">{config.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-stone-900 mb-1">Evidence on Record:</h4>
                <p className="text-stone-600 leading-relaxed">{config.evidenceChecked}</p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                {config.scopeNotice}
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <span>Verified under FarmBridge Evidence Framework</span>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-medium transition-colors"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
