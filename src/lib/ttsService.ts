// export const getSaharaSpeech = async (text: string, languageCode: string = 'en-US'): Promise<Blob | null> => {
//   try {
//     // Google TTS API (free, limited to 100 requests per day)
//     const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY || '';

//     if (!apiKey) {
//       console.warn('No Google TTS API key found');
//       return null;
//     }

//     const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

//     // Map language codes to Google TTS voice names
//     const voiceMap: Record<string, { languageCode: string, name: string }> = {
//       'en-US': { languageCode: 'en-US', name: 'en-US-Neural2-J' },
//       'hi-IN': { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-A' },
//       'mr-IN': { languageCode: 'mr-IN', name: 'mr-IN-Wavenet-A' },
//       'bn-IN': { languageCode: 'bn-IN', name: 'bn-IN-Wavenet-A' },
//       'ta-IN': { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-A' },
//       'te-IN': { languageCode: 'te-IN', name: 'te-IN-Wavenet-A' },
//       'gu-IN': { languageCode: 'gu-IN', name: 'gu-IN-Wavenet-A' },
//       'kn-IN': { languageCode: 'kn-IN', name: 'kn-IN-Wavenet-A' },
//       'ml-IN': { languageCode: 'ml-IN', name: 'ml-IN-Wavenet-A' },
//       'pa-IN': { languageCode: 'pa-IN', name: 'pa-IN-Wavenet-A' },
//     };

//     const voiceConfig = voiceMap[languageCode] || { languageCode: 'en-US', name: 'en-US-Neural2-J' };

//     const requestBody = {
//       input: { text },
//       voice: voiceConfig,
//       audioConfig: {
//         audioEncoding: 'MP3',
//         speakingRate: 1.0,
//         pitch: 0,
//         volumeGainDb: 0
//       }
//     };

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//       const error = await response.text();
//       console.error('Google TTS error:', error);
//       return null;
//     }

//     const data = await response.json();

//     // Convert base64 to blob
//     const audioContent = data.audioContent;
//     const byteCharacters = atob(audioContent);
//     const byteNumbers = new Array(byteCharacters.length);

//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }

//     const byteArray = new Uint8Array(byteNumbers);
//     const blob = new Blob([byteArray], { type: 'audio/mp3' });

//     return blob;

//   } catch (error) {
//     console.error('Google TTS failed:', error);
//     return null;
//   }
// };



// Enhanced TTS service with better voice matching

// Voice database for Indian languages with browser-specific names
const VOICE_DATABASE = [
  // Hindi
  { lang: 'hi-IN', names: ['Google हिन्दी', 'Microsoft Hemant', 'Microsoft Kalpana', 'Microsoft Heera', 'Hindi India', 'hi-IN'], rate: 0.9, pitch: 1.0 },
  // Gujarati
  { lang: 'gu-IN', names: ['Google ગુજરાતી', 'Microsoft Kalpana', 'Microsoft Dhwani', 'Gujarati India', 'gu-IN'], rate: 0.85, pitch: 1.0 },
  // Marathi
  { lang: 'mr-IN', names: ['Google मराठी', 'Microsoft Kalpana', 'Marathi India', 'mr-IN'], rate: 0.85, pitch: 1.0 },
  // Tamil
  { lang: 'ta-IN', names: ['Google தமிழ்', 'Microsoft Valluvar', 'Tamil India', 'ta-IN'], rate: 0.9, pitch: 1.0 },
  // Telugu
  { lang: 'te-IN', names: ['Google తెలుగు', 'Microsoft Vishnu', 'Telugu India', 'te-IN'], rate: 0.9, pitch: 1.0 },
  // Bengali
  { lang: 'bn-IN', names: ['Google বাংলা', 'Microsoft Hemant', 'Bengali India', 'bn-IN'], rate: 0.9, pitch: 1.0 },
  // Kannada
  { lang: 'kn-IN', names: ['Google ಕನ್ನಡ', 'Microsoft Valluvar', 'Kannada India', 'kn-IN'], rate: 0.9, pitch: 1.0 },
  // Malayalam
  { lang: 'ml-IN', names: ['Google മലയാളം', 'Malayalam India', 'ml-IN'], rate: 0.9, pitch: 1.0 },
  // Punjabi
  { lang: 'pa-IN', names: ['Google ਪੰਜਾਬੀ', 'Punjabi India', 'pa-IN'], rate: 0.9, pitch: 1.0 },
  // English
  { lang: 'en-US', names: ['Google US English', 'Microsoft Zira', 'Samantha', 'Alex', 'Victoria', 'en-US'], rate: 1.0, pitch: 1.0 },
  { lang: 'en-GB', names: ['Google UK English', 'Microsoft Hazel', 'Daniel', 'Serena', 'en-GB'], rate: 1.0, pitch: 1.0 },
  { lang: 'en-IN', names: ['Google India English', 'Microsoft Heera', 'Rishi', 'Veena', 'en-IN'], rate: 1.0, pitch: 1.0 },
];

let isSpeaking = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Get the best voice for a language
 */
