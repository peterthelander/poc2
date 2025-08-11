export function appendChunk(prev: string, chunk: string): string {
  // If the chunk is empty, do nothing
  if (!chunk) return prev;

  // If chunk starts with whitespace, just append as-is (preserves spaces/newlines)
  if (/^\s/.test(chunk)) return prev + chunk;

  // If previous ends with whitespace or is empty, append as-is
  if (!prev || /\s$/.test(prev)) return prev + chunk;

  // If chunk is markdown boundary like '###', ensure it starts on a new line
  if (chunk.startsWith('###')) return ensureDoubleNewline(prev) + chunk;

  // If chunk begins with punctuation or closing marks, no extra space
  if (/^[,.:;!?)\]]/.test(chunk)) return prev + chunk;

  // Otherwise, insert a single space to avoid word-glue
  return prev + ' ' + chunk;
}

function ensureDoubleNewline(text: string): string {
  // ensure headings start at a fresh paragraph
  if (/\n\n$/.test(text)) return text;
  if (/\n$/.test(text)) return text + '\n';
  return text + '\n\n';
}

// Optional: normalize if a list bullet arrives without preceding newline
export function normalizeListBoundary(prev: string, chunk: string): string {
  if ((chunk.startsWith('- ') || /^\d+\.\s/.test(chunk)) && !/\n$/.test(prev)) {
    return prev + '\n' + chunk;
  }
  return prev + chunk;
}
