// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Mic, MicOff, X, Volume2, VolumeX, MessageSquare, Sparkles } from 'lucide-react';
// import { useAppStore } from '@/store/appStore';
// import { getSaharaResponse } from '@/lib/aiService';
// import { getSaharaSpeech } from '@/lib/ttsService';
// import { Button } from './ui/button';
// import { Card } from './ui/card';
// import { ScrollArea } from './ui/scroll-area';
// import { toast } from 'sonner';

// // genAI initialization removed, using aiService

// interface Message {
//     role: 'user' | 'assistant';
//     content: string;
// }

// const SUPPORTED_LANGUAGES = [
//     { name: 'English', code: 'en-US', ttsCode: 'en-US' },
//     { name: 'Hindi (हिन्दी)', code: 'hi-IN', ttsCode: 'hi-IN' },
//     { name: 'Marathi (मराठी)', code: 'mr-IN', ttsCode: 'mr-IN' },
//     { name: 'Gujarati (ગુજરાતી)', code: 'gu-IN', ttsCode: 'gu-IN' },
//     { name: 'Tamil (தமிழ்)', code: 'ta-IN', ttsCode: 'ta-IN' },
//     { name: 'Telugu (తెలుగు)', code: 'te-IN', ttsCode: 'te-IN' },
//     { name: 'Bengali (বাংলা)', code: 'bn-IN', ttsCode: 'bn-IN' },
//     { name: 'Kannada (ಕನ್ನಡ)', code: 'kn-IN', ttsCode: 'kn-IN' },
//     { name: 'Malayalam (മലയാളം)', code: 'ml-IN', ttsCode: 'ml-IN' },
//     { name: 'Punjabi (ਪੰਜਾਬੀ)', code: 'pa-IN', ttsCode: 'pa-IN' },
// ];

// export const SaharaAssistant = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isListening, setIsListening] = useState(false);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [transcript, setTranscript] = useState('');
//     const [isMuted, setIsMuted] = useState(false);
//     const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0]);

//     const { currentWorker, updateWorkerName } = useAppStore();
//     const recognitionRef = useRef<any>(null);
//     const audioRef = useRef<HTMLAudioElement | null>(null);
//     const scrollRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         // Initialize Speech Recognition
//         const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//         if (SpeechRecognition) {
//             recognitionRef.current = new SpeechRecognition();
//             recognitionRef.current.continuous = true;
//             recognitionRef.current.interimResults = true;
//             recognitionRef.current.lang = language.code;

//             recognitionRef.current.onresult = (event: any) => {
//                 let interimTranscript = '';
//                 let finalTranscript = '';

//                 for (let i = event.resultIndex; i < event.results.length; ++i) {
//                     if (event.results[i].isFinal) {
//                         finalTranscript += event.results[i][0].transcript;
//                     } else {
//                         interimTranscript += event.results[i][0].transcript;
//                     }
//                 }

//                 setTranscript(finalTranscript || interimTranscript);

//                 if (finalTranscript) {
//                     handleUserMessage(finalTranscript);
//                     stopListening();
//                 }
//             };

//             recognitionRef.current.onerror = (event: any) => {
//                 console.error('Speech recognition error:', event.error);
//                 setIsListening(false);
//                 toast.error('An error occurred with speech recognition. Please try again.');
//             };
//         }

//         // Setup audio element
//         audioRef.current = new Audio();
//         audioRef.current.onplay = () => setIsSpeaking(true);
//         audioRef.current.onended = () => {
//             setIsSpeaking(false);
//             if (audioRef.current?.src) {
//                 URL.revokeObjectURL(audioRef.current.src); // Clean up blob URL
//             }
//         };

//         return () => {
//             // Cleanup audio element and recognition
//             if (audioRef.current) {
//                 audioRef.current.pause();
//                 audioRef.current = null;
//             }
//             if (recognitionRef.current) {
//                 recognitionRef.current.stop();
//             }
//         }
//     }, [language]);

//     useEffect(() => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//         }
//     }, [messages]);

//     const toggleAssistant = () => {
//         setIsOpen(!isOpen);
//         if (!isOpen && messages.length === 0) {
//             let initialGreeting = `Hello ${currentWorker?.name || 'there'}! I'm Sahara, your AI assistant. How can I help you today?`;

//             // Adjust greeting for Hindi if selected
//             if (language.code === 'hi-IN') {
//                 initialGreeting = `Namaste ${currentWorker?.name || ''}! Main Sahara hoon, aapki AI sahayak. Aaj main aapki kaise madad kar sakti hoon?`;
//             } else if (language.code === 'mr-IN') {
//                 initialGreeting = `Namaskar ${currentWorker?.name || ''}! Mi Sahara aahe, tumchi AI sahayyak. Aaj mi tumhala kashi mader karu shakto?`;
//             }

//             const initialMessage: Message = { role: 'assistant', content: initialGreeting };
//             setMessages([initialMessage]);
//             speak(initialGreeting);
//         }
//     };

//     const startListening = () => {
//         if (recognitionRef.current) {
//             setIsListening(true);
//             recognitionRef.current.start();
//         } else {
//             toast.error('Your browser does not support voice recognition.');
//         }
//     };

//     const stopListening = () => {
//         if (recognitionRef.current) {
//             recognitionRef.current.stop();
//             setIsListening(false);
//         }
//     };

//     const speak = async (text: string) => {
//         if (isMuted || !audioRef.current) return;

//         // Stop any currently playing audio
//         audioRef.current.pause();

//         const audioBlob = await getSaharaSpeech(text, language.ttsCode);

//         if (audioBlob) {
//             const audioUrl = URL.createObjectURL(audioBlob);
//             audioRef.current.src = audioUrl;
//             audioRef.current.play();
//         }
//         // If audioBlob is null, a warning toast is already shown by the service.
//     };

//     const handleUserMessage = async (text: string) => {
//         const newUserMessage: Message = { role: 'user', content: text };
//         setMessages(prev => [...prev, newUserMessage]);
//         setTranscript('');

//         try {
//             // Integration Layer for local intents
//             if (text.toLowerCase().includes('mera naam') && (text.toLowerCase().includes('badlo') || text.toLowerCase().includes('change'))) {
//                 const nameMatch = text.match(/(?:mera naam|name is)\s+([A-Za-z\s]+)/i);
//                 if (nameMatch && nameMatch[1]) {
//                     const newName = nameMatch[1].trim();
//                     updateWorkerName(newName);
//                     const response = `Okay, I've updated your name to ${newName}.`;
//                     const assistantMsg: Message = { role: 'assistant', content: response };
//                     setMessages(prev => [...prev, assistantMsg]);
//                     speak(response);
//                     return;
//                 }
//             }

