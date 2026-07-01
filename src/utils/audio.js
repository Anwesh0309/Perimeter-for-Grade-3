// Audio Engine — singleton, no overlap, one narration at a time
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';

const styleSettings = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// ── Singleton state ───────────────────────────────────────
let _currentAudio   = null;   // currently playing HTMLAudioElement
let _isMuted        = false;  // master mute flag
let _sessionCache   = new Map(); // text → blobUrl
let _currentRequest = null;   // AbortController for in-flight fetch

// ── Public API ────────────────────────────────────────────

/** Call this whenever muted state changes (from React context) */
export function setMuted(muted) {
  _isMuted = muted;
  if (muted) _hardStop();
}

/** Sync mute from persisted state on page load / navigation */
export function syncMuteState(muted) {
  _isMuted = !!muted;
  if (_isMuted) _hardStop();
}

export function getMuted() { return _isMuted; }

/** Stop everything immediately */
export function stopNarration() { _hardStop(); }

function _hardStop() {
  // 1. Cancel any in-flight API fetch
  if (_currentRequest) {
    try { _currentRequest.abort(); } catch (_) {}
    _currentRequest = null;
  }
  // 2. Stop & fully release any playing audio
  if (_currentAudio) {
    const a = _currentAudio;
    _currentAudio = null;  // clear ref FIRST to prevent re-entrancy
    a.onended = null;
    a.onerror = null;
    try { a.pause(); } catch (_) {}
    // Detach src so browser releases the resource
    try { a.src = ''; } catch (_) {}
  }
}

/** Narrate text. Always stops whatever is currently playing first. */
export async function narrateText(text, style = 'statement') {
  // Stop any previous narration before starting a new one
  _hardStop();

  if (_isMuted) return;
  if (!text || !text.trim()) return;

  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) return;

  try {
    let blobUrl = _sessionCache.get(text);

    if (!blobUrl) {
      const controller = new AbortController();
      _currentRequest = controller;

      const settings = styleSettings[style] || styleSettings.statement;
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text.trim(),
            model_id: MODEL_ID,
            voice_settings: settings,
          }),
        }
      );

      _currentRequest = null;
      if (!response.ok) return;

      const blob = await response.blob();
      blobUrl = URL.createObjectURL(blob);
      _sessionCache.set(text, blobUrl);
    }

    // Re-check mute — user may have toggled while we were fetching
    if (_isMuted) return;

    const audio = new Audio(blobUrl);
    _currentAudio = audio;
    audio.onended = () => { if (_currentAudio === audio) _currentAudio = null; };
    audio.onerror = () => { if (_currentAudio === audio) _currentAudio = null; };

    await audio.play().catch(() => {
      if (_currentAudio === audio) _currentAudio = null;
    });

  } catch (err) {
    _currentRequest = null;
    _currentAudio   = null;
    if (err?.name !== 'AbortError') console.warn('Audio error:', err);
  }
}
