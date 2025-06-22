// lib/jupiter.ts
import axios from 'axios';
import {  VersionedTransaction } from '@solana/web3.js';
// Assuming tokenData.ts exports the array of tokens as a default export
import tokenListData from "./tokenData"

// Define interfaces for the token data from the JSON
interface JupiterToken {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI: string;
  tags: string[];
  extensions?: { [key: string]: string };
}

// Interface for the processed token information we need
interface ProcessedTokenInfo {
  address: string;
  decimals: number;
}

// Global variable to store the processed token map
// This map will be populated synchronously when the module loads
const _tokenInfoMap: { [key: string]: ProcessedTokenInfo | undefined } = {};

// Populate the token map immediately when the module is imported
tokenListData.forEach((token: JupiterToken) => {
  _tokenInfoMap[token.symbol.toUpperCase()] = {
    address: token.address,
    decimals: token.decimals,
  };
});

console.log("Jupiter token map loaded from local file successfully.");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSwapQuote(amount: number, fromToken: string, toToken: string): Promise<any> {
  const fromTokenInfo = _tokenInfoMap[fromToken.toUpperCase()];
  const toTokenInfo = _tokenInfoMap[toToken.toUpperCase()];

  if (!fromTokenInfo || !toTokenInfo) {
    throw new Error('Unsupported token pair. Ensure both tokens are in the Jupiter list and correctly spelled.');
  }

  const inputMint = fromTokenInfo.address;
  const outputMint = toTokenInfo.address;
  const inputTokenDecimals = fromTokenInfo.decimals;

  const rawAmount = Math.floor(amount * Math.pow(10, inputTokenDecimals));

  try {
    const response = await axios.get('https://quote-api.jup.ag/v6/quote', {
      params: {
        inputMint,
        outputMint,
        amount: rawAmount,
        slippageBps: 50,
      },
    });
    
    const outputTokenDecimals = toTokenInfo.decimals;
    return {
        ...response.data,
        inAmountHuman: parseFloat(response.data.inAmount) / Math.pow(10, inputTokenDecimals),
        outAmountHuman: parseFloat(response.data.outAmount) / Math.pow(10, outputTokenDecimals),
        fromToken,
        toToken,
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Jupiter quote API error:", error.response?.data || error.message);
    throw new Error('Failed to fetch swap quote. Please try again.');
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSwapTransaction(quote: any, userPublicKey: string): Promise<VersionedTransaction> {
  try {
    const response = await axios.post('https://quote-api.jup.ag/v6/swap', {
      quoteResponse: quote, 
      userPublicKey,
      wrapAndUnwrapSol: true,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return VersionedTransaction.deserialize(Buffer.from(response.data.swapTransaction, 'base64'));

  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Jupiter swap transaction API error:", error.response?.data || error.message);
    throw new Error('Failed to fetch swap transaction. ' + (error.response?.data?.error || error.message));
  }
}