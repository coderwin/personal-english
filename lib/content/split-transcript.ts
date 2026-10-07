/** Split transcript into sentences for UI indexing (MVP §4.2 sentenceIndex). */
export function splitTranscript(transcript: string): string[] {
  return transcript
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}
