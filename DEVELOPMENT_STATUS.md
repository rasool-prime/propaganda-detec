# Development Status — Cycle 1

**Project:** AI-Powered Fine-Grained Propaganda Detection System  
**Research Paper:** *AI-Powered Propaganda Detection* (Maheshwar et al., Panimalar Engineering College, Chennai, India)  
**Task Foundation:** SemEval-2020 Task 11 (Technique Classification Subtask)  
**Cycle Status:** Cycle 1 Completed — Foundation & Core Architecture Established

---

## 1. Completed in Cycle 1

- **System Architecture & Pipeline Integration:**
  - Complete document text extraction and normalization pipeline for direct text, PDF (`.pdf`), DOCX (`.docx`), and text files (`.txt`).
  - Common plain-text preprocessing pipeline with paragraph detection and sentence segmentation with preserved global character offsets.
  - Two-stage detection architecture:
    - **Stage 1 (Propaganda Span Detection):** Identifies suspicious rhetorical candidate spans within sentences and tracks exact character boundaries `[startIndex, endIndex]`.
    - **Stage 2 (Technique Classification):** Classifies detected spans against the 14 SemEval-2020 Task 11 technique categories with confidence score (0.0 to 1.0), user-facing explanation, and supporting lexical evidence.
- **Centralized SemEval-2020 Taxonomy:**
  - Created single source of truth (`src/data/techniques.ts`) for all 14 technique labels, formal SemEval definitions, lexical markers, exemplars from training partition, and related categories.
- **LLM Structured Prompting & Multiple Prompting Strategies:**
  - Structured prompting returning machine-readable JSON schema (Technique, Confidence, Explanation, Evidence, isPropaganda).
  - Support for Zero-Shot and Few-Shot prompting strategies matching the research paper methodology.
  - Server-side Gemini API client (`@google/genai` with `gemini-3.8-flash`) keeping credentials strictly on the backend.
  - Robust fallback baseline classifier ensuring non-blocking operations if API key is not configured or times out.
- **Visual Analytics Dashboard:**
  - **Estimated Propaganda Likelihood Gauge:** Donut/gauge visualization clearly separating overall document likelihood from individual technique confidence.
  - **Technique Distribution Chart:** Visual bar chart depicting span frequencies across detected techniques with interactive filter capabilities.
  - **Technique Confidence Breakdown:** Dedicated component displaying model certainty percentages per detected technique.
  - **Sentence-Level Propaganda Analysis:** Micro-distribution heatmap and list displaying estimated propaganda likelihood sentence-by-sentence to pinpoint manipulative concentrations.
  - **Document Metrics Summary:** Word count, character count, sentence count, paragraph count, propaganda sentence ratio, and detected span counts.
- **Fine-Grained Text Highlighting:**
  - Precise document rendering with highlighted spans.
  - Click-to-inspect interactive modal drawer displaying technique name, confidence score, user-facing explanation, supporting lexical evidence, character offsets, and sentence context.
- **Research Benchmarking & Taxonomy Modals:**
  - 14 SemEval Techniques reference browser with search and detailed linguistic markers.
  - Baseline Benchmark modal displaying Table I (Dataset Summary), Table II (TF-IDF + Linear SVM configuration), and Table IV (Experimental Results).
  - Strict research integrity: LLM benchmark results marked as "Evaluation pending" as per the paper; no fabricated metrics.
- **Liquid Glass / Glassmorphism Aesthetic:**
  - Translucent glass cards (`bg-slate-900/60 backdrop-blur-md border border-slate-800/80`), zero-pill metadata discipline with `·` separators, WCAG-compliant contrast, and responsive layout for desktop, tablet, and mobile.
- **Production Full-Stack & Render Deployment Readiness:**
  - Express server (`server.ts`) with development Vite middleware and production static serving.
  - Multi-part file upload support (`multer`) with 10MB limit and in-memory buffer processing.
  - Clean environment variable handling (`PORT`, `GEMINI_API_KEY`).
  - Unit and pipeline testing verified.

---

## 2. In Progress

- **Context-Aware Span Resolution:**
  - Passing surrounding sentence context to the technique classifier (partially implemented; can be expanded with multi-sentence sliding windows in Cycle 2).
- **Heuristic Stage 1 Span Tuner:**
  - Refined pattern matching based on SemEval-2020 linguistic markers; ready for offline-trained token-level sequence tagger integration in Cycle 2.

---

## 3. Not Yet Implemented (Planned for Future Cycles)

- **Cycle 2 & Beyond:**
  - Full local scikit-learn / ONNX runtime for TF-IDF + Linear SVM offline inference.
  - Offline SemEval-2020 Task 11 evaluation runner to compute empirical accuracy, macro F1, and weighted F1 against the held-out 1,226 spans.
  - Multi-document comparison view (comparing propaganda likelihood across multiple articles).
  - Export analysis reports (PDF/JSON export).
  - Contextual sliding-window classifier using adjacent paragraphs for techniques relying heavily on broader discourse (e.g., Repetition, Bandwagon).

---

## 4. Current Architecture

