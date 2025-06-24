import { parseIntent } from '@/lib/gemini';
import { getSwapQuote, getSwapTransaction } from '@/lib/jupiter';
import { PublicKey, Connection, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
import { WalletAdapterProps } from '@solana/wallet-adapter-base';
import { processUserInput } from './processUserInput';
import { Message } from '@/types';
type SwapDetails = { amount: number; fromToken: string; toToken: string };

type IntentHandler = (
  data: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setPendingSwap?: React.Dispatch<React.SetStateAction<SwapDetails | null>>,
  connected?: boolean,
  publicKey?: any,
  connection?: any,
  signTransaction?: any,
) => Promise<void>;

// Define types for better readability and safety
type SetMessages = React.Dispatch<React.SetStateAction<{ sender: string; text: string; }[]>>;
type SetIsLoading = React.Dispatch<React.SetStateAction<boolean>>;
type SetInput = React.Dispatch<React.SetStateAction<string>>;
type SetPendingSwap = (quote: any | null, details: { amount: number; fromToken: string; toToken: string } | null) => void;
type SignTransaction = WalletAdapterProps['signTransaction'];

// Handle wallet connection status
export const handleWalletStatus = (
  connected: boolean,
  publicKey: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
  const message:Message = connected && publicKey
    ? { sender: 'bot', text: `Wallet connected: ${publicKey.toBase58().slice(0, 8)}...` }
    : { sender: 'bot', text: 'Wallet disconnected.' };
  setMessages((prev) => [...prev, message]);
};

// Handle swap intent
export const handleSwap: IntentHandler = async (data, setMessages, setPendingSwap) => {
  if (!data.amount || !data.fromToken || !data.toToken || !data.response) {
    setMessages((prev) => [...prev, { sender: 'bot', text: '❌ Invalid swap details. Try "swap 0.1 USDC to SOL".' }]);
    return;
  }
  setPendingSwap!({ amount: data.amount, fromToken: data.fromToken, toToken: data.toToken });
  setMessages((prev) => [...prev, { sender: 'bot', text: `🎯 ${data.response}` }]);
};

// Handle swap proceed intent
export const handleSwapProceed: IntentHandler = async (
  data,
  setMessages,
  setPendingSwap,
  connected,
  publicKey,
  connection,
  signTransaction,
) => {
  if (!connected || !publicKey) {
    setMessages((prev) => [...prev, { sender: 'bot', text: '❌ Please connect your wallet first.' }]);
    return;
  }
  if (!data.amount || !data.fromToken || !data.toToken) {
    setMessages((prev) => [...prev, { sender: 'bot', text: '❌ No pending swap to proceed with.' }]);
    return;
  }
  try {
    const quote = await getSwapQuote(data.amount.toString(), data.fromToken, data.toToken);
    const transaction = await getSwapTransaction(quote, publicKey.toBase58());
    const signedTx = await signTransaction!(transaction);
    const txid = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txid, 'confirmed');
    setMessages((prev) => [
      ...prev,
      { sender: 'bot', text: `🚀 Swap executed: ${quote.inAmount} ${quote.fromToken} → ${quote.outAmount.toFixed(4)} ${quote.toToken}. TxID: ${txid}` },
    ]);
    setPendingSwap!(null);
  } catch (error: any) {
    setMessages((prev) => [...prev, { sender: 'bot', text: `❌ ${error.message || 'Swap failed.'}` }]);
  }
};

// Handle general and unknown intents
export const handleGeneral: IntentHandler = async (data, setMessages) => {
  setMessages((prev) => [...prev, { sender: 'bot', text: `💬 ${data.response}` }]);
};

export const handleUnknown: IntentHandler = async (data, setMessages) => {
  setMessages((prev) => [...prev, { sender: 'bot', text: `🤔 ${data.response}` }]);
};

// Intent handlers map
export const intentHandlers: Record<string, IntentHandler> = {
  swap: handleSwap,
  swap_proceed: handleSwapProceed,
  general: handleGeneral,
  unknown: handleUnknown,
};
