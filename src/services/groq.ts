export interface GroqResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}

export interface TranscriptionResponse {
    text: string;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const groqService = {
    async getTranslationAndTransliteration(term: string, dialect: string = 'MSA', category: string = 'General', type: string = 'word'): Promise<{ translation: string; transliteration: string }> {
        if (!GROQ_API_KEY) return { translation: '', transliteration: '' };

        const prompt = `
      Translate and transliterate the Arabic term "${term}".
      Context: Dialect: ${dialect}, Category: ${category}, Type: ${type}.
      Output ONLY valid JSON with fields:
      - translation: string (English meaning)
      - transliteration: string (Latin characters)
    `;

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
                    temperature: 0.3,
                    max_completion_tokens: 128,
                    response_format: { type: "json_object" }
                }),
            });

            if (!response.ok) throw new Error(`Groq API error: ${response.statusText}`);

            const data = await response.json();
            const content = data.choices[0]?.message?.content || '{}';
            return JSON.parse(content);
        } catch (error) {
            console.error('Error getting translation:', error);
            return { translation: '', transliteration: '' };
        }
    },

    async generateAiInsights(term: string, context: string = '', dialect: string = 'General', translation: string = '', transliteration: string = '', category: string = 'General', type: string = 'word'): Promise<string> {
        if (!GROQ_API_KEY) {
            console.warn('GROQ_API_KEY is missing');
            return '{}';
        }

        const systemPrompt = `You are an expert linguist specializing in ARABIC DIALECTS. 
        Your goal is to explain terms based on their DAILY USAGE in the specific Arabic dialect requested.
        NEVER confuse Arabic terms with phonetically similar words from other languages (e.g., Hebrew, Aramaic, Persian) unless the user explicitly asks for a comparative etymology.
        The user's provided translation is the GROUND TRUTH. Do not contradict it.`;

        const prompt = `
      You are an assistant helping a user learn the "${dialect}" dialect of Arabic.
      
      The user has entered the following word:
      - Arabic: "${term}"
      - Transliteration: "${transliteration}"
      - Definition: "${translation}"
      - Category: "${category}"
      - Type: "${type}"
      - Notes/Context: "${context}"
      
      TASK:
      Provide a cultural insight and an example sentence for this word, specifically matching the USER'S DEFINITION ("${translation}").
      
      CRITICAL RULES:
      1. TRUST THE DEFINITION. If the Arabic word "${term}" has multiple meanings (e.g., standard vs. slang), you MUST choose the meaning that matches "${translation}".
      2. IGNORE all other meanings. For example, if the word looks like "Qaddish" (Holy) but the user says it means "How much", you MUST treat it as "How much" (Addeish).
      3. The example sentence MUST be in the "${dialect}" dialect and use the word to mean "${translation}".
      4. Do NOT explain that the word has other meanings. Do NOT mention religion, saints, or other languages unless the Definition is explicitly religious.
      
      Provide a JSON response with:
      - synonyms: array of strings
      - exampleUsage: string (A sentence in ${dialect} where "${term}" means "${translation}", followed by its English translation)
      - culturalContext: string (When do people use this word to mean "${translation}"? e.g., bargaining, asking age, etc.)
      - grammaticalNotes: string (Brief dialect grammar notes)
      
      Output ONLY valid JSON.
    `;

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ],
                    model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
                    temperature: 0.3, // Lower temperature for more deterministic results
                    max_completion_tokens: 1024,
                    response_format: { type: "json_object" }
                }),
            });

            if (!response.ok) throw new Error(`Groq API error: ${response.statusText}`);

            const data: GroqResponse = await response.json();
            return data.choices[0]?.message?.content || '{}';
        } catch (error) {
            console.error('Error generating insights:', error);
            throw error;
        }
    },

    async transcribeAudio(audioBlob: Blob): Promise<string> {
        if (!GROQ_API_KEY) {
            console.warn('GROQ_API_KEY is missing');
            return 'Transcription unavailable (missing API key)';
        }

        const formData = new FormData();
        formData.append('model', 'whisper-large-v3');
        formData.append('file', audioBlob, 'audio.m4a'); // Groq expects a filename
        formData.append('temperature', '0');
        formData.append('response_format', 'verbose_json');

        try {
            const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Groq Whisper API error: ${response.statusText}`);
            }

            const data: TranscriptionResponse = await response.json();
            return data.text;
        } catch (error) {
            console.error('Error transcribing audio:', error);
            throw error;
        }
    },
};
