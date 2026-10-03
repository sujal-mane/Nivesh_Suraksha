import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  HelpCircle, 
  Scale, 
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Heart
} from 'lucide-react';
import Navbar from './components/Navbar';
import ScamChecker from './components/ScamChecker';
import AdvisorGuide from './components/AdvisorGuide';
import GrievanceNavigator from './components/GrievanceNavigator';
import PrivacyNotice from './components/PrivacyNotice';
import { TRANSLATIONS } from './data/translations';

export default function App() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('scam');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div 
      className={`min-h-screen flex flex-col transition-colors ${
        highContrast ? 'high-contrast bg-black text-white' : 'bg-slate-950 text-slate-100'
      }`}
      style={{ fontSize: `${fontSizeMultiplier * 100}%` }}
    >
      {/* Top Navbar */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        fontSizeMultiplier={fontSizeMultiplier}
        setFontSizeMultiplier={setFontSizeMultiplier}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Main Tab Switcher */}
      <div className="border-b border-slate-800 bg-slate-900/60 sticky top-[61px] z-30 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center justify-around sm:justify-start sm:gap-6 overflow-x-auto py-2.5">
            
            <button
              onClick={() => setActiveTab('scam')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${
                activeTab === 'scam'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{t.tabs.scamCheck}</span>
            </button>

            <button
              onClick={() => setActiveTab('advisor')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${
                activeTab === 'advisor'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              <span>{t.tabs.advisorGuide}</span>
            </button>

            <button
              onClick={() => setActiveTab('grievance')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${
                activeTab === 'grievance'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Scale className="w-4 h-4 text-teal-400" />
              <span>{t.tabs.grievance}</span>
            </button>

          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'scam' && <ScamChecker language={language} />}
        {activeTab === 'advisor' && <AdvisorGuide language={language} />}
        {activeTab === 'grievance' && <GrievanceNavigator language={language} />}
      </main>

      {/* Privacy Policy & Regulatory Guardrail Modal */}
      <PrivacyNotice
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-white text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Nivesh Suraksha (निवेश सुरक्षा)</span>
            </div>
            <p className="mt-1 text-slate-500">
              Built for SANGYAN Hackathon • Organized by IIT BHU with SEBI & NSDL.
            </p>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-4 text-slate-400">
            <a 
              href="https://scores.sebi.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              SEBI SCORES 2.0
            </a>
            <span>•</span>
            <a 
              href="https://nsdl.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              NSDL Grievance
            </a>
            <span>•</span>
            <a 
              href="https://cybercrime.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              Cybercrime Portal (1930)
            </a>
            <span>•</span>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="text-emerald-400 hover:underline"
            >
              Privacy & Ethics
            </button>
          </div>

        </div>
      </footer>
    </div>
  );
}
