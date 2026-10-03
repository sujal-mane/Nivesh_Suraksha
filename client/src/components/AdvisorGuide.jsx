import React from 'react';
import { 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  PhoneCall, 
  FileCheck, 
  HelpCircle,
  Building,
  ShieldAlert
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function AdvisorGuide({ language = 'en' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const ag = t.advisorGuide;

  const officialSebiIntermediaryUrl = "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {ag.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          {ag.subtitle}
        </p>
      </div>

      {/* Official SEBI Verification Action Card */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border-2 border-emerald-500/50 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 card-contrast">
        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 block">
            Direct Regulatory Source
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Official SEBI Recognized Intermediaries Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Verify the exact spelling of the entity, registered address, valid registration validity dates, and designated contact person directly from SEBI's official database.
          </p>
        </div>

        <a
          href={officialSebiIntermediaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2.5 shrink-0 group"
        >
          <span>{ag.officialPortalBtn}</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Recognized SEBI Registration Number Formats */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl card-contrast">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          <span>{ag.registrationTypesTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs rounded border border-emerald-500/30">
                INA + 9 Digits
              </span>
              <h4 className="font-bold text-white text-sm">SEBI Investment Adviser (RIA)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {ag.riaDesc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 font-mono font-bold text-xs rounded border border-blue-500/30">
                INH + 9 Digits
              </span>
              <h4 className="font-bold text-white text-sm">SEBI Research Analyst (RA)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {ag.raDesc}
            </p>
          </div>

        </div>
      </div>

      {/* Red Flags of Impersonators */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl card-contrast">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>{ag.redFlagsTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {ag.impersonation1}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {ag.impersonation2}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {ag.impersonation3}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {ag.impersonation4}
            </p>
          </div>

        </div>
      </div>

      {/* Official Helplines */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl card-contrast">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-teal-400" />
          <span>{ag.helplineTitle}</span>
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed font-medium">
          {ag.tollFree}
        </p>
      </div>

    </div>
  );
}
