import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  RotateCcw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LegalAndFaqPage: React.FC<{ initialSection?: 'privacy' | 'terms' | 'refunds' | 'faq' }> = ({
  initialSection = 'privacy',
}) => {
  const [section, setSection] = useState<'privacy' | 'terms' | 'refunds' | 'faq'>(initialSection);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why are FarmBridge platform marketplace fees ₹0?',
      a: 'FarmBridge India operates as a social-impact initiative to remove artificial middleman markups that hurt both smallholder farmers and urban households. Basic marketplace access, farmer registration, 5-level verification, and batch QR code passports are completely free.',
    },
    {
      q: 'Does a 5-Level Residue Report mean the produce is 100% chemical-free forever?',
      a: 'No. We strictly forbid misleading "100% eternal" marketing claims. A Level 5 badge means the specific harvest batch was tested by an accredited NABL laboratory and met FSSAI Maximum Residue Limits (MRL) for the 84 tested pesticide parameters. The report is linked only to its specific harvest batch.',
    },
    {
      q: 'Why are mandi prices different from the direct price on FarmBridge?',
      a: 'APMC mandi wholesale rates are for bulk, unsorted, raw field tractor-trolley arrivals subject to commission agents, market cess, and high transport moisture loss. FarmBridge prices reflect farm-graded, cleaned, packed, and direct-to-home produce where 100% of the produce value reaches the farmer directly.',
    },
    {
      q: 'How does FarmBridge protect farmer land and location privacy?',
      a: 'We never publicly expose a farmer’s precise GPS coordinates, revenue patta documents, or survey numbers. Only a generalised village, taluk, and district are displayed to customers while the verified evidence is held in encrypted audit storage.',
    },
    {
      q: 'What is the refund process if produce arrives damaged or wilted?',
      a: 'Customers can submit a problem report with a photo within 24 hours of delivery. Because payouts are settled after OTP verification, our dispute desk quickly investigates and refunds transit damage without penalizing farmers unfairly.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-2 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setSection('privacy')}
          className={`py-3 px-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            section === 'privacy'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => setSection('terms')}
          className={`py-3 px-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            section === 'terms'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Terms & Conditions
        </button>
        <button
          type="button"
          onClick={() => setSection('refunds')}
          className={`py-3 px-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            section === 'refunds'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Refund & Dispute Policy
        </button>
        <button
          type="button"
          onClick={() => setSection('faq')}
          className={`py-3 px-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            section === 'faq'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Frequently Asked Questions
        </button>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 text-xs text-stone-700 leading-relaxed">
        {section === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-stone-900">
              Privacy and Data Protection Policy
            </h2>
            <p>
              FarmBridge India is designed with privacy by design in compliance with applicable Indian digital personal data protection principles.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">1. Location Data & Generalisation</h3>
            <p>
              Location access is requested exclusively for verifying farm harvest origins and calculating delivery distance. We strictly never expose precise farm GPS coordinates or customer residential unit numbers publicly. Public passport views display generalised village, block, and district names only.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">2. Secure Document Storage</h3>
            <p>
              Revenue land extracts (Patta, Khasra, 7/12) and personal identity credentials uploaded during Level 2 verification are accessible exclusively to authorized verification officers. They are encrypted and never indexed on search engines or publicly exposed.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">3. Group Order Confidentiality</h3>
            <p>
              When participating in neighbourhood group buying hubs, your individual mobile number, home address, and payment method are never disclosed to other group members.
            </p>
          </div>
        )}

        {section === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-stone-900">
              Marketplace Terms and Conditions
            </h2>
            <p>
              By accessing FarmBridge India, users agree to the fair trade standards and truth-in-advertising rules set forth below.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">1. Zero Platform Fees</h3>
            <p>
              Standard marketplace listing, farmer verification, and batch traceability are provided at ₹0 platform fee. Any delivery charges displayed are calculated directly from third-party logistics partners and disclosed upfront before order confirmation.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">2. Prohibition on False Claims & Reselling</h3>
            <p>
              Farmers and FPOs agree that all listed produce originates from verified cultivated lands or registered group members. Listings flagged by the Yield Sanity Check must cooperate with documentation review. Misrepresentation results in strike warnings or badge removal after fair administrative appeal.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">3. No Paywalled Safety</h3>
            <p>
              Premium plans (Farmer Plus and Business Buyer Plus) offer analytics and bulk procurement tools only. Verification badges cannot be purchased or accelerated by paying fees.
            </p>
          </div>
        )}

        {section === 'refunds' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-stone-900">
              Refund, Cancellation, and Dispute Policy
            </h2>

            <h3 className="text-sm font-bold text-stone-900 pt-2">1. Freshness & Transit Guarantee</h3>
            <p>
              If fresh agricultural produce arrives severely damaged, wilted, or with missing weight, customers can file an issue report with a photo within 24 hours of handover.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">2. Fair Resolution Process</h3>
            <p>
              To protect farmers from fraudulent refund claims while safeguarding buyers, our dispute desk reviews the delivery partner handover log and batch photo before authorizing refunds.
            </p>

            <h3 className="text-sm font-bold text-stone-900 pt-2">3. Cancellation Window</h3>
            <p>
              Orders may be cancelled free of charge prior to farm harvest packing. Once produce has been crated and picked up by the logistics partner, cancellation is subject to logistics handling fees.
            </p>
          </div>
        )}

        {section === 'faq' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-stone-900">
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-stone-200 rounded-2xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 font-bold text-stone-900 flex items-center justify-between hover:bg-stone-50 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-stone-600 bg-stone-50/50 border-t border-stone-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
