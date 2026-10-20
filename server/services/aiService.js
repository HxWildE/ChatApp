import { GoogleGenAI } from '@google/genai';

// Lazy-initialized AI client instance
let aiClient = null;
const getAIClient = () => {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
};

/**
 * Robust JSON extraction helper supporting raw JSON, markdown-wrapped JSON, or embedded JSON strings.
 */
const extractJsonSuggestions = (text) => {
  if (!text || typeof text !== 'string') return null;

  // 1. Try markdown code block ```json ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (Array.isArray(parsed?.suggestions)) return parsed.suggestions;
    } catch {
      // Fall through to next extraction
    }
  }

  // 2. Try parsing outermost { ... }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      const parsed = JSON.parse(text.slice(firstBrace, lastBrace + 1));
      if (Array.isArray(parsed?.suggestions)) return parsed.suggestions;
    } catch {
      // Fall through to raw parse
    }
  }

  // 3. Try direct JSON.parse
  try {
    const parsed = JSON.parse(text.trim());
    if (Array.isArray(parsed?.suggestions)) return parsed.suggestions;
  } catch {
    return null;
  }

  return null;
};

/**
 * Generates 3 contextual, concise smart replies based on recent chat history.
 * 
 * @param {Array<{ senderName: string, text: string, isMe: boolean }>} conversationHistory 
 * @param {string} friendName 
 * @param {string} userName 
 * @returns {Promise<string[]>} Array of up to 3 string suggestions
 */
export const getSmartRepliesFromGemini = async (conversationHistory = [], friendName = 'Friend', userName = 'Me') => {
  const ai = getAIClient();
  if (!ai) {
    console.warn("⚠️ Warning: GEMINI_API_KEY is not defined. Skipping AI Smart Replies.");
    return [];
  }

  // Format messages into a sanitized dialogue transcript
  const transcript = conversationHistory
    .map(msg => `${msg.isMe ? userName : friendName}: ${msg.text ? msg.text.trim() : '[Sent an image attachment]'}`)
    .join('\n');

  const systemInstruction = `
You are the built-in Smart Reply engine for the NEXUS real-time chat application.
Generate exactly 3 short, natural, context-aware reply suggestions for ${userName} to send back to ${friendName}.

Rules:
1. Suggestions must be concise: between 1 and 7 words each.
2. Provide varied emotional tones and intents:
   - Option 1: Affirmative / Positive / Agreement
   - Option 2: Inquisitive / Follow-up question / Clarification
   - Option 3: Casual / Empathetic / Action-oriented
3. Match the conversational tone (e.g., informal, friendly, or professional).
4. Do NOT use quotation marks inside the strings.
5. Strictly adhere to the requested JSON schema.
`.trim();

  // Primary model and fallback models in order of latency and availability
  const candidateModels = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-flash-latest'
  ];

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `Recent conversation between ${friendName} and ${userName}:\n\n${transcript}\n\nProvide 3 smart replies for ${userName}:`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              suggestions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of exactly 3 short conversational suggestions.'
              }
            },
            required: ['suggestions']
          },
          temperature: 0.7,
          maxOutputTokens: 120
        }
      });

      const suggestions = extractJsonSuggestions(response.text);
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        return suggestions
          .filter(s => typeof s === 'string' && s.trim().length > 0)
          .slice(0, 3);
      }
    } catch (error) {
      console.warn(`[AI Service] Error generating smart replies with model ${model}:`, error.message);
      // Attempt next fallback model
    }
  }

  // Graceful degradation: return empty array rather than failing the request
  return [];
};