//             // Sahara AI call using centralized service
//             const history = messages.map(m => ({
//                 role: m.role === 'user' ? 'user' as const : 'model' as const,
//                 parts: [{ text: m.content }]
//             }));

//             const responseText = await getSaharaResponse(text, history, currentWorker?.name, language.name);

//             // Check for UPDATE_NAME intent in the response
//             if (responseText.includes('[UPDATE_NAME:')) {
//                 const nameMatch = responseText.match(/\[UPDATE_NAME:\s*([^\]]+)\]/);
//                 if (nameMatch && nameMatch[1]) {
//                     const newName = nameMatch[1].trim();
//                     updateWorkerName(newName);
//                     toast.success(`Name updated to: ${newName}`);
//                 }
//             }

//             const cleanResponse = responseText.replace(/\[UPDATE_NAME:[^\]]+\]/g, '').trim();
//             const assistantMessage: Message = { role: 'assistant', content: cleanResponse };
//             setMessages(prev => [...prev, assistantMessage]);
//             speak(cleanResponse);

//         } catch (error) {
//             console.error('Sahara error:', error);
//             const fallback = "I'm sorry, my network is a bit slow right now. Could you please repeat that?";
//             setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
//             speak(fallback);
//         }
//     };

//     return (
//         <div className="fixed bottom-6 right-6 z-50">
//             <AnimatePresence>
//                 {isOpen && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 20, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: 20, scale: 0.95 }}
//                         className="mb-4"
//                     >
//                         <Card className="w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm">
//                             <div className="p-4 border-b flex items-center justify-between bg-primary/5 rounded-t-lg">
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
//                                         <Sparkles size={18} />
//                                     </div>
//                                     <div>
//                                         <h3 className="font-bold text-sm">Sahara</h3>
//                                         <p className="text-[10px] text-muted-foreground leading-tight">Your AI Assistant & Counselor</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-1">
//                                     <select
//                                         className="text-[10px] bg-transparent border border-primary/20 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-primary/30 mr-1"
//                                         value={language.code}
//                                         onChange={(e) => {
//                                             const lang = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value);
//                                             if (lang) {
//                                                 setLanguage(lang);
//                                                 toast.success(`Language changed to ${lang.name}`);
//                                             }
//                                         }}
//                                     >
//                                         {SUPPORTED_LANGUAGES.map(lang => (
//                                             <option key={lang.code} value={lang.code}>{lang.name}</option>
//                                         ))}
//                                     </select>
//                                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMuted(!isMuted)}>
//                                         {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
//                                     </Button>
//                                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleAssistant}>
//                                         <X size={16} />
//                                     </Button>
//                                 </div>
//                             </div>

//                             <ScrollArea className="flex-1 p-4" ref={scrollRef}>
//                                 <div className="space-y-4">
//                                     {messages.map((msg, i) => (
//                                         <div
//                                             key={i}
//                                             className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                                         >
//                                             <div
//                                                 className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
//                                                     ? 'bg-primary text-primary-foreground rounded-tr-none'
//                                                     : 'bg-muted rounded-tl-none'
//                                                     }`}
//                                             >
//                                                 {msg.content}
//                                             </div>
//                                         </div>
//                                     ))}
//                                     {isListening && transcript && (
//                                         <div className="flex justify-end">
//                                             <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-primary/20 italic rounded-tr-none">
//                                                 {transcript}...
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </ScrollArea>

//                             <div className="p-4 border-t bg-background">
//                                 <div className="flex items-center gap-2">
//                                     <div className="flex-1 relative">
//                                         <input
//                                             type="text"
//                                             placeholder="Say or type something..."
//                                             className="w-full h-10 px-4 py-2 rounded-full bg-muted border-none text-sm focus:ring-2 focus:ring-primary/50"
//                                             onKeyDown={(e) => {
//                                                 if (e.key === 'Enter' && e.currentTarget.value) {
//                                                     handleUserMessage(e.currentTarget.value);
//                                                     e.currentTarget.value = '';
//                                                 }
//                                             }}
//                                         />
//                                     </div>
//                                     <Button
//                                         size="icon"
//                                         className={`h-12 w-12 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary'
//                                             }`}
//                                         onClick={isListening ? stopListening : startListening}
//                                     >
//                                         {isListening ? <Mic size={24} /> : <Mic size={24} />}
//                                     </Button>
//                                 </div>
//                                 {isListening && (
//                                     <p className="text-[10px] text-center mt-2 text-primary animate-pulse font-medium">
//                                         Sahara is listening...
//                                     </p>
//                                 )}
//                             </div>
//                         </Card>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleAssistant}
//                 className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-colors ${isOpen ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
//                     }`}
//             >
//                 {isOpen ? (
//                     <X size={32} />
//                 ) : (
//                     <div className="relative">
//                         <MessageSquare size={32} />
//                         <motion.div
//                             animate={{ scale: [1, 1.2, 1] }}
//                             transition={{ repeat: Infinity, duration: 2 }}
//                             className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-primary"
//                         />
//                     </div>
//                 )}
//             </motion.button>
//         </div>
//     );
// };





// import { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Mic, MicOff, X, Volume2, VolumeX, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
// import { useAppStore } from '@/store/appStore';
// import { getSaharaResponse } from '@/lib/aiService';
// import { getSaharaSpeech } from '@/lib/ttsService';
// import { Button } from './ui/button';
// import { Card } from './ui/card';
// import { ScrollArea } from './ui/scroll-area';
// import { toast } from 'sonner';

// interface Message {
//     id: string;
//     role: 'user' | 'assistant';
//     content: string;
//     timestamp: Date;
// }