const findBestVoice = (languageCode: string): SpeechSynthesisVoice | null => {
  if (!window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const langOnly = languageCode.split('-')[0].toLowerCase();
  const regionOnly = languageCode.split('-')[1]?.toLowerCase();

  console.log(`🎤 Searching voice for: ${languageCode} (${langOnly})`);

  // 1. Try to match names from our database first (higher quality matching)
  const dbConfig = VOICE_DATABASE.find(v => v.lang.toLowerCase() === languageCode.toLowerCase() || v.lang.toLowerCase().startsWith(langOnly));
  if (dbConfig) {
    for (const voiceName of dbConfig.names) {
      const voice = voices.find(v =>
        v.name.toLowerCase().includes(voiceName.toLowerCase()) ||
        v.lang.toLowerCase().replace('_', '-') === languageCode.toLowerCase()
      );
      if (voice) {
        console.log(`🎤 Found database match: ${voice.name} (${voice.lang})`);
        return voice;
      }
    }
  }

  // 2. Try exact language match with normalized locale
  let voice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === languageCode.toLowerCase());
  if (voice) {
    console.log(`🎤 Found exact lang match: ${voice.name} (${voice.lang})`);
    return voice;
  }

  // 3. Try matches starting with the same language code (e.g., 'hi-')
  voice = voices.find(v => v.lang.toLowerCase().startsWith(langOnly + '-') || v.lang.toLowerCase().startsWith(langOnly + '_'));
  if (voice) {
    console.log(`🎤 Found language-region match: ${voice.name} (${voice.lang})`);
    return voice;
  }

  // 4. Try matching name with language keywords
  const langKeywords: Record<string, string[]> = {
    'hi': ['hindi', 'हिन्दी', 'india'],
    'gu': ['gujarati', 'ગુજરાતી', 'india'],
    'mr': ['marathi', 'मराठी', 'india'],
    'ta': ['tamil', 'தமிழ்', 'india'],
    'te': ['telugu', 'తెలుగు', 'india'],
    'bn': ['bengali', 'বাংলা', 'india'],
    'kn': ['kannada', 'ಕನ್ನಡ', 'india'],
    'ml': ['malayalam', 'മലയാളം', 'india'],
    'pa': ['punjabi', 'ਪੰਜਾਬੀ', 'india'],
  };

  const keywords = langKeywords[langOnly];
  if (keywords) {
    voice = voices.find(v =>
      keywords.some(kw => v.name.toLowerCase().includes(kw))
    );
    if (voice) {
      console.log(`🎤 Found keyword match: ${voice.name} (${voice.lang})`);
      return voice;
    }
  }

  // 5. Try just the language part (e.g., 'hi')
  voice = voices.find(v => v.lang.toLowerCase() === langOnly);
  if (voice) {
    console.log(`🎤 Found base language match: ${voice.name} (${voice.lang})`);
    return voice;
  }

  // 6. Last fallback: default English
  voice = voices.find(v => v.lang.startsWith('en-'));
  if (voice) {
    console.log(`🎤 Final fallback: ${voice.name} (${voice.lang})`);
    return voice;
  }

  return voices[0] || null;
};

/**
 * Cancel current speech
 */
export const cancelSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    currentUtterance = null;
  }
};

/**
 * Initialize voices
 */
export const initializeVoices = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      console.warn('🎤 Web Speech API not available');
      resolve();
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      console.log(`🎤 Voices already loaded: ${voices.length}`);
      resolve();
      return;
    }

    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      console.log(`🎤 Voices loaded: ${loadedVoices.length}`);
      resolve();
    };

    // Timeout fallback
    setTimeout(resolve, 1000);
  });
};

/**
 * Speak text with proper language voice
 */
export const speakText = async (
  text: string,
  languageCode: string = 'en-US'
): Promise<boolean> => {
  try {
    console.log('🎤 Speak request:', {
      text: text.substring(0, 50),
      languageCode,
      length: text.length
    });

    // Cancel any ongoing speech
    cancelSpeech();

    // Initialize voices if needed
    await initializeVoices();

    // Create utterance
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = languageCode;

    // Find and set voice
    const voice = findBestVoice(languageCode);
    if (voice) {
      currentUtterance.voice = voice;
    }

    // Set speech parameters based on language
    if (languageCode.endsWith('-IN')) {
      currentUtterance.rate = 0.9; // Slightly slower for Indian languages
      currentUtterance.pitch = 1.0;
    } else {
      currentUtterance.rate = 1.0;
      currentUtterance.pitch = 1.0;
    }
    currentUtterance.volume = 1.0;

    // Event handlers
    return new Promise((resolve) => {
      currentUtterance!.onstart = () => {
        console.log('🎤 Speech started');
        isSpeaking = true;
      };

      currentUtterance!.onend = () => {
        console.log('🎤 Speech ended');
        isSpeaking = false;
        currentUtterance = null;
        resolve(true);
      };

      currentUtterance!.onerror = (event) => {
        console.error('🎤 Speech error:', event);
        isSpeaking = false;
        currentUtterance = null;
        resolve(false);
      };

      // Start speaking
      window.speechSynthesis.speak(currentUtterance!);
    });

  } catch (error) {
    console.error('🎤 TTS error:', error);
    isSpeaking = false;
    currentUtterance = null;
    return false;
  }
};

// Legacy function for compatibility
export const getSaharaSpeech = async (text: string, languageCode: string = 'en-US'): Promise<boolean> => {
  return speakText(text, languageCode);
};
