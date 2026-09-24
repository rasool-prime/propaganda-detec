import { ChevronRight, Layers } from 'lucide-react';
import React, { useState } from 'react';
import { ClassifiedSpan, SentenceAnalysis } from '../types/propaganda';

interface SentenceLevelAnalysisProps {
  sentences: SentenceAnalysis[];
  onSelectSpan: (span: ClassifiedSpan) => void;
}

export const SentenceLevelAnalysis: React.FC<SentenceLevelAnalysisProps> = ({
  sentences,
  onSelectSpan,
}) => {
  const [expandedSentenceIndex, setExpandedSentenceIndex] = useState<number | null>(null);

  const getLikelihoodColor = (likelihood: number) => {
    const pct = Math.round(likelihood * 100);
    if (pct >= 70) return { bg: 'bg-rose-500/15', border: 'border-rose-500/30', text: 'text-rose-400', bar: 'bg-rose-500' };
    if (pct >= 40) return { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', bar: 'bg-amber-500' };
    return { bg: 'bg-slate-800/40', border: 'border-slate-800', text: 'text-slate-400', bar: 'bg-slate-600' };
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/60 gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Sentence-Level Propaganda Analysis
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Pinpointing where manipulative rhetorical phrasing occurs across the document
        </p>
      </div>

      {/* Heatmap Micro-Distribution Strip */}
      <div className="mb-5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
          <span>Document Flow (Sentence 1 to {sentences.length})</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-slate-600" /> &lt;40% Neutral</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-500" /> 40-70% Moderate</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-rose-500" /> &gt;70% Intensive</span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 md:grid-cols-18 lg:grid-cols-24 gap-1.5">
          {sentences.map((sent) => {
            const styles = getLikelihoodColor(sent.propagandaLikelihood);
            const isExpanded = expandedSentenceIndex === sent.index;
            return (
              <button
                key={sent.index}
                type="button"
                onClick={() => setExpandedSentenceIndex(isExpanded ? null : sent.index)}
                className={`h-8 rounded-lg flex flex-col items-center justify-center text-[10px] font-mono transition-all border ${
                  styles.bg
                } ${styles.border} ${styles.text} ${
                  isExpanded ? 'ring-2 ring-indigo-400 scale-105 z-10' : 'hover:scale-105'
                }`}
                title={`Sentence ${sent.index + 1}: ${Math.round(sent.propagandaLikelihood * 100)}% likelihood (${sent.spansCount} spans)`}
              >
                <span>S{sent.index + 1}</span>
                <span className="text-[8px] opacity-75">{Math.round(sent.propagandaLikelihood * 100)}%</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sentence List Breakdown */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {sentences.map((sent) => {
          const styles = getLikelihoodColor(sent.propagandaLikelihood);
          const isExpanded = expandedSentenceIndex === sent.index;
          const likelihoodPct = Math.round(sent.propagandaLikelihood * 100);

          return (
            <div
              key={sent.index}
              className={`rounded-xl border transition-all ${
                isExpanded ? 'bg-slate-950/90 border-indigo-500/40 shadow-md' : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              <div
                onClick={() => setExpandedSentenceIndex(isExpanded ? null : sent.index)}
                className="p-3.5 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-slate-500 shrink-0 w-8">
                    #{sent.index + 1}
                  </span>
                  <p className="text-xs text-slate-300 truncate">
                    {sent.text}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                    <div
                      className={`h-full ${styles.bar} rounded-full`}
                      style={{ width: `${likelihoodPct}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md border ${styles.bg} ${styles.border} ${styles.text}`}>
                    {likelihoodPct}%
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isExpanded ? 'rotate-90 text-indigo-400' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded sentence view */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 space-y-3 animate-fadeIn">
                  <div>
                    <p className="text-xs font-medium text-slate-400 mb-1">Full Sentence Text:</p>
                    <p className="text-sm text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800 leading-relaxed font-serif">
                      "{sent.text}"
                    </p>
                  </div>

                  {sent.spans.length > 0 ? (
                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-1.5">
                        Identified Rhetorical Spans ({sent.spans.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {sent.spans.map((span) => (
                          <button
                            key={span.id}
                            type="button"
                            onClick={() => onSelectSpan(span)}
                            className="text-left text-xs bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/40 rounded-lg px-3 py-1.5 text-indigo-200 transition-colors"
                          >
                            <span className="font-semibold text-white">"{span.text}"</span>
                            <span className="text-[11px] text-indigo-400 block mt-0.5">
                              {span.technique} · Confidence: {Math.round(span.confidence * 100)}%
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      No distinct propaganda technique was detected in this sentence segment.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