// const SUPPORTED_LANGUAGES = [
//     { name: 'English', code: 'en-US', ttsCode: 'en-US', greeting: 'Hello' },
//     { name: 'Hindi (हिन्दी)', code: 'hi-IN', ttsCode: 'hi-IN', greeting: 'नमस्ते' },
//     { name: 'Marathi (मराठी)', code: 'mr-IN', ttsCode: 'mr-IN', greeting: 'नमस्कार' },
//     { name: 'Gujarati (ગુજરાતી)', code: 'gu-IN', ttsCode: 'gu-IN', greeting: 'નમસ્તે' },
//     { name: 'Tamil (தமிழ்)', code: 'ta-IN', ttsCode: 'ta-IN', greeting: 'வணக்கம்' },
//     { name: 'Telugu (తెలుగు)', code: 'te-IN', ttsCode: 'te-IN', greeting: 'నమస్కారం' },
//     { name: 'Bengali (বাংলা)', code: 'bn-IN', ttsCode: 'bn-IN', greeting: 'নমস্কার' },
//     { name: 'Kannada (ಕನ್ನಡ)', code: 'kn-IN', ttsCode: 'kn-IN', greeting: 'ನಮಸ್ಕಾರ' },
//     { name: 'Malayalam (മലയാളം)', code: 'ml-IN', ttsCode: 'ml-IN', greeting: 'നമസ്കാരം' },
//     { name: 'Punjabi (ਪੰਜਾਬੀ)', code: 'pa-IN', ttsCode: 'pa-IN', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ' },
// ];

// export const SaharaAssistant = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isListening, setIsListening] = useState(false);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [transcript, setTranscript] = useState('');
//     const [isMuted, setIsMuted] = useState(false);
//     const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0]);
//     const [inputText, setInputText] = useState('');

//     const { currentWorker, updateWorkerName } = useAppStore();
//     const recognitionRef = useRef<any>(null);
//     const audioRef = useRef<HTMLAudioElement | null>(null);
//     const scrollRef = useRef<HTMLDivElement>(null);
//     const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

//     // Initialize Web Speech API for fallback TTS
//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             // Check if Web Speech API is available
//             if ('speechSynthesis' in window) {
//                 // Load voices when they become available
//                 const loadVoices = () => {
//                     const voices = window.speechSynthesis.getVoices();
//                     console.log('Available Web Speech voices:', voices.length);
//                 };

//                 window.speechSynthesis.onvoiceschanged = loadVoices;
//                 loadVoices();
//             } else {
//                 console.warn('Web Speech API not supported in this browser');
//             }
//         }
//     }, []);

//     // Initialize speech recognition
//     useEffect(() => {
//         const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

//         if (SpeechRecognition) {
//             try {
//                 recognitionRef.current = new SpeechRecognition();
//                 recognitionRef.current.continuous = false;
//                 recognitionRef.current.interimResults = true;
//                 recognitionRef.current.lang = language.code;

//                 recognitionRef.current.onresult = (event: any) => {
//                     let interimTranscript = '';
//                     let finalTranscript = '';

//                     for (let i = event.resultIndex; i < event.results.length; i++) {
//                         const transcript = event.results[i][0].transcript;
//                         if (event.results[i].isFinal) {
//                             finalTranscript += transcript;
//                         } else {
//                             interimTranscript += transcript;
//                         }
//                     }

//                     setTranscript(finalTranscript || interimTranscript);

//                     if (finalTranscript) {
//                         handleUserMessage(finalTranscript);
//                     }
//                 };

//                 recognitionRef.current.onend = () => {
//                     setIsListening(false);
//                     setTranscript('');
//                 };

//                 recognitionRef.current.onerror = (event: any) => {
//                     console.error('Speech recognition error:', event.error);
//                     setIsListening(false);

//                     if (event.error === 'no-speech') {
//                         toast.info('No speech detected. Please try again.');
//                     } else if (event.error === 'audio-capture') {
//                         toast.error('No microphone found. Please check your microphone.');
//                     } else if (event.error === 'not-allowed') {
//                         toast.error('Microphone access denied. Please allow microphone access.');
//                     } else {
//                         toast.error('Speech recognition failed. Please try again.');
//                     }
//                 };
//             } catch (error) {
//                 console.error('Failed to initialize speech recognition:', error);
//                 toast.error('Speech recognition not supported in your browser.');
//             }
//         } else {
//             console.warn('Speech Recognition API not available');
//         }

//         // Initialize audio element
//         audioRef.current = new Audio();
//         audioRef.current.onplay = () => setIsSpeaking(true);
//         audioRef.current.onended = () => {
//             setIsSpeaking(false);
//             if (audioRef.current?.src) {
//                 URL.revokeObjectURL(audioRef.current.src);
//             }
//         };
//         audioRef.current.onerror = () => {
//             setIsSpeaking(false);
//             toast.error('Failed to play audio');
//         };

//         return () => {
//             if (recognitionRef.current) {
//                 recognitionRef.current.stop();
//             }
//             if (audioRef.current) {
//                 audioRef.current.pause();
//                 audioRef.current = null;
//             }
//             if (speechSynthesisRef.current && window.speechSynthesis) {
//                 window.speechSynthesis.cancel();
//             }
//         };
//     }, [language.code]);

//     // Auto-scroll to bottom when messages change
//     useEffect(() => {
//         if (scrollRef.current) {
//             const scrollArea = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
//             if (scrollArea) {
//                 scrollArea.scrollTop = scrollArea.scrollHeight;
//             }
//         }
//     }, [messages, transcript]);

//     const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

//     // Get greeting based on language
//     const getGreeting = useCallback((userName?: string) => {
//         const greetings: Record<string, string> = {
//             'en-US': `Hello ${userName || 'there'}! I'm Sahara, your AI assistant. How can I help you today?`,
//             'hi-IN': `नमस्ते ${userName ? userName + ' जी' : ''}! मैं सहारा हूं, आपकी एआई सहायक। आज मैं आपकी कैसे मदद कर सकती हूं?`,
//             'mr-IN': `नमस्कार ${userName ? userName + 'साहेब' : ''}! मी सहारा आहे, तुमची एआई सहाय्यक. आज मी तुम्हाला कशी मदत करू शकते?`,
//             'gu-IN': `નમસ્તે ${userName ? userName + ' ભાઈ' : ''}! હું સહારા છું, તમારી એઆઈ સહાયક. આજે હું તમારી કેવી રીતે સહાય કરી શકું?`,
//             'ta-IN': `வணக்கம் ${userName ? userName : ''}! நான் சஹாரா, உங்கள் AI உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?`,
//             'te-IN': `నమస్కారం ${userName ? userName + ' గారు' : ''}! నేను సహారా, మీ AI సహాయకురాలు. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?`,
//             'bn-IN': `নমস্কার ${userName ? userName + ' বাবু' : ''}! আমি সাহারা, আপনার এআই সহায়িকা। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?`,
//             'kn-IN': `ನಮಸ್ಕಾರ ${userName ? userName + ' ಅವರೇ' : ''}! ನಾನು ಸಹಾರಾ, ನಿಮ್ಮ AI ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`,
//             'ml-IN': `നമസ്കാരം ${userName ? userName + ' സാർ' : ''}! ഞാൻ സഹാര, നിങ്ങളുടെ AI സഹായി. ഇന്ന് എങ്ങനെയാണ് ഞാൻ നിങ്ങളെ സഹായിക്കുക?`,
//             'pa-IN': `ਸਤ ਸ੍ਰੀ ਅਕਾਲ ${userName ? userName + ' ਜੀ' : ''}! ਮੈਂ ਸਹਾਰਾ ਹਾਂ, ਤੁਹਾਡੀ ਏਆਈ ਸਹਾਇਕ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?`,
//         };

