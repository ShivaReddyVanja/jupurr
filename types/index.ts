

type geminiIntentParser = {
  intent: string;
  amount?: number;
  fromToken?: string;
  toToken?: string;
  response?: string;

}

import { PublicKey, Connection, TransactionSignature } from '@solana/web3.js';
import { WalletAdapterProps } from '@solana/wallet-adapter-base';

export interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export interface SwapDetails {
  amount: number; // Human-readable amount (e.g., 50 for 50 USDC)
  fromToken: string;
  toToken: string;
}

export interface Quote {
  inAmount: string; // Raw amount (e.g., micro-USDC)
  outAmount: string; // Raw amount (e.g., lamports for SOL)
  fromToken: string;
  toToken: string;
  inAmountHuman:number;
  outAmountHuman:number;
}

export interface IntentData {
  intent: 'swap' | 'swap_proceed' | 'general' | 'unknown' | 'clarify';
  amount?: number;
  fromToken?: string;
  toToken?: string;
  response: string;
}

export interface Context {
  connected: boolean;
  publicKey: PublicKey | null;
  connection: Connection;
  signTransaction: WalletAdapterProps['signTransaction'] | undefined;
  pendingQuote: Quote | null;
  pendingSwap: SwapDetails | null;
}

export interface IntentHandler {
  (
    data: IntentData,
    context: Context,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setPending: (quote: Quote | null, swap: SwapDetails | null) => void,
  ): Promise<void>;
}