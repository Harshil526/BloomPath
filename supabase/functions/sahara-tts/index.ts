// supabase/functions/sahara-tts/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

// NOTE: Replace with your actual TTS provider API key. 
// It's recommended to store this as a secret in your Supabase project settings.
const TTS_API_KEY = Deno.env.get('TTS_API_KEY');
const TTS_API_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${TTS_API_KEY}`;

serve(async (req) => {
  // This is needed if you're calling this function from a browser
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    // In a real scenario, you would uncomment this block and fill in your API key.
    if (!TTS_API_KEY || TTS_API_KEY === 'YOUR_TTS_PROVIDER_API_KEY_HERE') {
       return new Response(JSON.stringify({ error: 'TTS Provider API Key not configured.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const requestBody = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Wavenet-F', // A high-quality Google Wavenet voice
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };

    const ttsResponse = await fetch(TTS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!ttsResponse.ok) {
      const errorBody = await ttsResponse.json();
      console.error('TTS API Error:', errorBody);
      throw new Error('Failed to synthesize speech.');
    }

    const responseBody = await ttsResponse.json();
    const audioContent = responseBody.audioContent; // This is a base64 encoded string

    // Deno specific: decode base64
    const audioData = atob(audioContent);
    const audioBuffer = new Uint8Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
        audioBuffer[i] = audioData.charCodeAt(i);
    }
    
    return new Response(audioBuffer.buffer, {
      headers: { ...corsHeaders, 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
