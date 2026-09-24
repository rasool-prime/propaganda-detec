/**
 * Core type definitions for SemEval-2020 Task 11 Fine-Grained Propaganda Detection
 * Based on: "AI-Powered Propaganda Detection"
 */

export type PromptingStrategy = 'structured' | 'zero-shot' | 'few-shot';

export type TechniqueCategory =
  | 'Loaded Language'
  | 'Name Calling or Labeling'
  | 'Repetition'
  | 'Doubt'
  | 'Exaggeration or Minimisation'
  | 'Appeal to Fear / Prejudices'
  | 'Flag-Waving'
  | 'Causal Oversimplification'
  | 'Slogans'
  | 'Appeal to Authority'
  | 'Black-and-White Fallacy'
  | 'Thought-terminating Cliche'
  | 'Whataboutism'
  | 'Bandwagon';

export interface TechniqueDefinition {
  id: string;
  name: TechniqueCategory;
  formalNameSemEval: string;
  definition: string;
  linguisticMarkers: string[];
  examples: Array<{
    quote: string;
    rationale: string;
    evidence: string;
  }>;
  relatedTechniques: string[];
}

export interface CandidateSpan {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  sentenceIndex: number;
  paragraphIndex: number;
  preliminaryScore?: number;
}

export interface ClassifiedSpan {
  id: string;
  text: string;
  technique: TechniqueCategory;
  confidence: number; // 0.0 - 1.0 (Model confidence in technique classification)
  explanation: string; // User-facing explanation
  evidence: string; // Succinct excerpt / lexical cue
  startIndex: number;
  endIndex: number;
  sentenceIndex: number;
  paragraphIndex: number;
  isPropaganda: boolean;
}

export interface SentenceAnalysis {
  index: number;
  text: string;
  startIndex: number;
  endIndex: number;
  paragraphIndex: number;
  propagandaLikelihood: number; // 0.0 - 1.0 (Estimated likelihood that this sentence contains propaganda)
  spansCount: number;
  spans: ClassifiedSpan[];
}

export interface DocumentMetadata {
  name: string;
  fileType: 'text' | 'pdf' | 'docx';
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  paragraphCount: number;
  propagandaSentenceCount: number;
  propagandaSentenceRatio: number;
}

export interface TechniqueMetric {
  name: TechniqueCategory;
  count: number;
  averageConfidence: number;
  percentage: number;
}

export interface PropagandaAnalysisResult {
  document: DocumentMetadata;
  overall: {
    propagandaLikelihood: number; // 0.0 - 1.0 overall document estimated likelihood
    totalSpansDetected: number;
    predominantTechnique: TechniqueCategory | 'None';
  };
  techniques: TechniqueMetric[];
  sentences: SentenceAnalysis[];
  spans: ClassifiedSpan[];
  rawText: string;
  metadata: {
    promptingStrategy: PromptingStrategy;
    model: string;
    processingTimeMs: number;
    stage1SpanDetector: string;
    stage2TechniqueClassifier: string;
  };
}

export interface BaselineBenchmark {
  method: string;
  accuracy: number | null;
  macroF1: number | null;
  weightedF1: number | null;
  status: 'published_baseline' | 'evaluation_pending';
  notes: string;
}
