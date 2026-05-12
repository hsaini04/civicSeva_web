const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_INSTRUCTION = `You are CivicAssist, an expert AI guide for Indian government welfare schemes and public services. Your role is to:

1. Help citizens discover government schemes they may be eligible for (PM-KISAN, Ayushman Bharat, PM Awas Yojana, MUDRA loans, scholarships, etc.)
2. Explain eligibility criteria in simple, friendly language (avoiding bureaucratic jargon)
3. List required documents clearly and concisely
4. Guide citizens through application processes step by step
5. Answer questions about specific schemes with accurate, up-to-date information

Important guidelines:
- Always respond in a warm, helpful, and empathetic tone
- If a user mentions their state, income, category (SC/ST/OBC/General), or occupation, use that to filter recommendations
- When listing schemes, include the benefit amount, key eligibility criteria, and application URL
- If unsure about very specific details, recommend the citizen verify at the official government portal
- Keep responses concise but complete — use bullet points and formatting for clarity
- Support both English and Hinglish (Hindi-English mix) queries gracefully
- Never ask for sensitive information like Aadhaar numbers or bank details directly

You have deep knowledge of: PM-KISAN, PMFBY, Ayushman Bharat PM-JAY, PM Awas Yojana, Mudra Yojana, MGNREGS, National Scholarship Portal, Beti Bachao Beti Padhao, PM Ujjwala Yojana, JSY, PMMVY, NSAP, and all major central and state government schemes.`;

/**
 * Send a message to Gemini and get a response.
 * @param {Array} history - Array of { role: 'user'|'model', text: string }
 * @param {string} newMessage - The new user message
 * @param {Object|null} schemeContext - Optional scheme object to inject as context
 * @returns {Promise<string>} - The AI response text
 */
export async function sendGeminiMessage(history, newMessage, schemeContext = null) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('GEMINI_API_KEY is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  // Build scheme context injection if provided
  let contextualMessage = newMessage;
  if (schemeContext) {
    contextualMessage = `[User is viewing the scheme: "${schemeContext.title}" - ${schemeContext.description}]\n\nUser message: ${newMessage}`;
  }

  // Build contents array from history + new message
  const contents = [];

  // Add conversation history
  for (const msg of history) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    });
  }

  // Add the new user message
  contents.push({
    role: 'user',
    parts: [{ text: contextualMessage }],
  });

  const requestBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No response received from Gemini API.');
  }

  return text;
}

export default sendGeminiMessage;
