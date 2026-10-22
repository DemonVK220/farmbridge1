import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, ExternalLink, X, Copy, Check } from 'lucide-react';

interface QRCodeModalProps {
  title: string;
  subtitle: string;
  targetPath: string; // e.g. '#batch/batch-tom-01'
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  title,
  subtitle,
  targetPath,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const fullUrl = `${window.location.origin}${window.location.pathname}${targetPath}`;

  useEffect(() => {
    if (isOpen && targetPath) {
      QRCode.toDataURL(fullUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#064e3b', // Deep forest green
          light: '#ffffff',
        },
      })
        .then((url) => setDataUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [isOpen, targetPath, fullUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-stone-900 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
          aria-label="Close QR Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-stone-900 mb-1">{title}</h3>
        <p className="text-xs text-stone-500 mb-4">{subtitle}</p>

        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 inline-block mb-4 shadow-inner">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="Scan QR for Batch Traceability"
              className="w-56 h-56 mx-auto rounded-lg"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-xs text-stone-400">
              Generating secure QR...
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[11px] text-stone-500">
            Scan with any smartphone camera or click below to open the real application route.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
            </button>

            {onNavigate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate();
                }}
                className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open View</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
