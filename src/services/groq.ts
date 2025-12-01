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
                    model: 'llama-3.1-8b-instant',
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

    async generateAiInsights(term: string, context: string = ''): Promise<string> {
        if (!GROQ_API_KEY) {
            console.warn('GROQ_API_KEY is missing');
            return '{}';
        }

        const prompt = `
      Analyze the Arabic term "${term}".
      Context: ${context}
      
      Provide a JSON response with the following fields. ALL content must be in ENGLISH, except for specific Arabic examples.
      - synonyms: array of strings (English or transliterated Arabic)
      - exampleUsage: string (Arabic sentence with English translation)
      - culturalContext: string (Detailed explanation in English about cultural significance, usage, or nuance)
      - grammaticalNotes: string (Detailed explanation in English about grammar, root, or conjugation)
      
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
                    messages: [{ role: 'user', content: prompt }],
                    model: 'llama-3.1-8b-instant',
                    temperature: 0.5,
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
