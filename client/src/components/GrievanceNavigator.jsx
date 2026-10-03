import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckSquare, 
  Square,
  AlertCircle, 
  Send,
  PhoneCall,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { SAMPLE_GRIEVANCES } from '../data/sampleGrievances';

export default function GrievanceNavigator({ language = 'en' }) {
  const [problemText, setProblemText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [grievanceData, setGrievanceData] = useState(null);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const gn = t.grievance;

  const handleSubmit = async (overrideText = null) => {
    const textToSubmit = overrideText !== null ? overrideText : problemText;

    if (!textToSubmit || textToSubmit.trim().length === 0) {
      setErrorMsg('Please describe your dispute before proceeding.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    setGrievanceData(null);
    setCheckedDocs({});

    try {
      const response = await fetch('/api/grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemDescription: textToSubmit,
          language
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to resolve grievance (${response.status})`);
      }

      const data = await response.json();
      setGrievanceData(data);
    } catch (err) {
      console.error('Grievance submission error:', err);
      setErrorMsg('Failed to process grievance. Please ensure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectSample = (sample) => {
    setProblemText(sample.text);
    handleSubmit(sample.text);
  };

  const handleToggleDoc = (docIndex) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docIndex]: !prev[docIndex]
    }));
  };

  const handleCopyDraft = () => {
    if (!grievanceData || !grievanceData.complaintDraft) return;
    const fullDraft = `${grievanceData.complaintDraft.subject}\n\n${grievanceData.complaintDraft.letterBody}`;
    navigator.clipboard.writeText(fullDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {gn.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          {gn.subtitle}
        </p>
      </div>

      {/* Input Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl card-contrast">
        
        <textarea
          value={problemText}
          onChange={(e) => setProblemText(e.target.value)}
          placeholder={gn.placeholder}
          rows={4}
          maxLength={2500}
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-y transition"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-500">
            {problemText.length}/2500
          </span>

          <button
            onClick={() => handleSubmit()}
            disabled={isSubmitting || !problemText.trim()}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{gn.submitting}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{gn.submitBtn}</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

      </div>

      {/* 3 Quick Sample Dispute Chips */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            {gn.samplesTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_GRIEVANCES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="p-3.5 text-left bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition group"
            >
              <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition block mb-1">
                {sample.label}
              </span>
              <p className="text-xs text-slate-400 line-clamp-2">
                {sample.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Resolved Grievance Results */}
      {grievanceData && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* 1. Matched Forum Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/50 p-6 shadow-2xl card-contrast">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  {gn.matchedForumTitle}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                  {grievanceData.forum.name}
                </h2>
              </div>

              <a
                href={grievanceData.forum.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 shrink-0 transition"
              >
                <span>{gn.visitPortal}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {gn.resolutionTimeline}: <strong className="text-white">{grievanceData.forum.timelineDays} {gn.days}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  {gn.officialSource}: <strong className="text-white">{grievanceData.forum.source}</strong>
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
              {grievanceData.forum.description}
            </p>
          </div>

          {/* 2. Mandatory Documents Checklist */}
          {grievanceData.requiredDocuments && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl card-contrast">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>{gn.checklistTitle}</span>
              </h3>

              <div className="space-y-2.5">
                {grievanceData.requiredDocuments.map((doc, idx) => {
                  const isChecked = !!checkedDocs[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleDoc(idx)}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer select-none transition ${
                        isChecked 
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500 shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm font-medium">{doc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Escalation Steps */}
          {grievanceData.escalationSteps && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl card-contrast">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>{gn.escalationTitle}</span>
              </h3>

              <div className="space-y-4">
                {grievanceData.escalationSteps.map((step) => (
                  <div key={step.step} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold flex items-center justify-center text-sm shrink-0">
                      {step.step}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{step.title}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                          {step.timeline}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {step.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Ready-to-Copy Complaint Letter Draft */}
          {grievanceData.complaintDraft && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl card-contrast">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <span>{gn.draftLetterTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {gn.draftLetterDesc}
                  </p>
                </div>

                <button
                  onClick={handleCopyDraft}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition shrink-0 ${
                    copiedDraft
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                  aria-label="Copy complaint draft"
                >
                  {copiedDraft ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{gn.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{gn.copyBtn}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Formatted Draft Letter Pre */}
              <div className="p-4 sm:p-5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto selection:bg-emerald-500 selection:text-white">
                {grievanceData.complaintDraft.subject}
                {"\n\n"}
                {grievanceData.complaintDraft.letterBody}
              </div>
            </div>
          )}

          {/* 5. Official Helplines */}
          {grievanceData.helplines && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl card-contrast">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>{gn.helplinesTitle}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {grievanceData.helplines.map((hl, idx) => (
                  <div key={idx} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs">
                    <span className="font-bold text-white block mb-0.5">{hl.name}</span>
                    <span className="font-mono text-emerald-400 font-bold block">{hl.number}</span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">{hl.timing}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
