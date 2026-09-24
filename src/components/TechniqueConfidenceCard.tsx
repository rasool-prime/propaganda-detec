import { Check, HelpCircle, Target } from 'lucide-react';
import React from 'react';
import { TechniqueMetric } from '../types/propaganda';

interface TechniqueConfidenceCardProps {
  techniques: TechniqueMetric[];
}

export const TechniqueConfidenceCard: React.FC<TechniqueConfidenceCardProps> = ({ techniques }) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-5">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Technique Confidence
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Model Certainty (0–100%)
          </span>
        </div>

        {techniques.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No techniques detected to calculate confidence.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {techniques.map((tech) => {
              const confPct = Math.round(tech.averageConfidence * 100);

              let confTierColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
              if (confPct < 75) {
                confTierColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
              }
              if (confPct < 60) {
                confTierColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
              }

              return (
                <div
                  key={tech.name}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-200 line-clamp-1">
                      {tech.name}
                    </span>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold border shrink-0 ${confTierColor}`}
                    >
                      {confPct}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full"
                      style={{ width: `${confPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{tech.count} occurrences</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Check className="w-3 h-3 text-emerald-400" />
                      SemEval Validated
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-start gap-2 text-[11px] text-slate-500">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Confidence vs Likelihood:</strong> Technique confidence measures how definitively a candidate span matches a specific category definition. In contrast, Overall Likelihood reflects document-wide rhetorical saturation.
        </span>
      </div>
    </div>
  );
};
