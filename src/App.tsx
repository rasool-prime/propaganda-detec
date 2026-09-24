import { AlertCircle, CheckCircle, FileText, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { BaselineBenchmarkModal } from './components/BaselineBenchmarkModal';
import { DocumentHighlightedView } from './components/DocumentHighlightedView';
import { DocumentStatsCard } from './components/DocumentStatsCard';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { OverallLikelihoodCard } from './components/OverallLikelihoodCard';
import { SemEvalTechniquesModal } from './components/SemEvalTechniquesModal';
import { SentenceLevelAnalysis } from './components/SentenceLevelAnalysis';
import { SpanDetailModal } from './components/SpanDetailModal';
import { TechniqueConfidenceCard } from './components/TechniqueConfidenceCard';
import { TechniqueDistributionChart } from './components/TechniqueDistributionChart';
import {
  ClassifiedSpan,
  PromptingStrategy,
  PropagandaAnalysisResult,
  TechniqueCategory,
} from './types/propaganda';

export default function App() {
  const [strategy, setStrategy] = useState<PromptingStrategy>('structured');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<PropagandaAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter & modal states
  const [selectedSpan, setSelectedSpan] = useState<ClassifiedSpan | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<TechniqueCategory | null>(null);
  const [isTechniquesModalOpen, setIsTechniquesModalOpen] = useState<boolean>(false);
  const [isBaselineModalOpen, setIsBaselineModalOpen] = useState<boolean>(false);

  const handleAnalyzeText = async (text: string, title?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSelectedSpan(null);
    setSelectedTechnique(null);

    try {
      const response = await fetch('/api/analyze/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          documentName: title || 'Direct Input Text',
          promptingStrategy: strategy,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze text.');
      }

      setAnalysisResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during text analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeFile = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSelectedSpan(null);
    setSelectedTechnique(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('promptingStrategy', strategy);

      const response = await fetch('/api/analyze/document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text or analyze document.');
      }

      setAnalysisResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during document processing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30">
      {/* Liquid Glass Ambient Gradient mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[140px]" />
      </div>

      {/* Navigation Header */}
      <Header
        strategy={strategy}
        onStrategyChange={setStrategy}
        onOpenTechniquesModal={() => setIsTechniquesModalOpen(true)}
        onOpenBaselineModal={() => setIsBaselineModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 space-y-8">
        {/* Research Context Callout */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                Research Foundation
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">SemEval-2020 Task 11 Benchmark</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Fine-grained propaganda analysis identifies the specific suspicious linguistic spans inside complete news documents and classifies them into 14 predefined rhetoric technique categories with model confidence, rationale, and supporting evidence.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 font-mono">
              Prompting: <strong className="text-indigo-300 uppercase">{strategy}</strong>
            </span>
          </div>
        </section>

        {/* Input Pipeline Section */}
        <section>
          <InputSection
            onAnalyzeText={handleAnalyzeText}
            onAnalyzeFile={handleAnalyzeFile}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        </section>

        {/* Analysis Dashboard */}
        {analysisResult && (
          <div className="space-y-8 animate-fadeIn">
            {/* Document Metrics */}
            <DocumentStatsCard
              metadata={analysisResult.document}
              uniqueTechniquesCount={analysisResult.techniques.length}
              totalSpansCount={analysisResult.spans.length}
            />

            {/* Visual Analytics Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Overall Estimated Propaganda Likelihood */}
              <div className="lg:col-span-1 flex">
                <OverallLikelihoodCard analysis={analysisResult} />
              </div>

              {/* Technique Distribution Bar Chart */}
              <div className="lg:col-span-1 flex">
                <TechniqueDistributionChart
                  techniques={analysisResult.techniques}
                  selectedTechnique={selectedTechnique}
                  onSelectTechnique={setSelectedTechnique}
                />
              </div>

              {/* Technique Confidence */}
              <div className="lg:col-span-1 flex">
                <TechniqueConfidenceCard techniques={analysisResult.techniques} />
              </div>
            </section>

            {/* Sentence-Level Propaganda Analysis */}
            <section>
              <SentenceLevelAnalysis
                sentences={analysisResult.sentences}
                onSelectSpan={(span) => setSelectedSpan(span)}
              />
            </section>

            {/* Interactive Document Highlighting View */}
            <section>
              <DocumentHighlightedView
                rawText={analysisResult.rawText}
                spans={analysisResult.spans}
                selectedSpan={selectedSpan}
                onSelectSpan={(span) => setSelectedSpan(span)}
                selectedTechnique={selectedTechnique}
                onClearTechniqueFilter={() => setSelectedTechnique(null)}
              />
            </section>
          </div>
        )}

        {/* Empty state when no analysis performed yet */}
        {!analysisResult && !isLoading && (
          <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/20 backdrop-blur-sm p-8">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">
              Ready for Document Analysis
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Select one of the sample texts above or upload a .txt, .pdf, or .docx file to begin two-stage span detection and fine-grained technique classification.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-16 text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            AI-Powered Propaganda Detection System · SemEval-2020 Task 11
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsTechniquesModalOpen(true)}
              className="hover:text-slate-300 underline"
            >
              14 Techniques Taxonomy
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsBaselineModalOpen(true)}
              className="hover:text-slate-300 underline"
            >
              Linear SVM Baseline
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <SpanDetailModal
        span={selectedSpan}
        onClose={() => setSelectedSpan(null)}
        onOpenTechniquesModal={() => {
          setSelectedSpan(null);
          setIsTechniquesModalOpen(true);
        }}
      />

      <SemEvalTechniquesModal
        isOpen={isTechniquesModalOpen}
        onClose={() => setIsTechniquesModalOpen(false)}
      />

      <BaselineBenchmarkModal
        isOpen={isBaselineModalOpen}
        onClose={() => setIsBaselineModalOpen(false)}
      />
    </div>
  );
}
