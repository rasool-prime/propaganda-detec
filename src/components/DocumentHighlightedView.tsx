import { Eye, Filter, Info, ZoomIn } from 'lucide-react';
import React, { useMemo } from 'react';
import { ClassifiedSpan, TechniqueCategory } from '../types/propaganda';

interface DocumentHighlightedViewProps {
  rawText: string;
  spans: ClassifiedSpan[];
  selectedSpan: ClassifiedSpan | null;
  onSelectSpan: (span: ClassifiedSpan) => void;
  selectedTechnique: TechniqueCategory | null;
  onClearTechniqueFilter: () => void;
}

interface TextSegment {
  type: 'plain' | 'highlight';
  text: string;
  span?: ClassifiedSpan;
}

export const DocumentHighlightedView: React.FC<DocumentHighlightedViewProps> = ({
  rawText,
  spans,
  selectedSpan,
  onSelectSpan,
  selectedTechnique,
  onClearTechniqueFilter,
}) => {
  // Construct text segments
  const segments: TextSegment[] = useMemo(() => {
    if (!rawText) return [];
    if (!spans || spans.length === 0) {
      return [{ type: 'plain', text: rawText }];
    }

    // Sort spans by startIndex and filter out non-propagandistic or invalid offsets
    const sortedSpans = [...spans]
      .filter((s) => s.isPropaganda && s.startIndex >= 0 && s.endIndex <= rawText.length && s.startIndex < s.endIndex)
      .sort((a, b) => a.startIndex - b.startIndex);

    // Resolve any overlapping spans cleanly
    const nonOverlapping: ClassifiedSpan[] = [];
    let lastEnd = -1;

    for (const span of sortedSpans) {
      if (span.startIndex >= lastEnd) {
        nonOverlapping.push(span);
        lastEnd = span.endIndex;
      }
    }

    const result: TextSegment[] = [];
    let cursor = 0;

    for (const span of nonOverlapping) {
      if (span.startIndex > cursor) {
        result.push({
          type: 'plain',
          text: rawText.substring(cursor, span.startIndex),
        });
      }

      result.push({
        type: 'highlight',
        text: rawText.substring(span.startIndex, span.endIndex),
        span,
      });

      cursor = span.endIndex;
    }

    if (cursor < rawText.length) {
      result.push({
        type: 'plain',
        text: rawText.substring(cursor),
      });
    }

    return result;
  }, [rawText, spans]);

  // Color mapping based on technique
  const getHighlightColor = (technique: TechniqueCategory, isSelected: boolean, isDimmed: boolean) => {
    if (isDimmed) {
      return 'bg-slate-800/60 text-slate-400 border-b border-slate-700 opacity-60';
    }
    if (isSelected) {
      return 'bg-amber-400 text-slate-950 font-semibold ring-2 ring-amber-300 shadow-md';
    }

    switch (technique) {
      case 'Loaded Language':
        return 'bg-amber-500/25 text-amber-200 border-b-2 border-amber-400 hover:bg-amber-500/40';
      case 'Name Calling or Labeling':
        return 'bg-rose-500/25 text-rose-200 border-b-2 border-rose-400 hover:bg-rose-500/40';
      case 'Appeal to Fear / Prejudices':
        return 'bg-red-500/25 text-red-200 border-b-2 border-red-400 hover:bg-red-500/40';
      case 'Flag-Waving':
        return 'bg-blue-500/25 text-blue-200 border-b-2 border-blue-400 hover:bg-blue-500/40';
      case 'Black-and-White Fallacy':
        return 'bg-purple-500/25 text-purple-200 border-b-2 border-purple-400 hover:bg-purple-500/40';
      case 'Causal Oversimplification':
        return 'bg-orange-500/25 text-orange-200 border-b-2 border-orange-400 hover:bg-orange-500/40';
      case 'Bandwagon':
        return 'bg-emerald-500/25 text-emerald-200 border-b-2 border-emerald-400 hover:bg-emerald-500/40';
      case 'Doubt':
        return 'bg-teal-500/25 text-teal-200 border-b-2 border-teal-400 hover:bg-teal-500/40';
      default:
        return 'bg-indigo-500/25 text-indigo-200 border-b-2 border-indigo-400 hover:bg-indigo-500/40';
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl">
      {/* Header with filter controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/60 gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Document Text & Fine-Grained Span Highlights
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any highlighted phrase to inspect its rhetorical technique, confidence score, rationale, and evidence
          </p>
        </div>

        {selectedTechnique && (
          <div className="flex items-center gap-2 bg-indigo-950/70 border border-indigo-500/40 rounded-lg px-3 py-1.5 text-xs text-indigo-200">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filtering: <strong>{selectedTechnique}</strong></span>
            <button
              type="button"
              onClick={onClearTechniqueFilter}
              className="ml-2 text-indigo-400 hover:text-white underline text-[11px]"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Main Document Body */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-6 leading-relaxed font-serif text-sm sm:text-base text-slate-300 max-h-[550px] overflow-y-auto whitespace-pre-wrap selection:bg-indigo-600/30">
        {segments.map((seg, idx) => {
          if (seg.type === 'plain') {
            return <span key={idx}>{seg.text}</span>;
          }

          const span = seg.span!;
          const isSelected = selectedSpan?.id === span.id;
          const isDimmed = selectedTechnique !== null && span.technique !== selectedTechnique;
          const colorClasses = getHighlightColor(span.technique, isSelected, isDimmed);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSpan(span)}
              className={`inline rounded px-1 py-0.5 mx-0.5 font-sans cursor-pointer transition-all ${colorClasses}`}
              title={`${span.technique} (Confidence: ${Math.round(span.confidence * 100)}%) · Click to inspect`}
            >
              <span>{seg.text}</span>
              <span className="text-[10px] uppercase font-mono ml-1 px-1 py-0.2 rounded bg-black/40 text-slate-300 opacity-90 inline-block pointer-events-none">
                {span.technique}
              </span>
            </button>
          );
        })}
      </div>

      {/* Helper Legend footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Interactive span highlights link directly to SemEval-2020 Task 11 technique definitions</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
          <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
          <span>Click any span to open Inspector</span>
        </div>
      </div>
    </div>
  );
};
