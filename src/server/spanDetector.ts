import { CandidateSpan } from '../types/propaganda';
import { PreprocessedDocument, SegmentedSentence } from './preprocessor';

interface RhetoricalPattern {
  name: string;
  regex: RegExp;
  baseScore: number;
}

const RHETORICAL_SPAN_PATTERNS: RhetoricalPattern[] = [
  // Loaded Language & Affective Intensifiers
  {
    name: 'Loaded Language Cue',
    regex:
      /\b(disastrous|corrupt|treasonous|tyranny|bloodbath|monstrous|savage|reckless|vicious|barbaric|evil|shameful|catastrophic|deplorable|despicable|grotesque|heinous|outrageous|sinister|fanatical)\b[^\w\n]*[\w\s]{0,25}/gi,
    baseScore: 0.85,
  },
  // Name Calling & Derogatory Labels
  {
    name: 'Name Calling Cue',
    regex:
      /\b(spineless puppets|puppets|traitors|crooks|extremists|clowns|radicals|sellouts|sheep|fascists|elites|warmongers|scumbags|charlatans|hypocrites|frauds)\b/gi,
    baseScore: 0.88,
  },
  // Appeal to Fear & Existential Threat
  {
    name: 'Appeal to Fear Cue',
    regex:
      /\b(if we do not act now|they are coming (?:for|to)|will be overrun|wiped out overnight|existential threat|brink of utter ruin|irreversible darkness|total collapse|plunge into chaos)\b[^\w\n]*[\w\s]{0,35}/gi,
    baseScore: 0.84,
  },
  // Black-and-White Fallacy / False Binary
  {
    name: 'Black-and-White Fallacy Cue',
    regex:
      /\b(either you (?:are|stand) with [^,\n]+ or (?:you are )?(?:against|with)|you are either [^,\n]+ or [^,\n]+|the only choice is|no middle ground)\b/gi,
    baseScore: 0.86,
  },
  // Flag-Waving / Group Loyalty
  {
    name: 'Flag-Waving Cue',
    regex:
      /\b(every true patriot|defend our (?:homeland|heritage|freedom)|for the honor of our nation|the very soul of our nation|sacred land|un-American|betrayal of our people)\b/gi,
    baseScore: 0.87,
  },
  // Causal Oversimplification
  {
    name: 'Causal Oversimplification Cue',
    regex:
      /\b(is solely caused by|the only reason is|this single (?:policy|decision|law) (?:ruined|caused|destroyed)|responsible for all (?:our )?problems)\b[^\w\n]*[\w\s]{0,30}/gi,
    baseScore: 0.82,
  },
  // Bandwagon / Appeal to Numbers
  {
    name: 'Bandwagon Cue',
    regex:
      /\b(tens of millions of [^,\n]+ have already joined|millions of (?:citizens|families|people) (?:are|know)|everyone knows that|do not be left behind on the wrong side of history)\b/gi,
    baseScore: 0.8,
  },
  // Doubt & Insinuation
  {
    name: 'Doubt Cue',
    regex:
      /\b(can we really (?:trust|believe)|so-called (?:experts|officials|scientists)|who really stands behind|conveniently ignores|questionable motives)\b[^\w\n]*[\w\s]{0,25}/gi,
    baseScore: 0.78,
  },
  // Slogans & Rallying Cries
  {
    name: 'Slogans Cue',
    regex:
      /\b(forward together[!, ]+strength in unity|make [^!\n]+ great again|power to the people|build back better|strength through [^!\n]+)[!.]?/gi,
    baseScore: 0.83,
  },
  // Thought-terminating Cliche
  {
    name: 'Thought-terminating Cliche Cue',
    regex:
      /\b(it is what it is|rules are rules|that is just how the world works|only time will tell|everything happens for a reason)\b/gi,
    baseScore: 0.79,
  },
  // Whataboutism / Red Herring
  {
    name: 'Whataboutism Cue',
    regex:
      /\b(why are (?:critics|they) (?:complaining|whining) about [^,\n]+ when (?:their own|they)|what about when|how can they criticize us when)\b[^\w\n]*[\w\s]{0,40}/gi,
    baseScore: 0.81,
  },
  // Exaggeration / Hyperbole
  {
    name: 'Exaggeration Cue',
    regex:
      /\b(worst (?:crisis|catastrophe|disaster) in human history|completely annihilated|unprecedented devastation|absolute and total disaster|greatest threat ever faced)\b/gi,
    baseScore: 0.85,
  },
  // Appeal to Authority
  {
    name: 'Appeal to Authority Cue',
    regex:
      /\b(even renowned (?:leaders|actors|celebrities|figures) confirm|top experts confirm without doubt|leading authorities agree)\b[^\w\n]*[\w\s]{0,30}/gi,
    baseScore: 0.77,
  },
];

