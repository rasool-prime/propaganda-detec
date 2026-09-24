import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { BENCHMARK_RESULTS, CLASSICAL_BASELINE_CONFIG, SEMEVAL_DATASET_SUMMARY } from './src/data/baseline';
import { TECHNIQUE_DEFINITIONS, TECHNIQUE_LABELS } from './src/data/techniques';
import { runPropagandaAnalysisPipeline } from './src/server/pipeline';
import { extractTextFromBuffer } from './src/server/textExtractor';
import { PromptingStrategy } from './src/types/propaganda';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Multer memory storage for PDF / DOCX / TXT file uploads (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.txt', '.pdf', '.docx'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type "${ext}". Only .txt, .pdf, and .docx are supported.`));
    }
  },
});

// API Routes

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    environment: isProd ? 'production' : 'development',
  });
});

/**
 * SemEval-2020 Task 11 technique definitions single source of truth
 */
app.get('/api/techniques', (_req: Request, res: Response) => {
  res.json({
    labels: TECHNIQUE_LABELS,
    definitions: TECHNIQUE_DEFINITIONS,
  });
});

/**
 * Baseline & dataset metadata from research paper
 */
app.get('/api/baseline-info', (_req: Request, res: Response) => {
  res.json({
    dataset: SEMEVAL_DATASET_SUMMARY,
    baselineConfig: CLASSICAL_BASELINE_CONFIG,
    benchmarks: BENCHMARK_RESULTS,
  });
});

/**
 * Analyze direct text
 */
app.post('/api/analyze/text', async (req: Request, res: Response) => {
  try {
    const { text, documentName, promptingStrategy } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      res.status(400).json({ error: 'Text input cannot be empty. Please enter or paste text to analyze.' });
      return;
    }

    const strategy: PromptingStrategy = ['structured', 'zero-shot', 'few-shot'].includes(promptingStrategy)
      ? promptingStrategy
      : 'structured';

    const result = await runPropagandaAnalysisPipeline({
      text,
      documentName: documentName || 'Direct Input Text',
      fileType: 'text',
      promptingStrategy: strategy,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error analyzing text:', error);
    res.status(500).json({
      error: error.message || 'An unexpected error occurred during propaganda analysis.',
    });
  }
});

/**
 * Analyze uploaded document (PDF, DOCX, TXT)
 */
app.post('/api/analyze/document', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No document file was provided. Please upload a .txt, .pdf, or .docx file.' });
      return;
    }

    const { originalname, buffer, mimetype } = req.file;
    const promptingStrategy = (req.body.promptingStrategy as PromptingStrategy) || 'structured';

    // Extract text from document buffer
    const extracted = await extractTextFromBuffer(buffer, originalname, mimetype);

    // Pass through common analysis pipeline
    const result = await runPropagandaAnalysisPipeline({
      text: extracted.text,
      documentName: extracted.name,
      fileType: extracted.fileType,
      promptingStrategy,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    res.status(400).json({
      error: error.message || 'Failed to extract text or analyze document.',
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Propaganda Detection Server running on http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer();
