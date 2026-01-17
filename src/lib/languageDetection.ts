
/**
 * Language detection service
 * Detects language from user input and maps to supported languages
 */

// Map of language detection patterns
const LANGUAGE_PATTERNS = [
    // Hindi patterns
    {
        patterns: [/[\u0900-\u097F]/u, /[\u0930-\u0939]/u, /हिंदी/, /हिन्दी/],
        language: 'Hindi (हिन्दी)',
        code: 'hi-IN'
    },
    // Gujarati patterns
    {
        patterns: [/[\u0A80-\u0AFF]/u, /ગુજરાતી/],
        language: 'Gujarati (ગુજરાતી)',
        code: 'gu-IN'
    },
    // Marathi patterns
    {
        patterns: [/मराठी/, /[\u0900-\u097F]/u],
        language: 'Marathi (मराठी)',
        code: 'mr-IN'
    },
    // Tamil patterns
    {
        patterns: [/[\u0B80-\u0BFF]/u, /தமிழ்/],
        language: 'Tamil (தமிழ்)',
        code: 'ta-IN'
    },
    // Telugu patterns
    {
        patterns: [/[\u0C00-\u0C7F]/u, /తెలుగు/],
        language: 'Telugu (తెలుగు)',
        code: 'te-IN'
    },
    // Bengali patterns
    {
        patterns: [/[\u0980-\u09FF]/u, /বাংলা/],
        language: 'Bengali (বাংলা)',
        code: 'bn-IN'
    },
    // Kannada patterns
    {
        patterns: [/[\u0C80-\u0CFF]/u, /ಕನ್ನಡ/],
        language: 'Kannada (ಕನ್ನಡ)',
        code: 'kn-IN'
    },
    // Malayalam patterns
    {
        patterns: [/[\u0D00-\u0D7F]/u, /മലയാളം/],
        language: 'Malayalam (മലയാളം)',
        code: 'ml-IN'
    },
    // Punjabi patterns
    {
        patterns: [/[\u0A00-\u0A7F]/u, /ਪੰਜਾਬੀ/],
        language: 'Punjabi (ਪੰਜਾਬੀ)',
        code: 'pa-IN'
    },
    // English patterns (default)
    {
        patterns: [/^[A-Za-z\s]+$/, /hello/i, /hi/i, /how/i, /what/i, /where/i, /why/i, /when/i],
        language: 'English',
        code: 'en-US'
    }
];

// English words for detection
const ENGLISH_WORDS = [
    'hello', 'hi', 'how', 'what', 'where', 'why', 'when', 'name', 'help',
    'assistant', 'sahara', 'please', 'thank', 'good', 'morning', 'evening',
    'afternoon', 'night', 'today', 'tomorrow', 'yesterday', 'work', 'job',
    'help', 'assist', 'question', 'answer', 'tell', 'explain', 'understand'
];

/**
 * Detects language from text input
 */
export const detectLanguage = (text: string): { language: string; code: string } => {
    const cleanText = text.trim().toLowerCase();

    // Check for Indian languages first
    for (const lang of LANGUAGE_PATTERNS) {
        // Skip English for now
        if (lang.language === 'English') continue;

        for (const pattern of lang.patterns) {
            if (pattern.test(text)) {
                console.log(`🗣️ Detected language: ${lang.language} from pattern`);
                return { language: lang.language, code: lang.code };
            }
        }
    }

    // Check for English
    const hasEnglishWords = ENGLISH_WORDS.some(word =>
        cleanText.includes(word) ||
        cleanText.split(/\s+/).some(wordInText => wordInText === word)
    );

    if (hasEnglishWords || /^[A-Za-z\s.,!?]+$/.test(text)) {
        console.log('🗣️ Detected language: English');
        return { language: 'English', code: 'en-US' };
    }

    // Default to current UI language or English
    console.log('🗣️ Defaulting to English');
    return { language: 'English', code: 'en-US' };
};

/**
 * Get language from code
 */
export const getLanguageFromCode = (code: string) => {
    const lang = LANGUAGE_PATTERNS.find(l => l.code === code);
    return lang || LANGUAGE_PATTERNS[LANGUAGE_PATTERNS.length - 1]; // Return English as default
};