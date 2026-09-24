# Propaganda Analyzer: Fine-Grained AI Propaganda Detection System

A research-oriented web application for fine-grained propaganda detection and rhetorical technique classification based strictly on the research paper **"AI-Powered Propaganda Detection"** (Maheshwar et al., Panimalar Engineering College, Chennai, India) and the **SemEval-2020 Task 11** benchmark.

---

## 1. Project Purpose & Research Foundation

Document-level classification alone fails to reveal which specific sentences or text fragments are responsible for propaganda effects. This system implements a fine-grained, span-level architecture:

1. **Span Identification (Stage 1):** Pinpoints the precise suspicious text fragments within an article.
2. **Technique Classification (Stage 2):** Classifies each span into one of the 14 predefined SemEval-2020 Task 11 technique categories.
3. **Explainability:** Produces calibrated confidence scores, human-readable rationales, and supporting lexical evidence.
4. **Reproducible Baseline Comparison:** Incorporates the TF-IDF + Linear SVM classical baseline reported in the research paper.
5. **Data Leakage Prevention:** Follows article-level partitioning (`StratifiedGroupKFold`) so that spans from the same news article never overlap between partitions.

---

## 2. Supported Input Types

All input types enter the same downstream analysis pipeline:

- **Direct Text:** Paste plain text, news articles, transcripts, or political commentary directly.
- **PDF Documents (`.pdf`):** Extracts text layers using `pdf-parse` (reports clear warnings if scanned/empty).
- **Word Documents (`.docx`):** Extracts raw text using `mammoth`.
- **Plain Text Files (`.txt`):** Direct UTF-8 buffer ingestion.

---

## 3. The 14 SemEval-2020 Task 11 Techniques

The taxonomy adheres strictly to the SemEval-2020 Task 11 benchmark:

1. `Loaded Language`
2. `Name Calling or Labeling`
3. `Repetition`
4. `Doubt`
5. `Exaggeration or Minimisation`
6. `Appeal to Fear / Prejudices`
7. `Flag-Waving`
8. `Causal Oversimplification`
9. `Slogans`
10. `Appeal to Authority`
11. `Black-and-White Fallacy`
12. `Thought-terminating Cliche`
13. `Whataboutism`
14. `Bandwagon`

---

## 4. Key Features

- **Liquid Glass Aesthetic:** Translucent cards, subtle blurs, clean typography, and zero-pill metadata discipline.
- **Two-Stage Analysis Architecture:** Segment-level candidate span detection followed by structured classification.
- **Three Prompting Strategies:** Toggle between *Structured JSON*, *Few-Shot*, and *Zero-Shot* prompting.
- **Separated Metrics:** Clear distinction between *Estimated Propaganda Likelihood* (document density) and *Technique Confidence* (model certainty).
- **Sentence-Level Propaganda Analysis:** Micro-heatmap and sentence list displaying likelihood scores across the article.
- **Fine-Grained Text Highlighting:** Interactive span highlighting with click-to-inspect modal displaying offsets, evidence, explanation, and SemEval definitions.
- **Visual Analytics:** Donut likelihood gauge, technique frequency bar chart, and confidence breakdowns.
- **Benchmark & Taxonomy Modals:** Full interactive browser for the 14 techniques and classical baseline results.

---

## 5. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend:** Express.js, TypeScript (`tsx`), Multer, PDF-Parse v2, Mammoth
- **LLM Integration:** `@google/genai` TypeScript SDK (`gemini-3.8-flash`)
- **Deployment Target:** Render & Docker-ready Node.js runtime

---

## 6. Architecture Overview

```
User Input (Direct Text / PDF / DOCX / TXT)
    ↓
Text Extractor (pdf-parse / mammoth)
    ↓
Text Cleaning & Normalization
    ↓
Paragraph & Sentence Segmentation (with Global Character Offsets)
    ↓
Stage 1: Propaganda Span Detection (Candidate Rhetorical Spans)
    ↓
Stage 2: Technique Classifier (Gemini 3.8 Flash via Structured Schema)
    ↓
Overall Likelihood Calculation & Statistical Aggregation
    ↓
Visual Analytics Dashboard & Interactive Span Inspector
```

---

## 7. Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# Required for Gemini AI classification
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Port configuration (automatically injected by Render in production)
PORT=3000
```

> **Security Note:** The `GEMINI_API_KEY` is kept strictly server-side. It is never exposed to client-side code or browser bundles.

---

## 8. Running Locally

### Prerequisites
- Node.js 20+
- npm or bun

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd propaganda-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 9. Render Deployment Guide

This repository is preconfigured for zero-friction deployment on [Render](https://render.com).

### Render Web Service Settings:
- **Environment:** `Node`
- **Build Command:** `npm run build`
- **Start Command:** `npm start` (or `npx tsx server.ts`)
- **Port:** Render automatically assigns a `PORT` environment variable, which `server.ts` respects.
- **Environment Variables:**
  - `GEMINI_API_KEY`: Add your Gemini API key in the Render Dashboard under **Environment**.
  - `NODE_ENV`: Set to `production`.

---

## 10. API Endpoints

### `POST /api/analyze/text`
Analyzes plain text passed in a JSON payload.
- **Request Body:**
  ```json
  {
    "text": "These corrupt bureaucrats are destroying our sacred homeland...",
    "documentName": "Op-Ed Piece",
    "promptingStrategy": "structured"
  }
  ```
- **Response:** `PropagandaAnalysisResult` (document metadata, overall likelihood, techniques, sentences, spans).

### `POST /api/analyze/document`
Extracts text and analyzes an uploaded file (`multipart/form-data`).
- **Form Field:** `file` (`.txt`, `.pdf`, or `.docx`)
- **Form Field:** `promptingStrategy` (`structured` | `zero-shot` | `few-shot`)

### `GET /api/techniques`
Returns the 14 SemEval-2020 Task 11 technique definitions, examples, and linguistic markers.

### `GET /api/baseline-info`
Returns dataset summary metrics, classical TF-IDF + Linear SVM configurations, and Table IV evaluation results from the paper.

### `GET /api/health`
Healthcheck endpoint for monitoring uptime and API key configuration.

---

## 11. Current Cycle 1 Status & Limitations

### Completed in Cycle 1:
- Foundation and complete full-stack architecture established.
- Support for direct text, PDF, and DOCX document extraction.
- Stage 1 candidate span detection and Stage 2 structured technique classification.
- Visual analytics dashboard with overall likelihood gauge, technique distribution, sentence analysis, and interactive text highlighting.
- Render compatibility and error handling.

### Limitations:
- Scanned PDF documents without an OCR text layer cannot be parsed; users receive an explicit error prompt.
- Stage 1 candidate span detector currently utilizes lexical and syntactic rhetorical cues; full sequence labeling model will be added in Cycle 2.
- LLM evaluation metrics on the held-out benchmark set are pending live execution and are not fabricated.

---

## 12. Research Disclaimer

This tool analyzes rhetorical techniques defined in academic benchmarks. It does **not** make determinations regarding the factual truthfulness, political correctness, or subjective intent of an author. All metrics are presented as statistical likelihoods and model certainties.
