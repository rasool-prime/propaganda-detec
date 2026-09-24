import { BookOpen, Search, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';
import { TECHNIQUE_DEFINITIONS, TECHNIQUE_LABELS } from '../data/techniques';
import { TechniqueCategory } from '../types/propaganda';

interface SemEvalTechniquesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SemEvalTechniquesModal: React.FC<SemEvalTechniquesModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TechniqueCategory>(TECHNIQUE_LABELS[0]);

  if (!isOpen) return null;

  const filteredLabels = TECHNIQUE_LABELS.filter((lbl) =>
    lbl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    TECHNIQUE_DEFINITIONS[lbl].definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeDef = TECHNIQUE_DEFINITIONS[selectedCategory];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                14 SemEval-2020 Task 11 Technique Categories
              </h3>
              <p className="text-xs text-slate-400">
                Official research definitions, linguistic markers, and annotated exemplars
              </p>
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

        {/* Modal Body: Split view */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left List of 14 Techniques */}
          <div className="w-full md:w-72 border-r border-slate-800 bg-slate-950/40 p-4 flex flex-col shrink-0">
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search techniques..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {filteredLabels.map((lbl, idx) => {
                const isSelected = selectedCategory === lbl;
                return (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setSelectedCategory(lbl)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="truncate">{idx + 1}. {lbl}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Details Panel */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-900/60">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                  Category #{TECHNIQUE_LABELS.indexOf(selectedCategory) + 1}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">SemEval Benchmark: {activeDef.formalNameSemEval}</span>
              </div>
              <h4 className="text-xl font-bold text-slate-100">{activeDef.name}</h4>
            </div>

            {/* Formal Definition */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Research Definition
              </label>
              <p className="text-sm text-slate-200 leading-relaxed">
                {activeDef.definition}
              </p>
            </div>

            {/* Linguistic Markers */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Lexical & Syntactic Markers
              </label>
              <div className="flex flex-wrap gap-1.5">
                {activeDef.linguisticMarkers.map((marker, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-slate-800/70 border border-slate-700/60 text-xs font-mono text-indigo-300"
                  >
                    "{marker}"
                  </span>
                ))}
              </div>
            </div>

            {/* Exemplars from Training Partition */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Annotated Training Partition Examples</span>
              </label>
              <div className="space-y-3">
                {activeDef.examples.map((ex, i) => (
                  <div key={i} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <p className="text-sm text-amber-200 font-serif leading-relaxed">
                      "{ex.quote}"
                    </p>
                    <p className="text-xs text-slate-400">
                      <strong>Rationale:</strong> {ex.rationale}
                    </p>
                    <p className="text-xs text-emerald-400 font-mono">
                      <strong>Evidence:</strong> {ex.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Techniques */}
            {activeDef.relatedTechniques.length > 0 && (
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Frequently Confused / Related Categories
                </label>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  {activeDef.relatedTechniques.map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => {
                        const match = TECHNIQUE_LABELS.find((l) => l.toLowerCase() === rel.toLowerCase());
                        if (match) setSelectedCategory(match);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 underline"
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>Source: SemEval-2020 Task 11 Propaganda Technique Classification Task</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
