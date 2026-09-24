import { BookOpen, Database, Sparkles } from 'lucide-react';
import React from 'react';
import { PromptingStrategy } from '../types/propaganda';

interface HeaderProps {
  strategy: PromptingStrategy;
  onStrategyChange: (strategy: PromptingStrategy) => void;
  onOpenTechniquesModal: () => void;
  onOpenBaselineModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  strategy,
  onStrategyChange,
  onOpenTechniquesModal,
  onOpenBaselineModal,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Research Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-slate-100">
                  Propaganda Analyzer
                </h1>
                <span className="text-xs text-slate-500 font-mono tracking-wide">
                  · SemEval-2020 Task 11
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Fine-Grained Rhetorical Technique Detection & Classification
              </p>
            </div>
          </div>

          {/* Research Strategy & Navigation Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Prompting Strategy Segmented Control */}
            <div className="flex items-center bg-slate-900/80 border border-slate-800/90 rounded-lg p-1 text-xs">
              <span className="px-2 text-slate-500 font-medium hidden sm:inline">Strategy:</span>
              <button
                type="button"
                onClick={() => onStrategyChange('structured')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  strategy === 'structured'
                    ? 'bg-indigo-600/90 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Structured machine-readable JSON prompting (Paper default)"
              >
                Structured JSON
              </button>
              <button
                type="button"
                onClick={() => onStrategyChange('few-shot')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  strategy === 'few-shot'
                    ? 'bg-indigo-600/90 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Few-shot demonstrations from held-out training partition"
              >
                Few-Shot
              </button>
              <button
                type="button"
                onClick={() => onStrategyChange('zero-shot')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  strategy === 'zero-shot'
                    ? 'bg-indigo-600/90 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Zero-shot prompt with static definitions"
              >
                Zero-Shot
              </button>
            </div>

            {/* Research Modals Triggers */}
            <button
              type="button"
              onClick={onOpenTechniquesModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-xs font-medium text-slate-300 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>14 Techniques</span>
            </button>

            <button
              type="button"
              onClick={onOpenBaselineModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-xs font-medium text-slate-300 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-violet-400" />
              <span>Baseline Benchmark</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
