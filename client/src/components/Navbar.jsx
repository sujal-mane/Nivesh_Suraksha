import React from 'react';
import { Shield, Eye, Type, Lock, Languages, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Navbar({
  language,
  setLanguage,
  highContrast,
  setHighContrast,
  fontSizeMultiplier,
  setFontSizeMultiplier,
  onOpenPrivacy
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleFontToggle = () => {
    // Cycles through 1.0 -> 1.15 -> 1.3 -> 1.0
    if (fontSizeMultiplier >= 1.25) {
      setFontSizeMultiplier(1.0);
    } else {
      setFontSizeMultiplier(prev => +(prev + 0.15).toFixed(2));
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Hackathon Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                {t.appTitle}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  SANGYAN MVP
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>IIT BHU with SEBI & NSDL</span>
            </p>
          </div>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center flex-wrap gap-2 text-sm">
          
          {/* Language Selector */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <Languages className="w-4 h-4 text-slate-400 ml-2 mr-1" />
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'mr', label: 'मराठी' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === lang.code
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-label={`Switch to ${lang.label}`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-2 rounded-lg border flex items-center gap-1.5 text-xs font-medium transition-colors ${
              highContrast
                ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle High Contrast for low-vision readability"
            aria-label="Toggle High Contrast"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{t.controls.highContrast}</span>
          </button>

          {/* Font Scaling Toggle */}
          <button
            onClick={handleFontToggle}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg flex items-center gap-1 text-xs font-medium transition-colors"
            title="Adjust Font Size for easier reading"
            aria-label="Adjust font size"
          >
            <Type className="w-4 h-4" />
            <span>Aa {fontSizeMultiplier > 1.0 ? `+${Math.round((fontSizeMultiplier - 1) * 100)}%` : ''}</span>
          </button>

          {/* Privacy Policy / Guardrails Modal */}
          <button
            onClick={onOpenPrivacy}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors"
            title="Privacy and Guardrail Principles"
            aria-label="Privacy and Guardrails"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">{t.controls.privacyPolicy}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
