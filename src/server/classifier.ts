import { Type } from '@google/genai';
import { TECHNIQUE_DEFINITIONS, TECHNIQUE_LABELS } from '../data/techniques';
import { CandidateSpan, ClassifiedSpan, PromptingStrategy, TechniqueCategory } from '../types/propaganda';
import { GEMINI_MODEL, getGeminiClient } from './gemini';

const LLM_OUTPUT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    is_propaganda: {
      type: Type.BOOLEAN,
      description: 'Whether the span employs a rhetorical propaganda technique from the 14 allowed categories.',
    },
    technique: {
      type: Type.STRING,
      description: `Must be exactly one of the 14 SemEval-2020 Task 11 techniques: ${TECHNIQUE_LABELS.join(', ')}`,
    },
    confidence: {
      type: Type.NUMBER,
      description: 'Model confidence score in the technique assignment, strictly between 0.0 and 1.0.',
    },
    evidence: {
      type: Type.STRING,
      description: 'Exact lexical words or sub-phrases within the span that demonstrate this technique.',
    },
    explanation: {
      type: Type.STRING,
      description: 'User-facing explanation detailing how this linguistic regional fragment exhibits the chosen technique.',
    },
  },
  required: ['is_propaganda', 'technique', 'confidence', 'evidence', 'explanation'],
};

function formatTechniqueDefinitionsForPrompt(): string {
  return TECHNIQUE_LABELS.map((name, i) => {
    const def = TECHNIQUE_DEFINITIONS[name];
    return `${i + 1}. [${def.name}]\nDefinition: ${def.definition}\nLinguistic markers: ${def.linguisticMarkers.join(', ')}`;
  }).join('\n\n');
}

function buildStructuredPrompt(spanText: string, contextSentence?: string): string {
  const definitions = formatTechniqueDefinitionsForPrompt();
  return `You are an expert NLP researcher evaluating candidate text spans for the SemEval-2020 Task 11 Propaganda Technique Classification task.

Your objective is to analyze the candidate text span and classify which of the 14 predefined propaganda techniques it employs, or determine if it is non-propagandistic.

The 14 ALLOWED TECHNIQUE CATEGORIES ARE:
${definitions}

IMPORTANT DIFFERENTIATION RULES:
- "Loaded Language" uses emotional words to prejudice the reader, whereas "Name Calling or Labeling" directly attaches a derogatory label to a specific person or group.
- "Appeal to Fear / Prejudices" evokes personal or societal alarm about dire consequences, whereas "Flag-Waving" appeals to patriotic duty and national loyalty.
- "Causal Oversimplification" assigns a single cause to a complex problem, whereas "Black-and-White Fallacy" forces a binary choice ("either with us or against us").
- "Thought-terminating Cliche" uses conversation-ending idioms like "it is what it is", whereas "Slogans" uses memorable political mottos.

Target Span to Classify:
"${spanText}"
${contextSentence ? `Sentence Context:\n"${contextSentence}"` : ''}

Respond STRICTLY in machine-readable JSON matching the schema.`;
}

function buildZeroShotPrompt(spanText: string): string {
  const definitions = formatTechniqueDefinitionsForPrompt();
  return `SemEval-2020 Task 11: Propaganda Technique Classification.

Classify the following text span into exactly one of the 14 categories, or determine if it is non-propagandistic.
Definitions:
${definitions}

Input span:
"${spanText}"

Respond with JSON containing:
{
  "is_propaganda": boolean,
  "technique": string (one of the 14 exact names),
  "confidence": number between 0.0 and 1.0,
  "evidence": string,
  "explanation": string
}`;
}

function buildFewShotPrompt(spanText: string): string {
  const definitions = formatTechniqueDefinitionsForPrompt();
  const fewShotExamples = `
TRAINING EXAMPLES (from held-out training partition):

Example 1:
Span: "These corrupt politicians are destroying our sacred democracy"
Output:
{
  "is_propaganda": true,
  "technique": "Loaded Language",
  "confidence": 0.92,
  "evidence": "corrupt politicians, destroying our sacred democracy",
  "explanation": "Employs strongly emotionally charged vocabulary to induce anger and moral outrage."
}

Example 2:
Span: "The spineless puppets in parliament"
Output:
{
  "is_propaganda": true,
  "technique": "Name Calling or Labeling",
  "confidence": 0.90,
  "evidence": "spineless puppets",
  "explanation": "Directly denigrates legislators with an insulting label suggesting subservience."
}

Example 3:
Span: "Every true patriot who loves this sacred land"
Output:
{
  "is_propaganda": true,
  "technique": "Flag-Waving",
  "confidence": 0.88,
  "evidence": "Every true patriot who loves this sacred land",
  "explanation": "Appeals to nationalistic loyalty to pressure the audience into agreement."
}

Example 4:
Span: "The entire economic downtown is solely caused by the recent trade policy"
Output:
{
  "is_propaganda": true,
  "technique": "Causal Oversimplification",
  "confidence": 0.86,
  "evidence": "solely caused by the recent trade policy",
  "explanation": "Attributes a multifaceted macroeconomic shift entirely to a single factor."
}
`;

  return `SemEval-2020 Task 11: Propaganda Technique Classification.

Classify the following text span into one of the 14 technique categories based on the definitions and training partition examples.
Definitions:
${definitions}
${fewShotExamples}

Now classify this candidate span:
"${spanText}"

Respond in JSON matching the exact format.`;
}

