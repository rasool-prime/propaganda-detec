import { BarChart3 } from 'lucide-react';
import React from 'react';
import { TechniqueCategory, TechniqueMetric } from '../types/propaganda';

interface TechniqueDistributionChartProps {
  techniques: TechniqueMetric[];
  selectedTechnique: TechniqueCategory | null;
  onSelectTechnique: (technique: TechniqueCategory | null) => void;
}

export const TechniqueDistributionChart: React.FC<TechniqueDistributionChartProps> = ({
  techniques,
  selectedTechnique,
  onSelectTechnique,
}) => {
  const maxCount = techniques.length > 0 ? Math.max(...techniques.map((t) => t.count)) : 1;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Technique Distribution
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {techniques.length} unique {techniques.length === 1 ? 'technique' : 'techniques'}
          </span>
        </div>

        {techniques.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No rhetorical propaganda techniques were detected in this document.
          </div>
        ) : (
          <div className="space-y-3.5">
            {techniques.map((tech) => {
              const widthPct = Math.max(8, (tech.count / maxCount) * 100);
              const isSelected = selectedTechnique === tech.name;

              return (
                <div
                  key={tech.name}
                  onClick={() => onSelectTechnique(isSelected ? null : tech.name)}
                  className={`group p-2 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/60 border border-indigo-500/40 shadow-sm'
                      : 'hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span
                      className={`font-medium transition-colors ${
                        isSelected ? 'text-indigo-300' : 'text-slate-300 group-hover:text-slate-100'
                      }`}
                    >
                      {tech.name}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                      <span>{tech.count} {tech.count === 1 ? 'span' : 'spans'}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>{tech.percentage}%</span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-950/80 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-400'
                          : 'bg-gradient-to-r from-indigo-500/80 to-slate-400/80 group-hover:from-indigo-500 group-hover:to-violet-400'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {techniques.length > 0 && (
        <div className="pt-4 border-t border-slate-800/60 mt-4 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Click any technique to filter spans in the text view</span>
          {selectedTechnique && (
            <button
              type="button"
              onClick={() => onSelectTechnique(null)}
              className="text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};
