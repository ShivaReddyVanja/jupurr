import axios from 'axios';
import { Message } from '@/types'; // Ensure Message type includes 'data' property

export async function processUserInput(
  currentMessage: string,
  chatHistory: Message[], // Full chat history from the client
  previousLLMResponse: any | null // Last LLM response data for explicit context
) {
  // Convert chatHistory to Gemini's expected format for the 'history' parameter.
  // We filter out the *current* user message that was just added in handleSend,
  // as it will be sent separately as 'message'.
  const geminiHistory = chatHistory
    .filter(msg => !(msg.text === currentMessage && msg.sender === 'user' && chatHistory.indexOf(msg) === chatHistory.length - 1))
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'bot',
      parts: [{ text: msg.text }],
    }));

  try {
    const res = await axios.post('/api/gemini', {
      message: currentMessage, // The user's current input
      history: geminiHistory,  // All prior messages
      previousContext: previousLLMResponse, // Structured data from the bot's last turn
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = res.data;
    const { intent, amount, fromToken, toToken, response } = data;
    return { intent, amount, fromToken, toToken, response };

  } catch (error) {
    console.error('Error calling backend API:', error);
    return {
      intent: 'unknown', // Fallback intent
      response: 'Sorry, something went wrong. Please try again.',
    };
  }
}