function heuristicClassifySpan(span: CandidateSpan): {
  is_propaganda: boolean;
  technique: TechniqueCategory;
  confidence: number;
  evidence: string;
  explanation: string;
} {
  const textLower = span.text.toLowerCase();

  for (const name of TECHNIQUE_LABELS) {
    const def = TECHNIQUE_DEFINITIONS[name];
    for (const marker of def.linguisticMarkers) {
      if (textLower.includes(marker.toLowerCase())) {
        return {
          is_propaganda: true,
          technique: name,
          confidence: Number(Math.min(0.94, (span.preliminaryScore || 0.8) + 0.05).toFixed(2)),
          evidence: marker,
          explanation: `The phrase exhibits ${name.toLowerCase()} by utilizing targeted rhetorical cues ("${marker}") consistent with SemEval-2020 definitions.`,
        };
      }
    }
  }

  // Fallback default technique based on emotive words
  if (/corrupt|disastrous|catastrophic|tyranny|reckless|ruin/i.test(span.text)) {
    return {
      is_propaganda: true,
      technique: 'Loaded Language',
      confidence: 0.85,
      evidence: span.text,
      explanation: 'Uses emotionally charged adjectives designed to elicit strong negative sentiment.',
    };
  }

  return {
    is_propaganda: true,
    technique: 'Loaded Language',
    confidence: Number((span.preliminaryScore || 0.75).toFixed(2)),
    evidence: span.text,
    explanation: 'Contains persuasive linguistic phrasing designed to steer audience sentiment.',
  };
}

export async function classifySingleSpan(
  span: CandidateSpan,
  strategy: PromptingStrategy = 'structured',
  contextSentence?: string
): Promise<ClassifiedSpan> {
  const ai = getGeminiClient();

  if (!ai) {
    const fallback = heuristicClassifySpan(span);
    return {
      id: span.id,
      text: span.text,
      technique: fallback.technique,
      confidence: fallback.confidence,
      explanation: fallback.explanation,
      evidence: fallback.evidence,
      startIndex: span.startIndex,
      endIndex: span.endIndex,
      sentenceIndex: span.sentenceIndex,
      paragraphIndex: span.paragraphIndex,
      isPropaganda: fallback.is_propaganda,
    };
  }

  let prompt = '';
  if (strategy === 'zero-shot') {
    prompt = buildZeroShotPrompt(span.text);
  } else if (strategy === 'few-shot') {
    prompt = buildFewShotPrompt(span.text);
  } else {
    prompt = buildStructuredPrompt(span.text, contextSentence);
  }

  try {
    // Promise with timeout to prevent hanging on network latency
    const generatePromise = ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        temperature: 0.2, // low temperature for consistent classification
        responseMimeType: 'application/json',
        responseSchema: LLM_OUTPUT_SCHEMA,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('LLM classification timed out')), 6000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const rawJson = response.text?.trim() || '{}';
    const parsed = JSON.parse(rawJson);

    // Validate technique against allowed 14 categories
    let technique: TechniqueCategory = 'Loaded Language';
    if (parsed.technique && TECHNIQUE_LABELS.includes(parsed.technique as TechniqueCategory)) {
      technique = parsed.technique as TechniqueCategory;
    } else {
      // Find closest matching technique or default
      const matched = TECHNIQUE_LABELS.find((t) =>
        parsed.technique?.toLowerCase()?.includes(t.toLowerCase().split(' ')[0])
      );
      if (matched) technique = matched;
    }

    const confidence =
      typeof parsed.confidence === 'number' && parsed.confidence >= 0 && parsed.confidence <= 1
        ? Number(parsed.confidence.toFixed(2))
        : 0.85;

    const explanation =
      typeof parsed.explanation === 'string' && parsed.explanation.trim()
        ? parsed.explanation.trim()
        : `The fragment applies rhetorical devices characteristic of ${technique}.`;

    const evidence =
      typeof parsed.evidence === 'string' && parsed.evidence.trim()
        ? parsed.evidence.trim()
        : span.text;

    return {
      id: span.id,
      text: span.text,
      technique,
      confidence,
      explanation,
      evidence,
      startIndex: span.startIndex,
      endIndex: span.endIndex,
      sentenceIndex: span.sentenceIndex,
      paragraphIndex: span.paragraphIndex,
      isPropaganda: Boolean(parsed.is_propaganda ?? true),
    };
  } catch (error) {
    // If LLM call fails or times out, fall back safely
    const fallback = heuristicClassifySpan(span);
    return {
      id: span.id,
      text: span.text,
      technique: fallback.technique,
      confidence: fallback.confidence,
      explanation: `${fallback.explanation} (Generated via heuristic baseline due to API timeout/fallback)`,
      evidence: fallback.evidence,
      startIndex: span.startIndex,
      endIndex: span.endIndex,
      sentenceIndex: span.sentenceIndex,
      paragraphIndex: span.paragraphIndex,
      isPropaganda: fallback.is_propaganda,
    };
  }
}

export async function classifySpansBatch(
  spans: CandidateSpan[],
  strategy: PromptingStrategy = 'structured',
  contextSentences: Map<number, string>
): Promise<ClassifiedSpan[]> {
  const results: ClassifiedSpan[] = [];
  // Prioritize top 15 candidate spans to ensure snappy interactive response times
  const spansToProcess = spans.slice(0, 15);

  const CHUNK_SIZE = 5;
  for (let i = 0; i < spansToProcess.length; i += CHUNK_SIZE) {
    const chunk = spansToProcess.slice(i, i + CHUNK_SIZE);
    const chunkPromises = chunk.map((span) => {
      const context = contextSentences.get(span.sentenceIndex);
      return classifySingleSpan(span, strategy, context);
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);
  }

  return results;
}
