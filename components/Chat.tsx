
'use client';
import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { handleWalletStatus } from '@/services'; // Ensure this path is correct
import { handleSend } from "@/services/handleSend"
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JupiterQuoteResponse = any; 

type SwapDetails = { amount: number; fromToken: string; toToken: string };
type Message = { sender: string; text: string };

export default function Chat() {
  // Existing state from your functional Chat component
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(''); // Renamed from 'message' to 'input' to avoid conflict if you copy-pasted directly
  const [isLoading, setIsLoading] = useState(false);
  const [pendingJupiterQuote, setPendingJupiterQuote] = useState<JupiterQuoteResponse | null>(null);
  const [pendingSwapDetails, setPendingSwapDetails] = useState<SwapDetails | null>(null);

  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();



  useEffect(() => {
    handleWalletStatus(connected, publicKey, setMessages);
  }, [connected, publicKey]);

  // Function to pass to handleSend to update pending state
  const setPendingSwap = (quote: JupiterQuoteResponse | null, details: SwapDetails | null) => {
    setPendingJupiterQuote(quote);
    setPendingSwapDetails(details);
  };

  const onHandleSend = () => {
    handleSend(
      input, // Use 'input' here
      messages,
      setMessages,
      setIsLoading,
      setInput, // Use 'setInput' here
      setPendingSwap,
      connected,
      publicKey,
      connection,
      signTransaction,
      pendingJupiterQuote,
      pendingSwapDetails
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 relative overflow-hidden w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center">
          <div className="">
            {/* <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-80"></div> */}
               <Image src={"/jupurr.png"} height={60} width={60} alt="juprr" />
          </div>
          <span className="text-white font-semibold text-lg">Jupurr</span>
        </div>
        {/* Replaced static connect button with WalletMultiButton */}
        <WalletMultiButton className="bg-transparent border-slate-600 text-white hover:bg-slate-800 hover:border-slate-500" />
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto px-6">
        {/* Main Chat Modal */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-3xl bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
            {/* Chat Messages Area */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {/* Dynamic Chat Messages */}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-center`}>
                  {msg.sender === 'bot' && (
                    <div className='z-10 items-center'>
                      <Image src={"/jupurr.png"} height={40} width={40} alt="juprr" />

                    </div>
                  )}
                  <div className={`flex items-center gap-3 max-w-lg ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 shadow-lg ${'bg-slate-800/80 backdrop-blur-sm border border-slate-700/30'}`}>
                      <p className={`${'text-slate-200'} text-sm leading-relaxed`}>
                        {msg.text}
                      </p>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                        Me
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center py-2">
                  <span className="text-slate-400 text-sm">⏳ Loading...</span>
                </div>
              )}
            </div>

            {/* Suggested Prompts (can integrate with `setInput` if needed) */}
            <div className="px-6 py-4 border-t border-slate-700/30">
              <div className="mb-3">
                <h3 className="text-slate-300 text-xs font-medium mb-2">Suggested prompts:</h3>
                <div className="flex flex-wrap gap-2">
                  {/* These buttons will set the input field directly */}
                  <button
                    onClick={() => setInput("swap 50 USDC to SOL")}
                    className="px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 rounded-full text-slate-300 text-xs transition-colors"
                  >
                    Swap 50 USDC to SOL
                  </button>
                  <button
                    onClick={() => setInput("Can you tell me about Solana?")}
                    className="px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 rounded-full text-slate-300 text-xs transition-colors"
                  >
                    Tell me about Solana
                  </button>
                  <button
                    onClick={() => setInput("Buy some bonk using my sol")}
                    className="px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 rounded-full text-slate-300 text-xs transition-colors"
                  >
                    Buy some bonk
                  </button>
                  <button
                    onClick={() => setInput("What is DeFi?")}
                    className="px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 rounded-full text-slate-300 text-xs transition-colors"
                  >
                    What is DeFi?
                  </button>
                </div>
              </div>
            </div>


            {/* Input Area */}
            <div className="p-6 pt-4">
              <div className="flex items-center gap-3 bg-black/80 backdrop-blur-sm rounded-2xl p-3 border border-slate-700/50">
                <Input
                  value={input} // Bind to your 'input' state
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter prompt here nya~"
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      onHandleSend(); // Call your existing send handler
                    }
                  }}
                />
                <Button
                  onClick={onHandleSend} // Call your existing send handler
                  className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-medium px-6 rounded-xl text-sm"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}