import { BookOpen, CheckCircle, ExternalLink, HelpCircle, Sparkles, Tag, X } from 'lucide-react';
import React from 'react';
import { TECHNIQUE_DEFINITIONS } from '../data/techniques';
import { ClassifiedSpan } from '../types/propaganda';

interface SpanDetailModalProps {
  span: ClassifiedSpan | null;
  onClose: () => void;
  onOpenTechniquesModal: () => void;
}

export const SpanDetailModal: React.FC<SpanDetailModalProps> = ({
  span,
  onClose,
  onOpenTechniquesModal,
}) => {
  if (!span) return null;

  const definition = TECHNIQUE_DEFINITIONS[span.technique];
  const confPct = Math.round(span.confidence * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">
                Propaganda Span Inspector
              </span>
              <h3 className="text-base font-semibold text-slate-100">
                {span.technique}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-sm">
          {/* Detected Target Span Quote */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Extracted Target Span
            </label>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30 text-amber-200 font-serif text-base leading-relaxed">
              "{span.text}"
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1.5 px-1">
              <span>Offsets: [{span.startIndex} → {span.endIndex}]</span>
              <span>Sentence #{span.sentenceIndex + 1} · Paragraph #{span.paragraphIndex + 1}</span>
            </div>
          </div>

          {/* Technique & Model Confidence */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-500 block mb-1">Technique Category</span>
              <span className="text-sm font-semibold text-indigo-300">{span.technique}</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-500 block mb-1">Technique Confidence</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold font-mono text-emerald-400">{confPct}%</span>
                <span className="text-[10px] text-slate-400">classification certainty</span>
              </div>
            </div>
          </div>

          {/* User-Facing Explanation */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explanation & Rhetorical Rationale</span>
            </label>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-slate-300 leading-relaxed text-xs sm:text-sm">
              {span.explanation}
            </div>
          </div>

          {/* Supporting Evidence */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supporting Lexical Evidence</span>
            </label>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-emerald-300 font-mono text-xs">
              "{span.evidence}"
            </div>
          </div>

          {/* SemEval-2020 Formal Definition */}
          {definition && (
            <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  SemEval-2020 Definition
                </span>
                <button
                  type="button"
                  onClick={onOpenTechniquesModal}
                  className="text-[11px] text-indigo-400 hover:text-indigo-200 underline flex items-center gap-1"
                >
                  <span>View all 14 techniques</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {definition.definition}
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                <strong>Common Markers:</strong> {definition.linguisticMarkers.slice(0, 5).join(', ')}
              </div>
            </div>
          )}

          {/* Academic note */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>
              Explanations provide human-readable user rationales rather than representing internal model weights or hidden representations.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
