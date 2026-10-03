import React from 'react';
import { X, ShieldCheck, Database, Ban, FileKey2, Check } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function PrivacyNotice({ isOpen, onClose, language = 'en' }) {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const pm = t.privacyModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto card-contrast">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">{pm.title}</h2>
            <p className="text-xs text-slate-400">SANGYAN Hackathon • SEBI Regulatory Ethics & Zero-Persistence</p>
          </div>
        </div>

        {/* Guarantees List */}
        <div className="space-y-4 text-sm">
          
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
            <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-200">{pm.principle1Title}</h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">{pm.principle1Desc}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
            <Ban className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-200">{pm.principle2Title}</h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">{pm.principle2Desc}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-200">{pm.principle3Title}</h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">{pm.principle3Desc}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
            <FileKey2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-200">{pm.principle4Title}</h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">{pm.principle4Desc}</p>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {pm.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
}
