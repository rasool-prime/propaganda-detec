import { BaselineBenchmark } from '../types/propaganda';

export interface DatasetSummaryInfo {
  totalArticles: number;
  totalAnnotatedSpans: number;
  unlabelledDevArticles: number;
  techniqueCategories: number;
  trainArticles: number;
  trainSpans: number;
  evalArticles: number;
  evalSpans: number;
  splitMethod: string;
}

export const SEMEVAL_DATASET_SUMMARY: DatasetSummaryInfo = {
  totalArticles: 371,
  totalAnnotatedSpans: 6129,
  unlabelledDevArticles: 75,
  techniqueCategories: 14,
  trainArticles: 286,
  trainSpans: 4903,
  evalArticles: 71,
  evalSpans: 1226,
  splitMethod:
    'StratifiedGroupKFold (5 folds, random_state=42) grouped strictly by Article ID to prevent span leakage across train/eval partitions',
};

export const CLASSICAL_BASELINE_CONFIG = {
  model: 'TF-IDF + Linear SVM',
  ngramRange: 'Unigrams + bigrams (1, 2)',
  tfScaling: 'Sublinear',
  maxFeatures: 15000,
  classifier: 'Linear Support Vector Classifier (LinearSVC)',
  regularizationC: 1.0,
  classWeight: 'Balanced',
};

export const BENCHMARK_RESULTS: BaselineBenchmark[] = [
  {
    method: 'TF-IDF + Linear SVM',
    accuracy: 47.06,
    macroF1: 33.89,
    weightedF1: 46.92,
    status: 'published_baseline',
    notes: 'Reference classical baseline reported in Section III-C / Table IV of the research paper.',
  },
  {
    method: 'Gemini Zero-Shot',
    accuracy: null,
    macroF1: null,
    weightedF1: null,
    status: 'evaluation_pending',
    notes: 'Zero-shot prompt with 14 static technique definitions; live benchmark evaluation pending as per paper Table IV.',
  },
  {
    method: 'Gemini Few-Shot',
    accuracy: null,
    macroF1: null,
    weightedF1: null,
    status: 'evaluation_pending',
    notes: 'Few-shot prompt with representative training-partition exemplars; live benchmark evaluation pending as per paper Table IV.',
  },
  {
    method: 'Gemini Structured',
    accuracy: null,
    macroF1: null,
    weightedF1: null,
    status: 'evaluation_pending',
    notes: 'Structured JSON schema enforcing technique selection, confidence calibration, evidence extraction, and rationale; live benchmark evaluation pending as per paper Table IV.',
  },
];