//         return greetings[language.code] || greetings['en-US'];
//     }, [language.code]);

//     const toggleAssistant = () => {
//         setIsOpen(!isOpen);
//         if (!isOpen && messages.length === 0) {
//             const userName = currentWorker?.name;
//             const greeting = getGreeting(userName);

//             const initialMessage: Message = {
//                 id: generateId(),
//                 role: 'assistant',
//                 content: greeting,
//                 timestamp: new Date()
//             };

//             setMessages([initialMessage]);
//             speak(greeting);
//         }
//     };

//     const startListening = () => {
//         if (!recognitionRef.current) {
//             toast.error('Speech recognition is not available in your browser.');
//             return;
//         }

//         if (isSpeaking) {
//             stopSpeaking();
//         }

//         setIsListening(true);
//         setTranscript('');

//         try {
//             recognitionRef.current.start();
//         } catch (error) {
//             console.error('Failed to start speech recognition:', error);
//             setIsListening(false);
//             toast.error('Failed to start microphone. Please check permissions.');
//         }
//     };

//     const stopListening = () => {
//         if (recognitionRef.current && isListening) {
//             recognitionRef.current.stop();
//         }
//         setIsListening(false);
//     };

//     const speak = async (text: string) => {
//         if (isMuted || !text.trim()) return;

//         // Stop any ongoing speech
//         stopSpeaking();

//         console.log('Attempting to speak:', text.substring(0, 50) + '...');

//         try {
//             // Try backend TTS first
//             const audioBlob = await getSaharaSpeech(text, language.ttsCode);

//             if (audioBlob) {
//                 console.log('Backend TTS successful, blob size:', audioBlob.size);

//                 if (audioRef.current) {
//                     const audioUrl = URL.createObjectURL(audioBlob);
//                     audioRef.current.src = audioUrl;

//                     try {
//                         await audioRef.current.play();
//                         console.log('Audio playback started');
//                     } catch (playError) {
//                         console.error('Audio playback failed:', playError);
//                         setIsSpeaking(false);

//                         // Fallback to Web Speech API
//                         fallbackWebSpeech(text);
//                     }
//                 }
//             } else {
//                 // If no blob returned (backend might be down), use Web Speech API
//                 console.log('Using Web Speech API fallback');
//                 fallbackWebSpeech(text);
//             }
//         } catch (error) {
//             console.error('TTS failed:', error);
//             fallbackWebSpeech(text);
//         }
//     };

//     const fallbackWebSpeech = (text: string) => {
//         if (!('speechSynthesis' in window)) {
//             toast.warning('Voice not available. Text-to-speech requires a supported browser.');
//             return;
//         }

//         // Cancel any ongoing speech
//         window.speechSynthesis.cancel();

//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = language.code;
//         utterance.rate = 1.0;
//         utterance.pitch = 1.0;
//         utterance.volume = 1.0;

//         // Try to find a suitable voice
//         const voices = window.speechSynthesis.getVoices();
//         const preferredVoice = voices.find(voice =>
//             voice.lang === language.code ||
//             voice.lang.startsWith(language.code.split('-')[0]) ||
//             voice.name.toLowerCase().includes(language.name.toLowerCase().split(' ')[0])
//         );

//         if (preferredVoice) {
//             utterance.voice = preferredVoice;
//         }

//         utterance.onstart = () => {
//             setIsSpeaking(true);
//             console.log('Web Speech API started speaking');
//         };

//         utterance.onend = () => {
//             setIsSpeaking(false);
//             console.log('Web Speech API finished speaking');
//         };

//         utterance.onerror = (event) => {
//             console.error('Web Speech API error:', event);
//             setIsSpeaking(false);
//             toast.error('Voice synthesis failed. Please try again.');
//         };

//         speechSynthesisRef.current = utterance;
//         window.speechSynthesis.speak(utterance);
//     };

//     const stopSpeaking = () => {
//         if (audioRef.current) {
//             audioRef.current.pause();
//             audioRef.current.currentTime = 0;
//             setIsSpeaking(false);
//         }

//         if (window.speechSynthesis) {
//             window.speechSynthesis.cancel();
//         }
//     };

//     const handleUserMessage = async (text: string) => {
//         if (!text.trim()) return;

//         const userMessage: Message = {
//             id: generateId(),
//             role: 'user',
//             content: text,
//             timestamp: new Date()
//         };

//         setMessages(prev => [...prev, userMessage]);
//         setInputText('');
//         setTranscript('');
//         setIsProcessing(true);

//         // Stop listening if active
//         if (isListening) {
//             stopListening();
//         }

//         try {
//             // Local intent: Name change in Hindi/English
//             const lowerText = text.toLowerCase();
//             if ((lowerText.includes('mera naam') || lowerText.includes('my name')) &&
//                 (lowerText.includes('badlo') || lowerText.includes('change'))) {

//                 const nameMatch = text.match(/(?:mera naam|my name is|name is)\s+([A-Za-z\s]+)/i);
//                 if (nameMatch && nameMatch[1]) {
//                     const newName = nameMatch[1].trim();
//                     updateWorkerName(newName);

//                     let response = `Okay, I've updated your name to ${newName}.`;
//                     if (language.code === 'hi-IN') {
//                         response = `ठीक है, मैंने आपका नाम ${newName} कर दिया है।`;
//                     } else if (language.code === 'mr-IN') {
//                         response = `ठीक आहे, मी तुमचे नाव ${newName} असे केले आहे.`;
//                     }

//                     const assistantMessage: Message = {
//                         id: generateId(),
//                         role: 'assistant',
//                         content: response,
//                         timestamp: new Date()
//                     };

//                     setMessages(prev => [...prev, assistantMessage]);
//                     speak(response);
//                     setIsProcessing(false);
//                     return;
//                 }
//             }

//             // Prepare chat history for AI
//             const history = messages.map(m => ({
//                 role: m.role === 'user' ? 'user' as const : 'model' as const,
//                 parts: [{ text: m.content }]
//             }));

