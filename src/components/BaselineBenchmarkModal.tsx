import { AlertTriangle, Database, Info, X } from 'lucide-react';
import React from 'react';
import { BENCHMARK_RESULTS, CLASSICAL_BASELINE_CONFIG, SEMEVAL_DATASET_SUMMARY } from '../data/baseline';

interface BaselineBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BaselineBenchmarkModal: React.FC<BaselineBenchmarkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Research Methodology & Evaluation Benchmark
              </h3>
              <p className="text-xs text-slate-400">
                SemEval-2020 Task 11 Dataset, TF-IDF + Linear SVM Baseline, and LLM Comparison
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Table I: Dataset Summary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Table I: SemEval-2020 Task 11 Dataset Summary
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Article-Level Split</span>
            </div>
            <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-2.5 px-4">Item</th>
                    <th className="py-2.5 px-4">Value</th>
                    <th className="py-2.5 px-4">Research Partitioning Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono">
                  <tr>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">Total labelled training articles</td>
                    <td className="py-2.5 px-4 text-indigo-400">{SEMEVAL_DATASET_SUMMARY.totalArticles}</td>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">Official SemEval release</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">Total annotated spans</td>
                    <td className="py-2.5 px-4 text-indigo-400">{SEMEVAL_DATASET_SUMMARY.totalAnnotatedSpans}</td>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">Ground-truth propaganda fragments</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">Training Partition (Internal Split)</td>
                    <td className="py-2.5 px-4">{SEMEVAL_DATASET_SUMMARY.trainArticles} articles ({SEMEVAL_DATASET_SUMMARY.trainSpans} spans)</td>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">StratifiedGroupKFold (80%)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">Evaluation Partition (Held-out)</td>
                    <td className="py-2.5 px-4">{SEMEVAL_DATASET_SUMMARY.evalArticles} articles ({SEMEVAL_DATASET_SUMMARY.evalSpans} spans)</td>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">Strictly held-out zero-leakage (20%)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">Technique categories</td>
                    <td className="py-2.5 px-4 text-indigo-400">{SEMEVAL_DATASET_SUMMARY.techniqueCategories}</td>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">Centralized SemEval taxonomy</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                <strong>Data Leakage Prevention:</strong> Spans are partitioned strictly at the ARTICLE level so that no spans from the same article appear in both training and evaluation sets.
              </span>
            </p>
          </div>

          {/* Table II: TF-IDF + Linear SVM Baseline Configuration */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Table II: Classical Baseline Configuration (TF-IDF + Linear SVM)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-sans block mb-1">Feature n-gram</span>
                <span className="text-slate-200">{CLASSICAL_BASELINE_CONFIG.ngramRange}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-sans block mb-1">TF Scaling</span>
                <span className="text-slate-200">{CLASSICAL_BASELINE_CONFIG.tfScaling}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-sans block mb-1">Max Features</span>
                <span className="text-slate-200">{CLASSICAL_BASELINE_CONFIG.maxFeatures.toLocaleString()}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-sans block mb-1">Classifier</span>
                <span className="text-slate-200">Linear SVM (C=1.0)</span>
              </div>
            </div>
          </div>

          {/* Table IV: Experimental Results */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Table IV: Experimental Benchmark Results (1,226 Held-out Spans)
              </h4>
              <span className="text-[11px] text-amber-400 font-mono">Section V / Table IV</span>
            </div>
            <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-2.5 px-4">Method</th>
                    <th className="py-2.5 px-4">Accuracy</th>
                    <th className="py-2.5 px-4">Macro F1</th>
                    <th className="py-2.5 px-4">Weighted F1</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                  {BENCHMARK_RESULTS.map((row, idx) => (
                    <tr key={idx} className={row.status === 'published_baseline' ? 'bg-indigo-950/20' : ''}>
                      <td className="py-2.5 px-4 font-sans font-medium text-slate-100">
                        {row.method}
                      </td>
                      <td className="py-2.5 px-4">
                        {row.accuracy !== null ? `${row.accuracy}%` : <span className="text-slate-500">—</span>}
                      </td>
                      <td className="py-2.5 px-4">
                        {row.macroF1 !== null ? `${row.macroF1}%` : <span className="text-slate-500">—</span>}
                      </td>
                      <td className="py-2.5 px-4">
                        {row.weightedF1 !== null ? `${row.weightedF1}%` : <span className="text-slate-500">—</span>}
                      </td>
                      <td className="py-2.5 px-4 font-sans">
                        {row.status === 'published_baseline' ? (
                          <span className="text-emerald-400 text-[11px] font-medium">Published Baseline</span>
                        ) : (
                          <span className="text-amber-400 text-[11px] font-medium">Evaluation pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2.5 p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                As noted in Section V of the paper, LLM columns are left blank ("Evaluation pending") to be completed upon culmination of live held-out evaluations. This platform adheres strictly to reproducible research integrity and does not fabricate evaluation metrics.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};
