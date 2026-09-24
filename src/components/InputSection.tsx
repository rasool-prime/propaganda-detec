import { AlertCircle, FileText, Loader2, Sparkles, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { SAMPLE_TEXTS, SampleText } from '../data/sampleTexts';

interface InputSectionProps {
  onAnalyzeText: (text: string, title?: string) => Promise<void>;
  onAnalyzeFile: (file: File) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
}

export const InputSection: React.FC<InputSectionProps> = ({
  onAnalyzeText,
  onAnalyzeFile,
  isLoading,
  errorMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'pdf' | 'docx'>('text');
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS[0].text);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleSelectSample = (sample: SampleText) => {
    setInputText(sample.text);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (activeTab === 'pdf' && ext !== 'pdf') {
      alert('Please select a valid .pdf file');
      return;
    }
    if (activeTab === 'docx' && ext !== 'docx') {
      alert('Please select a valid .docx file');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'text') {
      if (!inputText.trim()) return;
      await onAnalyzeText(inputText);
    } else {
      if (!selectedFile) return;
      await onAnalyzeFile(selectedFile);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Input Mode Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/70">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800/90 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('text');
              setSelectedFile(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Direct Text</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('pdf');
              setSelectedFile(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'pdf'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload PDF</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('docx');
              setSelectedFile(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'docx'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload DOCX</span>
          </button>
        </div>

        {/* Preset Sample Selector (when in text tab) */}
        {activeTab === 'text' && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Load Sample:</span>
            {SAMPLE_TEXTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-colors text-xs"
                title={sample.description}
              >
                {sample.title.split(':')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {activeTab === 'text' ? (
          <div>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste news articles, editorial opinions, political speeches, or public commentary here for fine-grained propaganda analysis..."
                rows={7}
                disabled={isLoading}
                className="w-full bg-slate-950/70 border border-slate-800/90 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-sans leading-relaxed resize-y"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 px-1">
              <div className="flex items-center gap-3">
                <span>{wordCount} words</span>
                <span aria-hidden="true">·</span>
                <span>{charCount} characters</span>
              </div>
              <span className="text-slate-500 italic">
                Normalized into sentence & span pipeline
              </span>
            </div>
          </div>
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={activeTab === 'pdf' ? '.pdf' : '.docx'}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-200">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB · Ready to extract plain text
                </p>
                <span className="inline-block mt-2 text-xs text-indigo-400 hover:underline">
                  Click or drag to choose another file
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-300">
                  Click to browse or drag and drop your {activeTab.toUpperCase()} file
                </p>
                <p className="text-xs text-slate-500">
                  Text will be parsed into normalized plain text before span detection (Max 10MB)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs leading-relaxed animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Analysis Error</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={
              isLoading ||
              (activeTab === 'text' && !inputText.trim()) ||
              (activeTab !== 'text' && !selectedFile)
            }
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:pointer-events-none text-white text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running SemEval-2020 Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Rhetorical Spans</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
