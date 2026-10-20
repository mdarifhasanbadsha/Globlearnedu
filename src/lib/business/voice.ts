// ─────────────────────────────────────────────────────────────
// Voice message handling.
//
// Priority: transcribe with a Bangla-capable provider. When that is not
// available, NEVER fail silently and NEVER guess. A voice note is stored
// with an explicit placeholder body, `needs_transcript` is surfaced, and
// the AI is told it cannot hear audio so it asks the student to type or
// offers a human.
// ─────────────────────────────────────────────────────────────

export const VOICE_PLACEHOLDER = "[voice message]";

export interface VoiceOutcome {
  /** Text the AI may use. Empty when we could not understand the audio. */
  text: string;
  /** True when a transcript exists and can be trusted. */
  transcribed: boolean;
  /** Placeholder-safe body stored on the message record. */
  storedBody: string;
  /** Operator-facing explanation of what happened. */
  note: string;
}

/**
 * Decide how to represent an inbound voice note.
 * `transcript` is whatever the ASR provider returned (may be null).
 */
export function handleVoice(
  transcript: string | null | undefined,
  meta?: { provider?: string; confidence?: number; minConfidence?: number }
): VoiceOutcome {
  const minConf = meta?.minConfidence ?? 0.5;
  const cleaned = (transcript ?? "").trim();

  // No provider configured at all.
  if (!meta?.provider) {
    return {
      text: "",
      transcribed: false,
      storedBody: VOICE_PLACEHOLDER,
      note:
        "No audio transcription provider is configured, so this voice note was stored but not read.",
    };
  }

  // Provider ran but returned nothing usable.
  if (cleaned.length === 0) {
    return {
      text: "",
      transcribed: false,
      storedBody: VOICE_PLACEHOLDER,
      note: `${meta.provider} returned no text for this voice note.`,
    };
  }

  // Low confidence: keep it, but do not let the AI state facts from it.
  if (typeof meta.confidence === "number" && meta.confidence < minConf) {
    return {
      text: "",
      transcribed: false,
      storedBody: VOICE_PLACEHOLDER,
      note:
        `Transcript from ${meta.provider} had low confidence ` +
        `(${meta.confidence.toFixed(2)} < ${minConf}); treated as unreadable.`,
    };
  }

  return {
    text: cleaned,
    transcribed: true,
    storedBody: cleaned,
    note: `Transcribed by ${meta.provider}.`,
  };
}

/**
 * System-prompt fragment telling the AI how to behave when audio could
 * not be read. Without this the model invents a request.
 */
export const VOICE_UNREADABLE_RULE =
  "If the latest student message is a voice note you could not hear (marked [voice message]), " +
  "never guess what they said. Tell them briefly that you cannot listen to voice notes yet, " +
  "and ask them to type their question or offer to have a counselor call them.";

/** Does this conversation contain an unreadable voice note? */
export function hasUnreadAudio(
  messages: { body: string; mediaKind?: string | null; transcript?: string | null }[]
): boolean {
  return messages.some(
    (m) =>
      m.mediaKind === "audio" &&
      !(m.transcript && m.transcript.trim().length > 0)
  );
}
