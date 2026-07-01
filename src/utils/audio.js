// Audio engine - ElevenLabs TTS with in-session caching
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';

const styleSettings = {
  celebration:  { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement:{ stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:     { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:     { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:     { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:    { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// In-session audio cache: text → blob URL
const audioCache = new Map();

// Currently playing audio
let currentAudio = null;
let isMuted = false;

export function setMuted(muted) {
  isMuted = muted;
  if (muted && currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

export function stopNarration() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export async function narrateText(text, style = 'statement', onEnd = null) {
  if (isMuted || !text || text.trim() === '') {
    if (onEnd) onEnd();
    return;
  }

  stopNarration();

  try {
    let blobUrl = audioCache.get(text);

    if (!blobUrl) {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (!apiKey) {
        console.warn('No ElevenLabs API key found');
        if (onEnd) onEnd();
        return;
      }

      const settings = styleSettings[style] || styleSettings.statement;

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: MODEL_ID,
            voice_settings: settings,
          }),
        }
      );

      if (!response.ok) {
        console.warn('ElevenLabs API error:', response.status);
        if (onEnd) onEnd();
        return;
      }

      const blob = await response.blob();
      blobUrl = URL.createObjectURL(blob);
      audioCache.set(text, blobUrl);
    }

    const audio = new Audio(blobUrl);
    currentAudio = audio;

    audio.onended = () => {
      currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      currentAudio = null;
      if (onEnd) onEnd();
    };

    await audio.play();
  } catch (err) {
    console.warn('Narration error:', err);
    currentAudio = null;
    if (onEnd) onEnd();
  }
}

export function isNarrating() {
  return currentAudio !== null && !currentAudio.paused;
}
