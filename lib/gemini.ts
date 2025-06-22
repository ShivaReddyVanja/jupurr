import { GoogleGenerativeAI } from '@google/generative-ai';


export async function parseIntent(message: string,prompt:string,genAI:GoogleGenerativeAI): Promise<{
  intent: string;
  amount?: number;
  fromToken?: string;
  toToken?: string;
  response?: string;
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
 

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // THIS IS THE KEY PART FOR GUARANTEED JSON OUTPUT
        responseMimeType: 'application/json',
        temperature: 0.1, 
        topP: 0.9,
        topK: 40,

      },
    });
    const response = await result.response.text();
    return JSON.parse(response.trim());
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      intent: 'unknown',
      response: 'Sorry, something went wrong. Try again or type "swap [amount] [fromToken] to [toToken]".',
    };
  }
}