//             // Get AI response
//             const userName = currentWorker?.name;
//             const responseText = await getSaharaResponse(text, history, userName, language.name);

//             // Process any special intents from AI
//             let cleanResponse = responseText;
//             if (responseText.includes('[UPDATE_NAME:')) {
//                 const nameMatch = responseText.match(/\[UPDATE_NAME:\s*([^\]]+)\]/);
//                 if (nameMatch && nameMatch[1]) {
//                     const newName = nameMatch[1].trim();
//                     updateWorkerName(newName);
//                     toast.success(`Name updated to: ${newName}`);
//                     cleanResponse = responseText.replace(/\[UPDATE_NAME:[^\]]+\]/g, '').trim();
//                 }
//             }

//             const assistantMessage: Message = {
//                 id: generateId(),
//                 role: 'assistant',
//                 content: cleanResponse,
//                 timestamp: new Date()
//             };

//             setMessages(prev => [...prev, assistantMessage]);
//             speak(cleanResponse);

//         } catch (error) {
//             console.error('Error getting AI response:', error);

//             // Language-specific error messages
//             let errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
//             if (language.code === 'hi-IN') {
//                 errorMessage = "माफ़ कीजिए, मुझे अभी कनेक्शन में दिक्कत हो रही है। कृपया कुछ देर बाद कोशिश करें।";
//             } else if (language.code === 'mr-IN') {
//                 errorMessage = "माफ करा, मला आत्ता कनेक्शन त्रुटी येत आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.";
//             }

//             const errorMessageObj: Message = {
//                 id: generateId(),
//                 role: 'assistant',
//                 content: errorMessage,
//                 timestamp: new Date()
//             };

//             setMessages(prev => [...prev, errorMessageObj]);
//             speak(errorMessage);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     const handleTextInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter' && inputText.trim()) {
//             handleUserMessage(inputText);
//         }
//     };

//     const handleLanguageChange = (newLanguageCode: string) => {
//         const newLang = SUPPORTED_LANGUAGES.find(l => l.code === newLanguageCode);
//         if (newLang) {
//             setLanguage(newLang);
//             toast.success(`Language changed to ${newLang.name}`, {
//                 description: `Assistant will now respond in ${newLang.name}`,
//             });

//             // Update speech recognition language
//             if (recognitionRef.current) {
//                 recognitionRef.current.lang = newLang.code;
//             }
//         }
//     };

//     return (
//         <div className="fixed bottom-6 right-6 z-50">
//             <AnimatePresence>
//                 {isOpen && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 20, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: 20, scale: 0.95 }}
//                         className="mb-4"
//                     >
//                         <Card className="w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm">
//                             {/* Header */}
//                             <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
//                                 <div className="flex items-center gap-3">
//                                     <div className="relative">
//                                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-md">
//                                             <Sparkles size={20} />
//                                         </div>
//                                         {isSpeaking && (
//                                             <motion.div
//                                                 animate={{ scale: [1, 1.2, 1] }}
//                                                 transition={{ repeat: Infinity, duration: 1.5 }}
//                                                 className="absolute -inset-1 rounded-full border-2 border-primary/30"
//                                             />
//                                         )}
//                                     </div>
//                                     <div>
//                                         <div className="flex items-center gap-2">
//                                             <h3 className="font-bold text-sm">Sahara AI</h3>
//                                             {isProcessing && (
//                                                 <Loader2 size={12} className="animate-spin text-primary" />
//                                             )}
//                                         </div>
//                                         <p className="text-[10px] text-muted-foreground leading-tight">
//                                             Your personal assistant & counselor
//                                         </p>
//                                         {currentWorker?.name && (
//                                             <p className="text-[9px] text-primary/70 mt-0.5">
//                                                 👤 {currentWorker.name}
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-2">
//                                     <select
//                                         className="text-[10px] bg-background/80 backdrop-blur-sm border border-primary/30 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
//                                         value={language.code}
//                                         onChange={(e) => handleLanguageChange(e.target.value)}
//                                     >
//                                         {SUPPORTED_LANGUAGES.map(lang => (
//                                             <option key={lang.code} value={lang.code}>
//                                                 {lang.name}
//                                             </option>
//                                         ))}
//                                     </select>

//                                     <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         className="h-8 w-8 hover:bg-primary/10"
//                                         onClick={() => setIsMuted(!isMuted)}
//                                         title={isMuted ? "Unmute voice" : "Mute voice"}
//                                     >
//                                         {isMuted ? (
//                                             <VolumeX size={16} className="text-red-500" />
//                                         ) : (
//                                             <Volume2 size={16} />
//                                         )}
//                                     </Button>

//                                     <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         className="h-8 w-8 hover:bg-primary/10"
//                                         onClick={toggleAssistant}
//                                         title="Close assistant"
//                                     >
//                                         <X size={16} />
//                                     </Button>
//                                 </div>
//                             </div>

//                             {/* Messages Area */}
//                             <ScrollArea className="flex-1 p-4" ref={scrollRef}>
//                                 <div className="space-y-4">
//                                     {messages.map((msg) => (
//                                         <motion.div
//                                             key={msg.id}
//                                             initial={{ opacity: 0, y: 10 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                                         >
//                                             <div
//                                                 className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
//                                                     ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-tr-none'
//                                                     : 'bg-gradient-to-r from-muted/80 to-background border rounded-tl-none'
//                                                     }`}
//                                             >
//                                                 <div className="whitespace-pre-wrap break-words">{msg.content}</div>
//                                                 <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
//                                                     {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                                 </div>
//                                             </div>
//                                         </motion.div>
//                                     ))}

//                                     {isListening && transcript && (
//                                         <motion.div
//                                             initial={{ opacity: 0 }}
//                                             animate={{ opacity: 1 }}
//                                             className="flex justify-end"
//                                         >
//                                             <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-primary/20 italic rounded-tr-none animate-pulse">
//                                                 {transcript}...
//                                             </div>
//                                         </motion.div>
//                                     )}

//                                     {isProcessing && !isListening && (
//                                         <div className="flex justify-start">
//                                             <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-muted rounded-tl-none">
//                                                 <div className="flex items-center gap-2">
//                                                     <Loader2 size={12} className="animate-spin" />
//                                                     <span>Sahara is thinking...</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </ScrollArea>

