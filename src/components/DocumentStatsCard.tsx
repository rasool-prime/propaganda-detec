import { FileType, Hash, MessageSquare, Percent, Type } from 'lucide-react';
import React from 'react';
import { DocumentMetadata } from '../types/propaganda';

interface DocumentStatsCardProps {
  metadata: DocumentMetadata;
  uniqueTechniquesCount: number;
  totalSpansCount: number;
}

export const DocumentStatsCard: React.FC<DocumentStatsCardProps> = ({
  metadata,
  uniqueTechniquesCount,
  totalSpansCount,
}) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/60 gap-2 mb-4">
        <div className="flex items-center gap-2">
          <FileType className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Document Metrics
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono truncate max-w-xs">
          Source: <span className="text-slate-200">{metadata.name}</span> ({metadata.fileType.toUpperCase()})
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Word Count */}
        <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Type className="w-3.5 h-3.5 text-indigo-400" />
            <span>Words</span>
          </div>
          <p className="text-lg font-bold text-slate-100">{metadata.wordCount.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500 font-mono">{metadata.characterCount} chars</span>
        </div>

        {/* Sentences */}
        <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
            <span>Sentences</span>
          </div>
          <p className="text-lg font-bold text-slate-100">{metadata.sentenceCount}</p>
          <span className="text-[10px] text-slate-500 font-mono">{metadata.paragraphCount} paragraphs</span>
        </div>

        {/* Propaganda Sentences */}
        <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Hash className="w-3.5 h-3.5 text-amber-400" />
            <span>Flagged Sentences</span>
          </div>
          <p className="text-lg font-bold text-amber-400">{metadata.propagandaSentenceCount}</p>
          <span className="text-[10px] text-slate-500 font-mono">of {metadata.sentenceCount} total</span>
        </div>

        {/* Propaganda Sentence Ratio */}
        <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Percent className="w-3.5 h-3.5 text-rose-400" />
            <span>Sentence Ratio</span>
          </div>
          <p className="text-lg font-bold text-slate-100">
            {Math.round(metadata.propagandaSentenceRatio * 100)}%
          </p>
          <span className="text-[10px] text-slate-500 font-mono">density score</span>
        </div>

        {/* Detected Spans */}
        <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Hash className="w-3.5 h-3.5 text-emerald-400" />
            <span>Detected Spans</span>
          </div>
          <p className="text-lg font-bold text-emerald-400">{totalSpansCount}</p>
          <span className="text-[10px] text-slate-500 font-mono">rhetorical fragments</span>
        </div>

        {/* Detected Techniques */}
        <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Hash className="w-3.5 h-3.5 text-cyan-400" />
            <span>Techniques</span>
          </div>
          <p className="text-lg font-bold text-slate-100">{uniqueTechniquesCount}</p>
          <span className="text-[10px] text-slate-500 font-mono">of 14 SemEval</span>
        </div>
      </div>
    </div>
  );
};
