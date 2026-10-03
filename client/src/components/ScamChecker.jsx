import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { SAMPLE_SCAMS } from '../data/sampleScams';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speech';
import { checkClientPii } from '../utils/piiDetector';
import AnalysisResult from './AnalysisResult';

export default function ScamChecker({ language = 'en' }) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [piiWarning, setPiiWarning] = useState(null);
  
  const speechRecognizerRef = useRef(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const sc = t.scamChecker;

  // Real-time client-side PII detector
  useEffect(() => {
    const piiCheck = checkClientPii(inputText);
    if (piiCheck.hasPii) {
      setPiiWarning(piiCheck.detected);
    } else {
      setPiiWarning(null);
    }
  }, [inputText]);

  // Voice Input Toggle
  const toggleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) {
      alert(sc.voiceNotSupported);
      return;
    }

    if (isRecording) {
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setErrorMsg('');
      const recognizer = createSpeechRecognizer(
        language,
        (transcript) => {
          setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        },
        (error) => {
          console.warn('Speech error:', error);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );

      if (recognizer) {
        speechRecognizerRef.current = recognizer;
        try {
          recognizer.start();
          setIsRecording(true);
        } catch (err) {
          console.error('Failed to start speech recognition', err);
          setIsRecording(false);
        }
      }
    }
  };

  // Submit Analysis
  const handleAnalyze = async (overrideText = null) => {
    const textToAnalyze = overrideText !== null ? overrideText : inputText;

    if (!textToAnalyze || textToAnalyze.trim().length === 0) {
      setErrorMsg(sc.emptyWarning);
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          language
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed with status ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMsg('Failed to complete analysis. Please ensure the backend server is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Quick Sample Selector
  const handleSelectSample = (sample) => {
    setInputText(sample.text);
    handleAnalyze(sample.text);
  };

  const handleClear = () => {
    setInputText('');
    setAnalysisResult(null);
    setErrorMsg('');
    setPiiWarning(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Header section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {sc.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          {sc.subtitle}
        </p>
      </div>

      {/* Input Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl card-contrast">
        
        {/* PII Alert Banner */}
        {piiWarning && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-start gap-3 text-xs sm:text-sm animate-fadeIn">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">{sc.piiWarningTitle}</span>
              <p className="mt-0.5 text-amber-200/90 leading-relaxed">
                Detected: {piiWarning.join(', ')}. {sc.piiWarningDesc}
              </p>
            </div>
          </div>
        )}

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={sc.placeholder}
            rows={5}
            maxLength={2500}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-y transition"
          />

          {/* Voice recording pulse overlay */}
          {isRecording && (
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500/20 border border-red-500/50 px-3 py-1.5 rounded-full text-xs font-semibold text-red-300 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>{sc.voiceInputListening}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          
          {/* Voice & Clear Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoiceInput}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 border transition ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-500 text-white border-red-500 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Speak your message using microphone"
              aria-label="Voice input toggle"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{isRecording ? sc.voiceInputStop : sc.voiceInputStart}</span>
            </button>

            {inputText && (
              <button
                onClick={handleClear}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-sm font-medium border border-slate-700 transition flex items-center gap-1.5"
                title="Clear input"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">{sc.clearBtn}</span>
              </button>
            )}
          </div>

          {/* Character counter & Analyze button */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              {inputText.length}/2500
            </span>

            <button
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing || !inputText.trim()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{sc.analyzing}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{sc.analyzeBtn}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

      </div>

      {/* 10 Quick Seed Sample Scams (Demo Section) */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            {sc.sampleSectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SAMPLE_SCAMS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="p-3 text-left bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                    {sample.label}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    sample.id === 'scam-10' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {sample.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {sample.preview}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Result Output */}
      {analysisResult && (
        <AnalysisResult result={analysisResult} language={language} />
      )}

    </div>
  );
}
