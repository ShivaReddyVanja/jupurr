// src/services/intentService.ts
import { SwapService } from './swapService';
import { MessageService } from './messageService';
import { IntentData, Context, Quote, SwapDetails } from '@/types';
import { Message } from '@/types';

export class IntentService {
  private swapService: SwapService;

  constructor(swapService: SwapService) {
    this.swapService = swapService;
  }

  async handleIntent(
    data: IntentData,
    context: Context,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setPending: (quote: Quote | null, swap: SwapDetails | null) => void,
  ) {
    switch (data.intent) {
      case 'swap':
        await this.handleSwap(data, context, setMessages, setPending);
        break;
      case 'swap_proceed':
        await this.handleSwapProceed(data, context, setMessages, setPending);
        break;
      case 'general':
      case 'clarify':
      case 'unknown':
        MessageService.addMessage(setMessages, data.response);
        setPending(null, null);
        break;
    }
  }

  private async handleSwap(
    data: IntentData,
    context: Context,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setPending: (quote: Quote | null, swap: SwapDetails | null) => void,
  ) {
    if (!context.connected || !context.publicKey) {
      MessageService.addError(setMessages, 'Please connect your wallet.');
      return;
    }
    if (!data.amount || !data.fromToken || !data.toToken) {
      MessageService.addError(setMessages, 'Invalid swap details. Try "swap 50 USDC to SOL".');
      return;
    }
    MessageService.addMessage(setMessages, `Fetching quote for ${data.amount} ${data.fromToken} to ${data.toToken}...`);
    try {
      const quote = await this.swapService.getQuote(data.amount, data.fromToken, data.toToken);
      setPending(quote, { amount: data.amount, fromToken: data.fromToken, toToken: data.toToken });
      MessageService.addMessage(setMessages, this.swapService.formatQuoteMessage(quote));
    } catch (error: any) {
      MessageService.addError(setMessages, `Error fetching quote: ${error.message}`);
      setPending(null, null);
    }
  }

  private async handleSwapProceed(
    data: IntentData,
    context: Context,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setPending: (quote: Quote | null, swap: SwapDetails | null) => void,
  ) {
    if (!context.connected || !context.publicKey) {
      MessageService.addError(setMessages, 'Please connect your wallet.');
      setPending(null, null);
      return;
    }
    if (!context.pendingQuote || !context.pendingSwap) {
      MessageService.addError(setMessages, 'No pending swap. Start a new swap first.');
      setPending(null, null);
      return;
    }
    MessageService.addMessage(setMessages, `Swapping ${context.pendingSwap.amount} ${context.pendingSwap.fromToken} to ${context.pendingSwap.toToken}...`);
    try {
      if (!context.signTransaction) {
        MessageService.addError(setMessages, 'Wallet does not support signing.');
        setPending(null, null);
        return;
      }
      const txid = await this.swapService.executeSwap(context.pendingQuote, context.publicKey, context.signTransaction);
      MessageService.addMessage(setMessages, `Swap successful! View: https://explorer.solana.com/tx/${txid}`);
      setPending(null, null);
    } catch (error: any) {
      MessageService.addError(setMessages, `Swap failed: ${error.message}`);
      setPending(null, null);
    }
  }
}