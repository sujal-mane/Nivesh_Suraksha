import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Sparkles, 
  ShieldX, 
  ArrowRight,
  Info,
  ShieldCheck
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { speakText, stopSpeaking } from '../utils/speech';
import MicroLesson from './MicroLesson';

export default function AnalysisResult({ result, language = 'en' }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!result) return null;

  // Handle Guardrail Refusal
  if (result.guardrailTriggered) {
    return (
      <div className="mt-8 rounded-2xl bg-amber-950/40 border-2 border-amber-500/60 p-6 text-slate-100 shadow-xl card-contrast">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-amber-300">
              {result.title || t.results.guardrailTitle}
            </h3>
            <p className="text-sm leading-relaxed text-slate-200">
              {result.explanation || t.results.guardrailDesc}
            </p>
            {result.guidance && (
              <div className="p-3 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-slate-300 mt-2">
                {result.guidance}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Verdict visual styles
  const getVerdictTheme = () => {
    switch (result.verdict) {
      case 'Likely scam':
        return {
          bg: 'bg-red-950/40 border-red-500/60 text-red-400',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
          gaugeColor: 'bg-red-500',
          icon: <ShieldAlert className="w-9 h-9 text-red-400" />
        };
      case 'Suspicious':
        return {
          bg: 'bg-amber-950/40 border-amber-500/60 text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          gaugeColor: 'bg-amber-500',
          icon: <AlertTriangle className="w-9 h-9 text-amber-400" />
        };
      case "I'm not sure":
        return {
          bg: 'bg-blue-950/40 border-blue-500/60 text-blue-400',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          gaugeColor: 'bg-blue-500',
          icon: <HelpCircle className="w-9 h-9 text-blue-400" />
        };
      case 'No clear red flags found':
      default:
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/60 text-emerald-400',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          gaugeColor: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-9 h-9 text-emerald-400" />
        };
    }
  };

  const theme = getVerdictTheme();

  // TTS speech text formulation
  const handleToggleSpeech = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = `${result.verdict}. ${result.plainExplanation || ''}. ${
        result.flags?.length ? `Detected ${result.flags.length} warning signs.` : ''
      }`;
      speakText(textToSpeak, language, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  return (
    <div className="mt-8 space-y-6 animate-fadeIn">
      
      {/* 1. Main Verdict Banner */}
      <div className={`rounded-2xl border-2 p-6 shadow-2xl relative overflow-hidden card-contrast ${theme.bg}`}>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-700/60 shrink-0">
              {theme.icon}
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider opacity-75 block">
                {t.results.verdictTitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                {result.verdict}
              </h2>
            </div>
          </div>

          {/* Audio Playback Button */}
          <button
            onClick={handleToggleSpeech}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm font-semibold transition-all ${
              isPlayingAudio
                ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
            aria-label="Listen to verdict audio"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-black" />
                <span>{t.results.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>{t.results.listenAudio}</span>
              </>
            )}
          </button>
        </div>

        {/* Confidence Gauge & Plain Explanation */}
        <div className="mt-5 space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
              <span>{t.results.confidence}</span>
              <span className="text-white font-bold">{result.confidence}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${theme.gaugeColor}`} 
                style={{ width: `${Math.max(10, result.confidence)}%` }}
              />
            </div>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-medium">
            {result.plainExplanation}
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Always exercise caution. No automated model guarantees 100% certainty.
            </span>
          </div>
        </div>

      </div>

      {/* 2. Detected Red Flags (Tagged with [Rule Engine] and [AI Nuance]) */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl card-contrast">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>
              {result.flags && result.flags.length > 0 
                ? `${t.results.redFlagsFound} (${result.flags.length})` 
                : t.results.noFlagsFound}
            </span>
          </h3>
        </div>

        {result.flags && result.flags.length > 0 ? (
          <div className="space-y-3.5">
            {result.flags.map((flag, idx) => {
              const isRule = flag.source === 'rule';
              return (
                <div 
                  key={flag.id || idx}
                  className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition"
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span className="font-semibold text-white text-sm sm:text-base">
                      {flag.title}
                    </span>
                    
                    {/* Attribution Tag */}
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 border shrink-0 ${
                      isRule 
                        ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' 
                        : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    }`}>
                      {isRule ? (
                        <>
                          <Cpu className="w-3 h-3 text-blue-400" />
                          <span>{t.results.ruleEngineBadge}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>{t.results.aiNuanceBadge}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {flag.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <p>
              No typical fraudulent patterns matched. Always verify the advisor on sebi.gov.in before committing any funds.
            </p>
          </div>
        )}
      </div>

      {/* 3. Action Steps Checklist */}
      {result.actionSteps && result.actionSteps.length > 0 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl card-contrast">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-emerald-400" />
            <span>{t.results.nextStepsTitle}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {result.actionSteps.map((step, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Micro-Lesson: Why this tricked people */}
      {result.microLesson && (
        <MicroLesson lesson={result.microLesson} language={language} />
      )}

    </div>
  );
}
