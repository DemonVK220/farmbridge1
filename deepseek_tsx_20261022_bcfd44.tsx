import React from 'react';
import { Type, Contrast, Eye, Languages, Keyboard, ZoomIn, CheckCircle2, Save, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export const AccessibilitySettingsPage: React.FC = () => {
  const { accessibilityPrefs, updateAccessibilityPrefs, addToast } = useApp();
  const { language, setLanguage } = useLanguage();

  const fontSizes = [
    { id: 'normal' as const, label: 'Normal', sample: 'text-sm' },
    { id: 'large' as const, label: 'Large', sample: 'text-base' },
    { id: 'xlarge' as const, label: 'Extra Large', sample: 'text-lg' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
          <Eye className="w-3.5 h-3.5 text-emerald-700" /><span>Inclusive Design</span>
        </div>
        <h1 className="text-3xl font-extrabold font-serif text-stone-900">Accessibility & Display</h1>
        <p className="text-xs text-stone-600 mt-2 max-w-2xl leading-relaxed">Adjust display and interaction settings to suit your needs.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2"><Type className="w-5 h-5 text-emerald-700" /><h2 className="text-base font-bold font-serif text-stone-900">Text Size</h2></div>
        <p className="text-xs text-stone-600">Choose a preferred base reading size.</p>
        <div className="grid grid-cols-3 gap-2">
          {fontSizes.map((f) => (
            <button key={f.id} onClick={() => updateAccessibilityPrefs({ fontSize: f.id })}
              className={`p-3 rounded-2xl border transition-colors cursor-pointer ${accessibilityPrefs.fontSize === f.id ? 'border-emerald-700 bg-emerald-50 ring-2 ring-emerald-600/20' : 'border-stone-200 bg-stone-50 hover:bg-white'}`}>
              <span className={`block font-bold ${f.sample} ${accessibilityPrefs.fontSize === f.id ? 'text-emerald-950' : 'text-stone-800'}`}>Aa</span>
              <span className="block text-xs text-stone-600 mt-1">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2"><Contrast className="w-5 h-5 text-emerald-700" /><h2 className="text-base font-bold font-serif text-stone-900">High Contrast Mode</h2></div>
        <label className="flex items-start gap-3 p-3 rounded-2xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
          <input type="checkbox" checked={accessibilityPrefs.highContrast} onChange={(e) => updateAccessibilityPrefs({ highContrast: e.target.checked })} className="mt-0.5 accent-emerald-800" />
          <div><span className="font-bold text-stone-900 text-xs block">Increase text and border contrast</span><span className="text-[11px] text-stone-500">Useful for low-vision users.</span></div>
        </label>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2"><ZoomIn className="w-5 h-5 text-emerald-700" /><h2 className="text-base font-bold font-serif text-stone-900">Reduced Motion</h2></div>
        <label className="flex items-start gap-3 p-3 rounded-2xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
          <input type="checkbox" checked={accessibilityPrefs.reducedMotion} onChange={(e) => updateAccessibilityPrefs({ reducedMotion: e.target.checked })} className="mt-0.5 accent-emerald-800" />
          <div><span className="font-bold text-stone-900 text-xs block">Minimize animations and transitions</span><span className="text-[11px] text-stone-500">Recommended for users with vestibular disorders.</span></div>
        </label>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2"><Languages className="w-5 h-5 text-emerald-700" /><h2 className="text-base font-bold font-serif text-stone-900">Interface Language</h2></div>
        <div className="grid grid-cols-3 gap-2">
          {(['en', 'ta', 'hi'] as const).map((lang) => (
            <button key={lang} onClick={() => setLanguage(lang)}
              className={`p-3 rounded-2xl border transition-colors cursor-pointer text-center ${language === lang ? 'border-emerald-700 bg-emerald-50' : 'border-stone-200 bg-stone-50 hover:bg-white'}`}>
              <span className={`block font-bold ${language === lang ? 'text-emerald-950' : 'text-stone-800'}`}>{lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ்' : 'हिन्दी'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 border border-stone-800 space-y-3">
        <h2 className="text-base font-bold font-serif text-white flex items-center gap-2"><Keyboard className="w-4 h-4 text-emerald-400" />Keyboard & Screen Reader Support</h2>
        <ul className="text-xs text-stone-300 space-y-1.5 leading-relaxed">
          <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /><span>All interactive elements are reachable via Tab with visible focus outlines.</span></li>
          <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /><span>Forms use explicit label associations for screen readers.</span></li>
          <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /><span>Images use descriptive alt text. Decorative elements use aria-hidden.</span></li>
        </ul>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={() => { updateAccessibilityPrefs({ fontSize: 'normal', highContrast: false, reducedMotion: false }); addToast('info', 'Reset to defaults.'); }} className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /><span>Reset to Defaults</span>
        </button>
        <button onClick={() => addToast('success', 'Preferences saved.')} className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors">
          <Save className="w-3.5 h-3.5" /><span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};