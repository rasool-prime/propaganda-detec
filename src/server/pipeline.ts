import { TECHNIQUE_LABELS } from '../data/techniques';
import {
  ClassifiedSpan,
  DocumentMetadata,
  PromptingStrategy,
  PropagandaAnalysisResult,
  SentenceAnalysis,
  TechniqueCategory,
  TechniqueMetric,
} from '../types/propaganda';
import { classifySpansBatch } from './classifier';
import { GEMINI_MODEL, getGeminiClient } from './gemini';
import { preprocessDocument } from './preprocessor';
import { detectCandidateSpans } from './spanDetector';

export interface AnalysisOptions {
  text: string;
  documentName?: string;
  fileType?: 'text' | 'pdf' | 'docx';
  promptingStrategy?: PromptingStrategy;
}

export async function runPropagandaAnalysisPipeline(
  options: AnalysisOptions
): Promise<PropagandaAnalysisResult> {
  const startTime = Date.now();
  const rawText = options.text;
  const docName = options.documentName || 'Direct Input Text';
  const fileType = options.fileType || 'text';
  const strategy = options.promptingStrategy || 'structured';

  if (!rawText || rawText.trim().length === 0) {
    throw new Error('Input text is empty. Please provide text or an uncorrupted document with readable text.');
  }

  // Preprocessing
  const preprocessed = preprocessDocument(rawText);

  // Stage 1: Span Detection
  const candidateSpans = detectCandidateSpans(preprocessed);

  // Map context sentences
  const sentenceContextMap = new Map<number, string>();
  for (const s of preprocessed.sentences) {
    sentenceContextMap.set(s.index, s.text);
  }

  // Stage 2: Technique Classification
  const classifiedSpans: ClassifiedSpan[] = await classifySpansBatch(
    candidateSpans,
    strategy,
    sentenceContextMap
  );

  // Filter to positive propaganda spans
  const positiveSpans = classifiedSpans.filter((s) => s.isPropaganda);

  // Group spans by sentence
  const spansBySentence = new Map<number, ClassifiedSpan[]>();
  for (const span of positiveSpans) {
    const list = spansBySentence.get(span.sentenceIndex) || [];
    list.push(span);
    spansBySentence.set(span.sentenceIndex, list);
  }

  // Build sentence-level analysis
  const sentencesAnalysis: SentenceAnalysis[] = preprocessed.sentences.map((sent) => {
    const sentSpans = spansBySentence.get(sent.index) || [];
    let sentenceLikelihood = 0.05; // baseline neutral

    if (sentSpans.length > 0) {
      // Calculate likelihood based on max confidence + density of spans
      const maxConf = Math.max(...sentSpans.map((s) => s.confidence));
      const spanCharCoverage = sentSpans.reduce((acc, s) => acc + (s.endIndex - s.startIndex), 0);
      const coverageRatio = Math.min(1.0, spanCharCoverage / Math.max(1, sent.text.length));

      sentenceLikelihood = Number(
        Math.min(0.98, maxConf * 0.75 + coverageRatio * 0.25).toFixed(2)
      );
    }

    return {
      index: sent.index,
      text: sent.text,
      startIndex: sent.startIndex,
      endIndex: sent.endIndex,
      paragraphIndex: sent.paragraphIndex,
      propagandaLikelihood: sentenceLikelihood,
      spansCount: sentSpans.length,
      spans: sentSpans,
    };
  });

  // Calculate propaganda sentences
  const propagandaSentencesCount = sentencesAnalysis.filter((s) => s.spansCount > 0).length;
  const sentenceRatio =
    preprocessed.sentences.length > 0
      ? Number((propagandaSentencesCount / preprocessed.sentences.length).toFixed(2))
      : 0;

  // Aggregate technique metrics
  const techniqueMap = new Map<TechniqueCategory, { count: number; totalConfidence: number }>();
  for (const label of TECHNIQUE_LABELS) {
    techniqueMap.set(label, { count: 0, totalConfidence: 0 });
  }

  for (const span of positiveSpans) {
    const curr = techniqueMap.get(span.technique) || { count: 0, totalConfidence: 0 };
    curr.count += 1;
    curr.totalConfidence += span.confidence;
    techniqueMap.set(span.technique, curr);
  }

  const techniquesMetrics: TechniqueMetric[] = [];
  let highestCount = 0;
  let predominant: TechniqueCategory | 'None' = 'None';

  for (const [name, stats] of techniqueMap.entries()) {
    if (stats.count > 0) {
      const avgConf = Number((stats.totalConfidence / stats.count).toFixed(2));
      const pct = Number(((stats.count / Math.max(1, positiveSpans.length)) * 100).toFixed(1));
      techniquesMetrics.push({
        name,
        count: stats.count,
        averageConfidence: avgConf,
        percentage: pct,
      });

      if (stats.count > highestCount) {
        highestCount = stats.count;
        predominant = name;
      }
    }
  }

  // Sort techniques by count descending
  techniquesMetrics.sort((a, b) => b.count - a.count);

  // Calculate Overall Estimated Propaganda Likelihood (Separated from confidence!)
  let overallLikelihood = 0.05;
  if (preprocessed.sentences.length > 0) {
    if (positiveSpans.length === 0) {
      overallLikelihood = 0.08;
    } else {
      const sentencePropagandaRatio = propagandaSentencesCount / preprocessed.sentences.length;
      const averageTechniqueConfidence =
        positiveSpans.reduce((acc, s) => acc + s.confidence, 0) / positiveSpans.length;

      // Weighted formula: 60% sentence ratio impact + 40% technique confidence intensity
      const rawLikelihood = sentencePropagandaRatio * 0.6 + averageTechniqueConfidence * 0.4;
      overallLikelihood = Number(Math.min(0.96, Math.max(0.12, rawLikelihood)).toFixed(2));
    }
  }

  const documentMetadata: DocumentMetadata = {
    name: docName,
    fileType,
    wordCount: preprocessed.wordCount,
    characterCount: preprocessed.characterCount,
    sentenceCount: preprocessed.sentences.length,
    paragraphCount: preprocessed.paragraphs.length,
    propagandaSentenceCount: propagandaSentencesCount,
    propagandaSentenceRatio: sentenceRatio,
  };

  const hasApiKey = Boolean(getGeminiClient());

  return {
    document: documentMetadata,
    overall: {
      propagandaLikelihood: overallLikelihood,
      totalSpansDetected: positiveSpans.length,
      predominantTechnique: predominant,
    },
    techniques: techniquesMetrics,
    sentences: sentencesAnalysis,
    spans: positiveSpans,
    rawText: preprocessed.normalizedText,
    metadata: {
      promptingStrategy: strategy,
      model: hasApiKey ? GEMINI_MODEL : 'Heuristic Baseline (API Key not set)',
      processingTimeMs: Date.now() - startTime,
      stage1SpanDetector: 'Rhetorical Lexical Pattern Matcher (SemEval-2020 Cues)',
      stage2TechniqueClassifier: hasApiKey
        ? `Gemini 3.8 Flash (${strategy} prompt)`
        : 'Heuristic Rule-Based Classifier',
    },
  };
}
