import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

export interface ExtractedDocument {
  name: string;
  fileType: 'text' | 'pdf' | 'docx';
  text: string;
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  filename: string,
  mimetype?: string
): Promise<ExtractedDocument> {
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  if (extension === 'txt' || mimetype === 'text/plain') {
    const text = buffer.toString('utf-8');
    if (!text.trim()) {
      throw new Error('The uploaded text file is empty.');
    }
    return { name: filename, fileType: 'text', text };
  }

  if (extension === 'pdf' || mimetype === 'application/pdf') {
    try {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      await parser.destroy();

      const extractedText = textResult?.text?.trim() || '';
      if (!extractedText) {
        throw new Error('No readable text could be extracted from this PDF. The document may be scanned, image-only, or encrypted.');
      }

      return {
        name: filename,
        fileType: 'pdf',
        text: extractedText,
      };
    } catch (err: any) {
      if (err.message && err.message.includes('No readable text')) {
        throw err;
      }
      throw new Error(`Failed to process PDF document: ${err.message || 'Corrupted or unreadable PDF structure'}`);
    }
  }

  if (
    extension === 'docx' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const extractedText = result.value?.trim() || '';
      if (!extractedText) {
        throw new Error('The uploaded Word document contains no extractable text.');
      }

      return {
        name: filename,
        fileType: 'docx',
        text: extractedText,
      };
    } catch (err: any) {
      throw new Error(`Failed to extract text from DOCX file: ${err.message || 'Corrupted document'}`);
    }
  }

  throw new Error(
    `Unsupported file type ".${extension}". Please upload a supported format: .txt, .pdf, or .docx.`
  );
}