//                             {/* Input Area */}
//                             <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
//                                 <div className="flex items-center gap-2">
//                                     <div className="flex-1 relative">
//                                         <input
//                                             type="text"
//                                             value={inputText}
//                                             onChange={(e) => setInputText(e.target.value)}
//                                             onKeyDown={handleTextInput}
//                                             placeholder={`Type your message in ${language.name}...`}
//                                             className="w-full h-10 px-4 py-2 rounded-full bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
//                                             disabled={isProcessing}
//                                         />
//                                         {inputText && (
//                                             <button
//                                                 onClick={() => setInputText('')}
//                                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                                             >
//                                                 <X size={14} />
//                                             </button>
//                                         )}
//                                     </div>

//                                     <Button
//                                         size="icon"
//                                         className={`h-12 w-12 rounded-full transition-all duration-300 shadow-lg ${isListening
//                                             ? 'bg-red-500 hover:bg-red-600 animate-pulse'
//                                             : isSpeaking
//                                                 ? 'bg-yellow-500 hover:bg-yellow-600'
//                                                 : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary'
//                                             }`}
//                                         onClick={isListening ? stopListening : startListening}
//                                         disabled={isProcessing || isSpeaking}
//                                         title={isListening ? "Stop listening" : "Start speaking"}
//                                     >
//                                         {isListening ? (
//                                             <MicOff size={20} />
//                                         ) : (
//                                             <Mic size={20} />
//                                         )}
//                                     </Button>
//                                 </div>

//                                 <div className="flex justify-between items-center mt-3 px-1">
//                                     {isListening ? (
//                                         <p className="text-[10px] text-primary animate-pulse font-medium">
//                                             🎤 Listening in {language.name}... Speak now
//                                         </p>
//                                     ) : (
//                                         <p className="text-[10px] text-muted-foreground">
//                                             Press mic to speak or type and press Enter
//                                         </p>
//                                     )}

//                                     <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
//                                         {isSpeaking && <span className="animate-pulse">🔊 Speaking</span>}
//                                         {isMuted && <span className="text-red-500">🔇 Muted</span>}
//                                     </div>
//                                 </div>
//                             </div>
//                         </Card>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Floating Assistant Button */}
//             <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={toggleAssistant}
//                 className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen
//                     ? 'bg-gradient-to-br from-muted to-muted/80 text-muted-foreground'
//                     : 'bg-gradient-to-br from-primary to-primary/70 hover:from-primary/90 hover:to-primary text-primary-foreground'
//                     }`}
//                 aria-label={isOpen ? "Close assistant" : "Open assistant"}
//             >
//                 {isOpen ? (
//                     <X size={28} />
//                 ) : (
//                     <div className="relative">
//                         <MessageSquare size={28} />
//                         <motion.div
//                             animate={{ scale: [1, 1.3, 1] }}
//                             transition={{ repeat: Infinity, duration: 2 }}
//                             className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-background"
//                         />
//                         {isSpeaking && (
//                             <motion.div
//                                 animate={{ scale: [1, 1.5, 1] }}
//                                 transition={{ repeat: Infinity, duration: 1.5 }}
//                                 className="absolute -inset-1 rounded-full border-2 border-primary/30"
//                             />
//                         )}
//                     </div>
//                 )}
//             </motion.button>

//             {/* Hidden audio element for TTS */}
//             <audio ref={audioRef} preload="auto" />
//         </div>
//     );
// };




import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Volume2, VolumeX, MessageSquare, Sparkles, Send, Globe } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { getSaharaResponse } from '@/lib/aiService';
import { speakText, cancelSpeech, initializeVoices } from '@/lib/ttsService';
import { detectLanguage, getLanguageFromCode } from '@/lib/languageDetection';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    detectedLanguage?: string;
}

const SUPPORTED_LANGUAGES = [
    { name: 'English', code: 'en-US', flag: '🇺🇸', auto: 'Auto-detect' },
    { name: 'Hindi (हिन्दी)', code: 'hi-IN', flag: '🇮🇳' },
    { name: 'Gujarati (ગુજરાતી)', code: 'gu-IN', flag: '🇮🇳' },
    { name: 'Marathi (मराठी)', code: 'mr-IN', flag: '🇮🇳' },
    { name: 'Tamil (தமிழ்)', code: 'ta-IN', flag: '🇮🇳' },
    { name: 'Telugu (తెలుగు)', code: 'te-IN', flag: '🇮🇳' },
    { name: 'Bengali (বাংলা)', code: 'bn-IN', flag: '🇮🇳' },
    { name: 'Kannada (ಕನ್ನಡ)', code: 'kn-IN', flag: '🇮🇳' },
    { name: 'Malayalam (മലയാളം)', code: 'ml-IN', flag: '🇮🇳' },
    { name: 'Punjabi (ਪੰਜਾਬੀ)', code: 'pa-IN', flag: '🇮🇳' },
];

