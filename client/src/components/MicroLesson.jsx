import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, BrainCircuit, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function MicroLesson({ lesson, language = 'en' }) {
  if (!lesson) return null;

  const [expanded, setExpanded] = useState(true);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 p-5 shadow-lg relative overflow-hidden card-contrast">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t.results.microLessonTitle}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {lesson.title}
            </h3>
          </div>
        </div>

        <button className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Body */}
      {expanded && (
        <div className="mt-4 pt-3 border-t border-indigo-900/50 space-y-3.5 text-sm text-slate-300">
          <p className="leading-relaxed text-slate-300">
            {lesson.content}
          </p>

          {lesson.takeaway && (
            <div className="p-3.5 rounded-xl bg-indigo-900/40 border border-indigo-400/30 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-amber-300 block uppercase tracking-wider">
                  {t.results.goldenRule}
                </span>
                <p className="text-sm font-medium text-white mt-0.5">
                  "{lesson.takeaway}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
