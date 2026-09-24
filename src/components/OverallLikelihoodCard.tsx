import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import React from 'react';
import { PropagandaAnalysisResult } from '../types/propaganda';

interface OverallLikelihoodCardProps {
  analysis: PropagandaAnalysisResult;
}

export const OverallLikelihoodCard: React.FC<OverallLikelihoodCardProps> = ({ analysis }) => {
  const likelihoodPct = Math.round(analysis.overall.propagandaLikelihood * 100);
  const nonPropagandaPct = 100 - likelihoodPct;

  // Determine qualitative tier
  let tierLabel = 'Low Rhetorical Manipulation';
  let tierColor = 'text-emerald-400';
  let gaugeColor = '#10b981'; // emerald-500
  let badgeBorder = 'border-emerald-500/30 bg-emerald-500/10';

  if (likelihoodPct >= 65) {
    tierLabel = 'High Rhetorical Manipulation';
    tierColor = 'text-rose-400';
    gaugeColor = '#f43f5e'; // rose-500
    badgeBorder = 'border-rose-500/30 bg-rose-500/10';
  } else if (likelihoodPct >= 35) {
    tierLabel = 'Moderate Rhetorical Framing';
    tierColor = 'text-amber-400';
    gaugeColor = '#f59e0b'; // amber-500
    badgeBorder = 'border-amber-500/30 bg-amber-500/10';
  }

  // SVG Gauge calculations
  const strokeWidth = 10;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (likelihoodPct / 100) * circumference;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Estimated Propaganda Likelihood
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregate document-level rhetorical persuasion density
            </p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${badgeBorder} ${tierColor}`}>
            {tierLabel}
          </span>
        </div>

        {/* Gauge + Metrics row */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-6">
          {/* Circular Donut Gauge */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
              {/* Background circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-slate-800/90"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Value circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={gaugeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold tracking-tight text-slate-100">
                {likelihoodPct}%
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                Likelihood
              </span>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="flex-1 w-full space-y-3.5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Rhetorical Propaganda Framing</span>
                </span>
                <span className="font-mono text-slate-200">{likelihoodPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800/90 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-700"
                  style={{ width: `${likelihoodPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Neutral / Non-Propagandistic Context</span>
                </span>
                <span className="font-mono text-slate-400">{nonPropagandaPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800/90 overflow-hidden">
                <div
                  className="h-full bg-emerald-500/80 rounded-full transition-all duration-700"
                  style={{ width: `${nonPropagandaPct}%` }}
                />
              </div>
            </div>

            {/* Quick summary stats */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/60">
                <p className="text-slate-500">Predominant Technique</p>
                <p className="text-slate-200 font-medium truncate mt-0.5">
                  {analysis.overall.predominantTechnique}
                </p>
              </div>
              <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/60">
                <p className="text-slate-500">Spans Detected</p>
                <p className="text-slate-200 font-medium mt-0.5">
                  {analysis.overall.totalSpansDetected} fragments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Research disclaimer */}
      <div className="pt-3 border-t border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500/80 shrink-0 mt-0.5" />
        <span>
          <strong>Research Note:</strong> Estimated likelihood denotes the statistical density of rhetorical techniques defined in SemEval-2020 Task 11. It does not determine the factual truthfulness, political legitimacy, or moral intent of the author.
        </span>
      </div>
    </div>
  );
};