export function detectCandidateSpans(preprocessed: PreprocessedDocument): CandidateSpan[] {
  const candidateSpans: CandidateSpan[] = [];
  const coveredRanges: Array<{ start: number; end: number }> = [];

  const isOverlapping = (start: number, end: number): boolean => {
    return coveredRanges.some(
      (r) => (start >= r.start && start <= r.end) || (end >= r.start && end <= r.end) || (start <= r.start && end >= r.end)
    );
  };

  // 1. Scan each sentence against rhetorical patterns
  for (const sentence of preprocessed.sentences) {
    for (const pattern of RHETORICAL_SPAN_PATTERNS) {
      pattern.regex.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = pattern.regex.exec(sentence.text)) !== null) {
        const spanText = match[0].trim();
        if (spanText.length < 4) continue;

        const localStart = match.index + (match[0].length - match[0].trimStart().length);
        const globalStart = sentence.startIndex + localStart;
        const globalEnd = globalStart + spanText.length;

        if (!isOverlapping(globalStart, globalEnd)) {
          coveredRanges.push({ start: globalStart, end: globalEnd });
          candidateSpans.push({
            id: `span-${candidateSpans.length + 1}`,
            text: spanText,
            startIndex: globalStart,
            endIndex: globalEnd,
            sentenceIndex: sentence.index,
            paragraphIndex: sentence.paragraphIndex,
            preliminaryScore: pattern.baseScore,
          });
        }
      }
    }
  }

  // 2. Scan for Repetition across sentences
  // If identical or near-identical phrases appear 2+ times in short succession
  const phraseMap = new Map<string, Array<{ sentence: SegmentedSentence; index: number; length: number }>>();
  const wordsRegex = /\b[A-Za-z]{3,}\s+[A-Za-z]{3,}(?:\s+[A-Za-z]{3,})?\b/g;

  for (const sentence of preprocessed.sentences) {
    wordsRegex.lastIndex = 0;
    let wMatch: RegExpExecArray | null;
    while ((wMatch = wordsRegex.exec(sentence.text)) !== null) {
      const phrase = wMatch[0].toLowerCase();
      // Skip stopword phrases
      if (/^(there is|this is|it was|in the|of the|to the|and the|for the)\b/.test(phrase)) {
        continue;
      }
      const existing = phraseMap.get(phrase) || [];
      existing.push({
        sentence,
        index: sentence.startIndex + wMatch.index,
        length: wMatch[0].length,
      });
      phraseMap.set(phrase, existing);
    }
  }

  for (const [phrase, occurrences] of phraseMap.entries()) {
    if (occurrences.length >= 2 && phrase.length >= 8) {
      for (const occ of occurrences) {
        const start = occ.index;
        const end = start + occ.length;
        if (!isOverlapping(start, end)) {
          coveredRanges.push({ start, end });
          candidateSpans.push({
            id: `span-${candidateSpans.length + 1}`,
            text: occ.sentence.text.substring(start - occ.sentence.startIndex, end - occ.sentence.startIndex),
            startIndex: start,
            endIndex: end,
            sentenceIndex: occ.sentence.index,
            paragraphIndex: occ.sentence.paragraphIndex,
            preliminaryScore: 0.82,
          });
        }
      }
    }
  }

  // Sort candidate spans by start index
  return candidateSpans.sort((a, b) => a.startIndex - b.startIndex);
}
