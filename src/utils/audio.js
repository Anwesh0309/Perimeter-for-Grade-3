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

// Singleton state
let _currentAudio = null;
let _isMuted = false;
let _sessionCache = new Map(); // text → blobUrl
let _currentRequest = null;    // AbortController for in-flight fetch

export function setMuted(muted) {
  _isMuted = muted;
  if (muted) _hardStop();
}

export function getMuted() { return _isMuted; }

export function stopNarration() { _hardStop(); }

function _hardStop() {
  // Cancel any in-flight fetch
  if (_currentRequest) {
    _currentRequest.abort();
    _currentRequest = null;
  }
  // Stop any playing audio
  if (_currentAudio) {
    _currentAudio.onended = null;
    _currentAudio.onerror = null;
    _currentAudio.pause();
    _currentAudio.src = '';
    _currentAudio = null;
  }
}

export async function narrateText(text, style = 'statement') {
  // Always stop whatever is playing first
  _hardStop();

  if (_isMuted || !text || !text.trim()) return;

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

    // Check again — user may have muted or navigated away while fetching
    if (_isMuted) return;

    const audio = new Audio(blobUrl);
    _currentAudio = audio;
    audio.onended = () => { _currentAudio = null; };
    audio.onerror = () => { _currentAudio = null; };
    await audio.play().catch(() => { _currentAudio = null; });

  } catch (err) {
    if (err.name !== 'AbortError') console.warn('Audio error:', err);
    _currentAudio = null;
    _currentRequest = null;
  }
}