export const SaharaAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [transcript, setTranscript] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0]); // Start with Auto-detect
    const [inputText, setInputText] = useState('');

    const { currentWorker, updateWorkerName } = useAppStore();
    const recognitionRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize TTS voices
    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            initializeVoices();
        }
    }, []);

    // Initialize speech recognition
    useEffect(() => {
        if (!isOpen) return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        // If auto-detect is selected, use a generic language
        recognition.lang = language.code === 'en-US' && language.name === 'Auto-detect'
            ? 'en-US' // Default for auto-detect
            : language.code;

        recognition.onstart = () => {
            console.log('🎤 Listening started');
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            let text = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    text += event.results[i][0].transcript;
                } else {
                    setTranscript(event.results[i][0].transcript);
                }
            }

            if (text) {
                console.log('🎤 Final transcript:', text);
                handleUserMessage(text);
                recognition.stop();
            }
        };

        recognition.onend = () => {
            console.log('🎤 Listening ended');
            setIsListening(false);
            setTranscript('');
        };

        recognition.onerror = (event: any) => {
            console.error('🎤 Speech recognition error:', event.error);
            setIsListening(false);

            if (event.error === 'not-allowed') {
                toast.error('Microphone access denied. Please allow microphone access.');
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isOpen, language.code]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            const scrollArea = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollArea) {
                setTimeout(() => {
                    scrollArea.scrollTop = scrollArea.scrollHeight;
                }, 100);
            }
        }
    }, [messages, transcript]);

    // Generate ID
    const generateId = () => Date.now().toString();

    // Get greeting based on language
    const getGreeting = (langCode: string = 'en-US') => {
        const userName = currentWorker?.name;
        const greetings: Record<string, string> = {
            'en-US': `Hello${userName ? ` ${userName}` : ''}! I'm Sahara. I'll respond in the same language you use. How can I help?`,
            'hi-IN': `नमस्ते${userName ? ` ${userName} जी` : ''}! मैं सहारा हूं। मैं आपकी भाषा में जवाब दूंगी। मैं आपकी कैसे मदद कर सकती हूं?`,
            'gu-IN': `નમસ્તે${userName ? ` ${userName} ભાઈ` : ''}! હું સહારા છું. હું તમારી ભાષામાં જવાબ આપીશ. હું તમારી કેવી રીતે મદદ કરી શકું?`,
            'mr-IN': `नमस्कार${userName ? ` ${userName}साहेब` : ''}! मी सहारा आहे. मी तुमच्या भाषेत उत्तर देईन. मी तुमची कशी मदत करू शकते?`,
            'ta-IN': `வணக்கம்${userName ? ` ${userName}` : ''}! நான் சஹாரா. நான் உங்கள் மொழியில் பதிலளிப்பேன். நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?`,
            'te-IN': `నమస్కారం${userName ? ` ${userName} గారు` : ''}! నేను సహారా. నేను మీ భాషలో సమాధానం ఇస్తాను. నేను మీకు ఎలా సహాయం చేయగలను?`,
            'bn-IN': `নমস্কার${userName ? ` ${userName} বাবু` : ''}! আমি সাহারা। আমি আপনার ভাষায় উত্তর দেব। আমি আপনাকে কীভাবে সাহায্য করতে পারি?`,
            'kn-IN': `ನಮಸ್ಕಾರ${userName ? ` ${userName} ಅವರೇ` : ''}! ನಾನು ಸಹಾರಾ. ನಾನು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರ ನೀಡುತ್ತೇನೆ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`,
            'ml-IN': `നമസ്കാരം${userName ? ` ${userName} സാർ` : ''}! ഞാൻ സഹാര. ഞാൻ നിങ്ങളുടെ ഭാഷയിൽ മറുപടി നൽകും. ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?`,
            'pa-IN': `ਸਤ ਸ੍ਰੀ ਅਕਾਲ${userName ? ` ${userName} ਜੀ` : ''}! ਮੈਂ ਸਹਾਰਾ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਜਵਾਬ ਦਿਆਂਗਾ। ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?`,
        };

        return greetings[langCode] || greetings['en-US'];
    };

    // Toggle assistant
    const toggleAssistant = () => {
        const newState = !isOpen;
        setIsOpen(newState);

        if (newState && messages.length === 0) {
            // Use auto-detect greeting (default English)
            const greeting = getGreeting('en-US');
            setMessages([{
                id: generateId(),
                role: 'assistant',
                content: greeting
            }]);

            // Speak greeting if not muted
            if (!isMuted) {
                setTimeout(() => speak(greeting, 'en-US'), 300);
            }

            // Focus input
            setTimeout(() => inputRef.current?.focus(), 350);
        } else if (!newState) {
            // Stop any ongoing speech
            cancelSpeech();
            setIsSpeaking(false);
        }
    };

    // Start/stop listening
    const toggleListening = () => {
        if (isListening) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        } else {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch (error) {
                    console.error('Failed to start recognition:', error);
                    toast.error('Failed to start microphone');
                }
            }
        }
    };

    // Speak text
    const speak = async (text: string, langCode: string) => {
        if (isMuted || !text.trim()) return;

        cancelSpeech();
        setIsSpeaking(true);

        const success = await speakText(text, langCode);

        if (!success) {
            setIsSpeaking(false);
        }
    };

    // Handle user message
    const handleUserMessage = async (text: string) => {
        if (!text.trim()) return;

        console.log('📝 User message:', text);

        // Detect language from user input
        const detectedLang = detectLanguage(text);
        console.log('🌍 Detected language:', detectedLang.language, detectedLang.code);

        // Update UI language if auto-detect is selected
        if (language.name === 'Auto-detect') {
            const langMatch = SUPPORTED_LANGUAGES.find(l => l.code === detectedLang.code);
            if (langMatch) {
                setLanguage(langMatch);
            }
        }

        // Add user message with detected language
        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: text,
            detectedLanguage: detectedLang.language
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setTranscript('');
        setIsProcessing(true);

        // Stop listening
        if (isListening) {
            toggleListening();
        }

        try {
            // Simple name change detection
            const lowerText = text.toLowerCase();
            const langCode = detectedLang.code;

            if (
                (lowerText.includes('name') || lowerText.includes('naam') || lowerText.includes('नाम')) &&
                (lowerText.includes('change') || lowerText.includes('update') || lowerText.includes('बदलो') || lowerText.includes('बदल'))
            ) {
                // Extract name (simple pattern)
                const words = text.split(/\s+/);
                let newName = '';

                for (let i = 0; i < words.length; i++) {
                    const word = words[i].toLowerCase();
                    if ((word === 'name' || word === 'naam' || word === 'नाम') && i + 1 < words.length) {
                        newName = words[i + 1];
                        break;
                    }
                }

                if (newName && newName.length > 1) {
                    updateWorkerName(newName);

                    let response = '';
                    if (langCode.startsWith('hi')) {
                        response = `बहुत अच्छा! मैंने आपका नाम ${newName} कर दिया है। अब मैं आपकी कैसे मदद कर सकती हूं?`;
                    } else if (langCode.startsWith('gu')) {
                        response = `ખુબ જ સરસ! મેં તમારું નામ ${newName} કરી દીધું છે. હવે હું તમારી કેવી રીતે મદદ કરી શકું?`;
                    } else if (langCode.startsWith('mr')) {
                        response = `खुप छान! मी तुमचे नाव ${newName} असे केले आहे. आता मी तुमची कशी मदत करू शकते?`;
                    } else {
                        response = `Great! I've updated your name to ${newName}. How can I help you now?`;
                    }

                    const assistantMessage: Message = {
                        id: generateId(),
                        role: 'assistant',
                        content: response
                    };

                    setMessages(prev => [...prev, assistantMessage]);

                    if (!isMuted) {
                        speak(response, langCode);
                    }

                    setIsProcessing(false);
                    return;
                }
            }

            // Prepare history
            const history = messages.slice(-4).map(m => ({
                role: m.role === 'user' ? 'user' as const : 'model' as const,
                parts: [{ text: m.content }]
            }));

            // Get AI response - AI will auto-detect and match language
            const userName = currentWorker?.name;
            console.log('🤖 Requesting AI response...');

            const responseText = await getSaharaResponse(
                text,
                history,
                userName,
                detectedLang.language
            );

            console.log('🤖 AI Response:', responseText.substring(0, 100));

            // Process special tags
            let cleanResponse = responseText;
            if (responseText.includes('[UPDATE_NAME:')) {
                const match = responseText.match(/\[UPDATE_NAME:\s*([^\]]+)\]/);
                if (match?.[1]) {
                    const newName = match[1].trim();
                    updateWorkerName(newName);
                    toast.success(`Name updated to ${newName}`);
                    cleanResponse = responseText.replace(/\[UPDATE_NAME:[^\]]+\]/g, '').trim();
                }
            }

            // Add assistant response
            const assistantMessage: Message = {
                id: generateId(),
                role: 'assistant',
                content: cleanResponse
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Speak response in detected language
            if (!isMuted) {
                speak(cleanResponse, detectedLang.code);
            }

        } catch (error) {
            console.error('❌ Error getting AI response:', error);

            // Error message in detected language
            let errorMsg = "Sorry, I had trouble understanding. Could you please try again?";

            const langCode = detectedLang.code;
            if (langCode.startsWith('hi')) {
                errorMsg = "माफ कीजिए, मुझे समझने में दिक्कत हुई। कृपया फिर से कोशिश करें।";
            } else if (langCode.startsWith('gu')) {
                errorMsg = "માફ કરશો, મને સમજવામાં તકલીફ થઈ. કૃપા કરીને ફરી પ્રયાસ કરો.";
            } else if (langCode.startsWith('mr')) {
                errorMsg = "माफ करा, मला समजण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.";
            }

            const errorMessage: Message = {
                id: generateId(),
                role: 'assistant',
                content: errorMsg
            };

            setMessages(prev => [...prev, errorMessage]);

            if (!isMuted) {
                speak(errorMsg, langCode);
            }

            toast.error('Failed to get response. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle send
    const handleSend = () => {
        if (inputText.trim() && !isProcessing) {
            handleUserMessage(inputText);
        }
    };

    // Handle language change
    const handleLanguageChange = (newCode: string) => {
        const newLang = SUPPORTED_LANGUAGES.find(l => l.code === newCode);
        if (newLang) {
            // Stop any current speech
            cancelSpeech();
            setIsSpeaking(false);

            // Stop listening if active
            if (isListening && recognitionRef.current) {
                recognitionRef.current.stop();
            }

            // Update language
            setLanguage(newLang);

            const message = newLang.name === 'Auto-detect'
                ? 'Auto-detect enabled. Sahara will respond in your language.'
                : `Language set to ${newLang.name.split(' ')[0]}`;

            toast.success(message);

            // Update speech recognition language
            if (recognitionRef.current && newLang.name !== 'Auto-detect') {
                recognitionRef.current.lang = newLang.code;
            }

            // Focus input
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4"
                    >
                        <Card className="w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl border-2 border-primary/20 bg-background">
                            {/* Header */}
                            <div className="p-4 border-b border-primary/10 flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground">
                                            <Globe size={20} />
                                        </div>
                                        {isSpeaking && (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className="absolute -inset-1 rounded-full border-2 border-primary/30"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm flex items-center gap-2">
                                            Sahara AI
                                            <span className="text-[10px] px-2 py-0.5 bg-primary/10 rounded-full">
                                                Auto-detect
                                            </span>
                                        </h3>
                                        <p className="text-[10px] text-muted-foreground">
                                            {currentWorker?.name ? `Assistant for ${currentWorker.name}` : 'Responds in your language'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        className="text-xs bg-background border border-input rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                                        value={language.code}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                    >
                                        {SUPPORTED_LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.flag} {lang.name.split(' ')[0]}
                                                {lang.auto ? ` (${lang.auto})` : ''}
                                            </option>
                                        ))}
                                    </select>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setIsMuted(!isMuted)}
                                    >
                                        {isMuted ? (
                                            <VolumeX size={16} className="text-red-500" />
                                        ) : (
                                            <Volume2 size={16} />
                                        )}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={toggleAssistant}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                                <div className="space-y-3">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className="flex flex-col max-w-[85%]">
                                                <div
                                                    className={`p-3 rounded-2xl ${msg.role === 'user'
                                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                        : 'bg-muted rounded-tl-none'
                                                        }`}
                                                >
                                                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                                                </div>
                                                {msg.detectedLanguage && msg.role === 'user' && (
                                                    <div className="text-[10px] text-muted-foreground text-right mt-1">
                                                        🌍 {msg.detectedLanguage}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {transcript && (
                                        <div className="flex justify-end">
                                            <div className="max-w-[85%] p-3 rounded-2xl bg-primary/10 border border-primary/20 italic text-sm">
                                                {transcript}...
                                            </div>
                                        </div>
                                    )}

                                    {isProcessing && (
                                        <div className="flex justify-start">
                                            <div className="max-w-[85%] p-3 rounded-2xl bg-muted rounded-tl-none">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
                                                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300" />
                                                    </div>
                                                    <span>Understanding your message...</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Input */}
                            <div className="p-4 border-t">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 relative">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            placeholder="Type in any language..."
                                            className="w-full h-10 px-4 pr-10 py-2 rounded-full bg-muted border-none text-sm focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                                            disabled={isProcessing}
                                        />
                                        {inputText && (
                                            <button
                                                onClick={handleSend}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                                                disabled={isProcessing}
                                            >
                                                <Send size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <Button
                                        size="icon"
                                        className={`h-12 w-12 rounded-full ${isListening
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-primary hover:bg-primary/90'
                                            }`}
                                        onClick={toggleListening}
                                        disabled={isProcessing}
                                    >
                                        {isListening ? (
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                                                <MicOff size={20} />
                                            </div>
                                        ) : (
                                            <Mic size={20} />
                                        )}
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center mt-2 px-1">
                                    <span className="text-[10px] text-muted-foreground">
                                        {isListening ? `🎤 Listening...` : 'Speak or type in any language'}
                                    </span>
                                    <div className="flex items-center gap-2 text-[10px]">
                                        {language.name === 'Auto-detect' && (
                                            <span className="text-primary flex items-center gap-1">
                                                <Globe size={10} /> Auto
                                            </span>
                                        )}
                                        {isSpeaking && <span className="text-primary">🔊 Speaking</span>}
                                        {isMuted && <span className="text-red-500">🔇 Muted</span>}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleAssistant}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl ${isOpen ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
                    }`}
            >
                {isOpen ? (
                    <X size={28} />
                ) : (
                    <div className="relative">
                        <MessageSquare size={28} />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                        />
                    </div>
                )}
            </motion.button>
        </div>
    );
};
