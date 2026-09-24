export interface SegmentedParagraph {
  index: number;
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface SegmentedSentence {
  index: number;
  paragraphIndex: number;
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface PreprocessedDocument {
  normalizedText: string;
  paragraphs: SegmentedParagraph[];
  sentences: SegmentedSentence[];
  wordCount: number;
  characterCount: number;
}

export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\t/g, ' ')
    .replace(/\u00A0/g, ' ');
}

export function preprocessDocument(rawText: string): PreprocessedDocument {
  const normalizedText = normalizeText(rawText);

  // Segment paragraphs
  const paragraphRegex = /[^\n]+(?:\n(?![ \t]*\n)[^\n]+)*/g;
  const paragraphs: SegmentedParagraph[] = [];
  let pMatch: RegExpExecArray | null;

  while ((pMatch = paragraphRegex.exec(normalizedText)) !== null) {
    const text = pMatch[0].trim();
    if (text.length > 0) {
      paragraphs.push({
        index: paragraphs.length,
        text,
        startIndex: pMatch.index,
        endIndex: pMatch.index + pMatch[0].length,
      });
    }
  }

  // Fallback if no clean paragraphs were matched
  if (paragraphs.length === 0 && normalizedText.trim().length > 0) {
    paragraphs.push({
      index: 0,
      text: normalizedText.trim(),
      startIndex: 0,
      endIndex: normalizedText.length,
    });
  }

  // Segment sentences within each paragraph preserving overall document offsets
  const sentences: SegmentedSentence[] = [];

  for (const para of paragraphs) {
    // Sentence splitting regex that handles common abbreviation patterns (e.g. Dr., Mr., vs., U.S., e.g., i.e.)
    const sentenceSplitRegex = /([A-Z0-9\u00C0-\u024F][^.!?\n]*?(?:[.!?]+['"]?|\n|$))/g;
    let sMatch: RegExpExecArray | null;

    while ((sMatch = sentenceSplitRegex.exec(para.text)) !== null) {
      const trimmed = sMatch[0].trim();
      if (trimmed.length > 2) {
        const localStart = sMatch.index + (sMatch[0].length - sMatch[0].trimStart().length);
        const globalStart = para.startIndex + localStart;
        const globalEnd = globalStart + trimmed.length;

        sentences.push({
          index: sentences.length,
          paragraphIndex: para.index,
          text: trimmed,
          startIndex: globalStart,
          endIndex: globalEnd,
        });
      }
    }
  }

  // Fallback if sentence segmentation yielded nothing
  if (sentences.length === 0 && normalizedText.trim().length > 0) {
    sentences.push({
      index: 0,
      paragraphIndex: 0,
      text: normalizedText.trim(),
      startIndex: 0,
      endIndex: normalizedText.length,
    });
  }

  // Calculate words
  const words = normalizedText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  return {
    normalizedText,
    paragraphs,
    sentences,
    wordCount: words.length,
    characterCount: normalizedText.length,
  };
}
