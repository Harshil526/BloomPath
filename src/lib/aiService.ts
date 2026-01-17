
import { GoogleGenerativeAI } from "@google/generative-ai";
import { detectLanguage } from './languageDetection';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

// Simple, unified system instruction that tells AI to detect and match user's language
const SYSTEM_INSTRUCTION = `You are Sahara, a helpful AI assistant for BloomPath platform.

CRITICAL RULES:
1. ALWAYS respond in the EXACT SAME LANGUAGE that the user speaks in.
2. If the user speaks in Hindi, respond in Hindi.
3. If the user speaks in Gujarati, respond in Gujarati.
4. If the user speaks in English, respond in English.
5. Match the user's tone and language style exactly.
6. Do NOT translate the user's message to another language.
7. Keep responses natural, conversational, and helpful.

LANGUAGE EXAMPLES:
- User: "नमस्ते, आप कैसे हैं?" → You: "नमस्ते! मैं ठीक हूँ, धन्यवाद। आपका दिन कैसा चल रहा है?"
- User: "Hello, how are you?" → You: "Hello! I'm good, thank you. How is your day going?"
- User: "હેલો, તમે કેમ છો?" → You: "હેલો! હું સારી છું, આભાર. તમારો દિવસ કેમ ચાલી રહ્યો છે?"

SPECIAL COMMANDS:
- If user wants to change name, add: [UPDATE_NAME: NewName] at the end of your response.
- Do NOT mention this format to the user.

Be helpful, friendly, and professional.`;

export const getSaharaResponse = async (
    userPrompt: string,
    history: { role: "user" | "model"; parts: { text: string }[] }[] = [],
    userName?: string,
    currentUILanguage?: string
) => {
    try {
        if (!API_KEY) {
            return "I'm Sahara! Please add a Gemini API key to my environment so I can help you better.";
        }

        console.log('🤖 AI Service - User prompt:', userPrompt.substring(0, 100));
        console.log('🤖 AI Service - UI Language:', currentUILanguage);

        // Detect language from user's input
        const detected = detectLanguage(userPrompt);
        console.log('🤖 AI Service - Detected language:', detected.language, detected.code);

        // Add context about detected language to prompt
        const contextPrompt = `User's message (detected as ${detected.language}): "${userPrompt}"
User's name: ${userName || 'Not provided'}
Current UI language: ${currentUILanguage || 'Not set'}

Important: Respond in ${detected.language}. Match the user's language exactly.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION,
            generationConfig: {
                temperature: 0.8, // More creative for language matching
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 500,
            },
        });

        // Use history as is if it's already formatted, but ensured roles are correct
        const formattedHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' as const : 'model' as const,
            parts: msg.parts
        }));

        // Start chat
        const chat = model.startChat({
            history: formattedHistory.slice(-4),
        });

        const result = await chat.sendMessage(contextPrompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ AI Service - Response:', text.substring(0, 150));
        console.log('✅ AI Service - Response length:', text.length);

        return text;

    } catch (error: any) {
        console.error("❌ Gemini AI Error:", error);

        // Fallback in multiple languages
        const fallbacks = [
            "I understand you're asking something. Could you please rephrase it?",
            "मुझे लगता है आप कुछ पूछ रहे हैं। क्या आप इसे दोबारा कह सकते हैं?",
            "મને લાગે છે કે તમે કંઈક પૂછી રહ્યાં છો. શું તમે તે ફરીથી કહી શકો છો?",
            "मला वाटते तुम्ही काहीतरी विचारत आहात. तुम्ही ते पुन्हा सांगू शकता का?"
        ];

        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
};
