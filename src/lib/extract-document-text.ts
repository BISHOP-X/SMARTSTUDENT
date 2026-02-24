/**
 * ============================================
 * Document Text Extraction Utility
 * ============================================
 *
 * Extracts plain text from uploaded documents:
 * - .docx  → mammoth
 * - .pdf   → pdfjs-dist
 * - .txt   → FileReader.readAsText
 * - .pptx  → basic XML extraction from ZIP
 */

import mammoth from 'mammoth';

/**
 * Extract readable text from a File object.
 * Returns the full document text as a string.
 */
export async function extractDocumentText(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (ext === 'txt' || file.type === 'text/plain') {
    return readAsText(file);
  }

  if (ext === 'docx' || ext === 'doc') {
    return extractDocx(file);
  }

  if (ext === 'pdf') {
    return extractPdf(file);
  }

  if (ext === 'pptx' || ext === 'ppt') {
    return extractPptx(file);
  }

  // Fallback: try reading as text
  return readAsText(file);
}

// ---- helpers ----

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) ?? '');
    reader.onerror = () => reject(new Error('Failed to read file as text'));
    reader.readAsText(file);
  });
}

function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/** Extract text from .docx using mammoth */
async function extractDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await fileToArrayBuffer(file);
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    if (!text) {
      throw new Error('No text found in document');
    }
    return text;
  } catch (err) {
    console.error('[extractDocx] Error:', err);
    throw new Error(
      'Could not extract text from this .docx file. Try pasting the text directly instead.'
    );
  }
}

/** Extract text from .pdf using pdfjs-dist */
async function extractPdf(file: File): Promise<string> {
  try {
    // Dynamic import to keep bundle lighter — pdfjs is large
    const pdfjsLib = await import('pdfjs-dist');

    // Set the worker source — use bundled worker from pdfjs-dist
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url,
    ).toString();

    const arrayBuffer = await fileToArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const textParts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      textParts.push(pageText);
    }

    const text = textParts.join('\n\n').trim();
    if (!text) {
      throw new Error('No text found in PDF');
    }
    return text;
  } catch (err) {
    console.error('[extractPdf] Error:', err);
    throw new Error(
      'Could not extract text from this PDF. Try pasting the text directly instead.'
    );
  }
}

/** Basic extraction from .pptx (ZIP of XML) */
async function extractPptx(file: File): Promise<string> {
  // .pptx extraction would require a ZIP library — for now,
  // return a helpful message rather than garbled binary
  throw new Error(
    'PowerPoint (.pptx) text extraction is not yet supported. Please copy-paste the slide text using the "Paste Text" mode instead.'
  );
}