```
User Input (Direct Text / PDF / DOCX / TXT)
    ↓
Text Extractor (pdf-parse v2 / mammoth / buffer)
    ↓
Preprocessor (Text Normalization, Paragraph & Sentence Segmentation, Offset Mapping)
    ↓
Stage 1: Propaganda Span Detector (Candidate rhetorical fragment extraction)
    ↓
Stage 2: Technique Classifier (Gemini 3.8 Flash via Structured / Few-Shot / Zero-Shot Prompting)
    ↓
Aggregator & Likelihood Estimator (Overall Likelihood vs Technique Confidence Separation)
    ↓
REST API (Express on /api/analyze/text, /api/analyze/document)
    ↓
Frontend Dashboard (React 19 + Tailwind CSS + Liquid Glass UI)
  ├── Document Metrics
  ├── Overall Propaganda Likelihood Donut Gauge
  ├── Technique Distribution Bar Chart
  ├── Technique Confidence Breakdown
  ├── Sentence-Level Likelihood Analysis & Heatmap
  └── Interactive Span Highlight View & Inspector Modal
```

---

## 5. Files Changed & Created

- `/server.ts` — Full-stack Express server with Vite middleware in dev and static serving in prod.
- `/src/types/propaganda.ts` — Centralized TypeScript interfaces for techniques, spans, sentences, and benchmark schemas.
- `/src/data/techniques.ts` — Single source of truth for the 14 SemEval-2020 Task 11 technique definitions, examples, and markers.
- `/src/data/baseline.ts` — Classical TF-IDF + Linear SVM parameters and benchmark tables from the research paper.
- `/src/data/sampleTexts.ts` — Curated news op-ed, campaign rally, and neutral scientific control text samples.
- `/src/server/gemini.ts` — Server-side Gemini client with `@google/genai` and `gemini-3.8-flash`.
- `/src/server/textExtractor.ts` — Multi-format text extraction for PDF, DOCX, and TXT with corruption handling.
- `/src/server/preprocessor.ts` — Text cleaning, paragraph detection, and sentence segmentation with global offset tracking.
- `/src/server/spanDetector.ts` — Stage 1 candidate propaganda span detector.
- `/src/server/classifier.ts` — Stage 2 technique classifier implementing Structured, Few-Shot, and Zero-Shot prompting with fallback baseline.
- `/src/server/pipeline.ts` — Analysis pipeline orchestrator.
- `/src/components/Header.tsx` — Liquid Glass header with strategy toggle and research modal triggers.
- `/src/components/InputSection.tsx` — Direct text input, PDF upload, DOCX upload, and sample selector.
- `/src/components/OverallLikelihoodCard.tsx` — Donut gauge for Estimated Propaganda Likelihood.
- `/src/components/TechniqueDistributionChart.tsx` — Bar chart of detected technique frequencies.
- `/src/components/TechniqueConfidenceCard.tsx` — Technique confidence metrics.
- `/src/components/SentenceLevelAnalysis.tsx` — Sentence-level likelihood heatmap and breakdown.
- `/src/components/DocumentStatsCard.tsx` — Document metrics (words, sentences, flagged sentence ratio).
- `/src/components/DocumentHighlightedView.tsx` — Fine-grained interactive span highlighting.
- `/src/components/SpanDetailModal.tsx` — Interactive span inspector modal.
- `/src/components/SemEvalTechniquesModal.tsx` — Reference browser for 14 SemEval techniques.
- `/src/components/BaselineBenchmarkModal.tsx` — Research baseline and evaluation comparison modal.
- `/src/App.tsx` — Main dashboard layout.
- `/src/index.css` — Liquid glass styling and fadeIn animations.
- `/package.json` — Added scripts (`dev: "tsx server.ts"`, `start: "tsx server.ts"`), dependencies (`pdf-parse`, `mammoth`, `multer`, `tsx`).
- `/metadata.json` — Updated application name and description.
- `/index.html` — Updated title and OpenGraph metadata.

---

## 6. Dependencies Added

- `pdf-parse` (^2.4.5) — Text extraction from uploaded PDF documents.
- `mammoth` (^1.12.3) — Text extraction from uploaded DOCX documents.
- `multer` (^2.4.0) — Multipart file upload handling with memory buffers.
- `tsx` (^4.21.0) — TypeScript execution for Node/Express server in development and production.
- `@types/pdf-parse`, `@types/multer` — TypeScript type definitions.

---

## 7. Environment Variables

- `PORT` — Port number for the Express server (default: `3000`). Respected by Render.
- `GEMINI_API_KEY` — API key for Google Gemini (`gemini-3.8-flash`). Kept strictly server-side.
- `NODE_ENV` — `development` or `production`.

---

## 8. Known Issues

- Scanned or image-only PDFs without an OCR text layer return an explicit user-facing message: *"No readable text could be extracted from this PDF. The document may be scanned, image-only, or encrypted."*
- Rate limits on free Gemini API keys can occur under rapid successive requests; the system handles this gracefully with a 6-second timeout and fallback heuristic classification.

---

## 9. Next Cycle (Cycle 2 Plan)

1. **Empirical Evaluation Pipeline:** Set up evaluation harness to load the 1,226 held-out SemEval-2020 Task 11 test spans and run automated F1 / accuracy evaluation.
2. **Context Window Expansion:** Include adjacent sentences into Stage 2 prompt context to improve differentiation between context-dependent techniques (e.g. *Repetition*, *Whataboutism*).
3. **Report Export:** Add PDF/JSON export functionality for generated propaganda intelligence reports.
4. **Confidence Calibration:** Add temperature scaling / calibration mapping to align raw model logits with empirical empirical precision.
