import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';
import { WalletAdapterProps } from '@solana/wallet-adapter-base';
import { getSwapQuote, getSwapTransaction } from '@/lib/jupiter';
import { Quote, SwapDetails } from '@/types';

export class SwapService {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async getQuote(amount: number, fromToken: string, toToken: string): Promise<Quote> {
    // getSwapQuote already returns human-readable amounts along with the full Jupiter quote
    const jupiterQuoteResponse = await getSwapQuote(amount, fromToken, toToken);
    
    // Return the full Jupiter quote response, plus your human-readable fields
    return {
      ...jupiterQuoteResponse, // Spread all properties from the Jupiter quote response
      inAmountHuman: jupiterQuoteResponse.inAmountHuman,
      outAmountHuman: jupiterQuoteResponse.outAmountHuman,
      fromToken: jupiterQuoteResponse.fromToken, // Ensure these are still included if needed
      toToken: jupiterQuoteResponse.toToken,     // as they might not be in Jupiter's raw response top-level
    };
  }

  async executeSwap(
    quote: Quote, // This `quote` must contain the full Jupiter response
    publicKey: PublicKey,
    signTransaction: WalletAdapterProps['signTransaction'],
  ): Promise<TransactionSignature> {
    // Pass the entire `quote` object, as it now contains the full Jupiter quoteResponse
    const transaction = await getSwapTransaction(quote, publicKey.toBase58());
    const signedTx = await signTransaction(transaction);
    const txid = await this.connection.sendRawTransaction(signedTx.serialize());
  
    await this.connection.confirmTransaction(txid, 'confirmed');
    return txid;
  }

  formatQuoteMessage(quote: Quote): string {
    if (typeof quote.inAmountHuman === 'undefined' || typeof quote.outAmountHuman === 'undefined') {
        console.error("Quote missing human-readable amounts:", quote);
        // Fallback for display if human amounts are missing
        return `You'll get approximately ${quote.outAmount} ${quote.toToken} for ${quote.inAmount} ${quote.fromToken}. Do you want to proceed? (Type "yes" or "confirm")`;
    }
    
    return `You'll get approximately ${quote.outAmountHuman.toFixed(4)} ${quote.toToken} for ${quote.inAmountHuman.toFixed(4)} ${quote.fromToken}. Do you want to proceed? (Type "yes" or "confirm")`;
  }
}