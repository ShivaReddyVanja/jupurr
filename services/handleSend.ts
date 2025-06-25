import { Connection, PublicKey } from '@solana/web3.js';
import { WalletAdapterProps } from '@solana/wallet-adapter-base';
import { processUserInput } from '@/services/processUserInput';
import { IntentService } from './intentService';
import { SwapService } from './swapService';
import { IntentData, Message, Quote, SwapDetails } from '@/types';
import { MessageService } from './messageService';

export async function handleSend(
  input: string,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  setPending: (quote: Quote | null, details: SwapDetails | null) => void,
  connected: boolean,
  publicKey: PublicKey | null,
  connection: Connection,
  signTransaction: WalletAdapterProps['signTransaction'] | undefined,
  pendingQuote: Quote | null,
  pendingSwap: SwapDetails | null,
) {
  if (!input.trim()) return;

  // Add the current user message to the messages state
  MessageService.addMessage(setMessages, input, 'user');
  setInput('');
  setIsLoading(true);

  // Find the last bot message that contains structured data (LLM's previous response)
  const lastBotMessage = messages.slice().reverse().find(msg => msg.sender === 'bot' && msg.text);
  const previousLLMResponseData = lastBotMessage ? lastBotMessage.text : null;

  try {
    // Pass the current user input, the full message history, and the previous LLM response data
    const data = await processUserInput(input, messages, previousLLMResponseData) as IntentData;
    const swapService = new SwapService(connection);
    const intentService = new IntentService(swapService);
    await intentService.handleIntent(data, { connected, publicKey, connection, signTransaction, pendingQuote, pendingSwap }, setMessages, setPending);
  } catch (error: any) {
    MessageService.addError(setMessages, `Error: ${error.message}`);
    setPending(null, null);
  } finally {
    setIsLoading(false);
  }
}