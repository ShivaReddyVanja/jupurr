
'use client';
import { useState, useEffect, useRef } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { handleWalletStatus } from '@/services';
import { handleSend } from "@/services/handleSend"
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JupiterQuoteResponse = any; 

type SwapDetails = { amount: number; fromToken: string; toToken: string };
type Message = { sender: "user" | "bot"; text: string };

export default function Chat() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [pendingJupiterQuote, setPendingJupiterQuote] = useState<JupiterQuoteResponse | null>(null);
  const [pendingSwapDetails, setPendingSwapDetails] = useState<SwapDetails | null>(null);

  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();
  const lastmessageRef = useRef<HTMLDivElement>(null)



  useEffect(() => {
    handleWalletStatus(connected, publicKey, setMessages);
  }, [connected, publicKey]);

  useEffect(()=>{
    const scrollToDiv = () => {
    if (lastmessageRef.current) {
      lastmessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  scrollToDiv()
  },[messages])

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
    <div className="min-h-screen h-full  relative  w-full flex  flex-col justify-between">
      {/* Background Image */}
      <div
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-2 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center">
          <div className="">
            {/* <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-80"></div> */}
               <Image src={"/jupurr.png"} height={60} width={60} alt="juprr" />
          </div>
          <span className="text-white font-semibold text-lg">Jupurr</span>
        </div>
        {/* Replaced static connect button with WalletMultiButton */}
        <WalletMultiButton className=" text-whit bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900" />
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full max-w-4xl mx-auto px-6 align-middle">
        {/* Main Chat Modal */}
        <div className="flex-1 flex items-center justify-center py-2">
          <div className="w-full max-w-3xl bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
            {/* Chat Messages Area */}
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {/* Dynamic Chat Messages */}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-center`}>
                  {msg.sender === 'bot' && (
                    <div className='z-10 items-center flex-shrink-0'>
                      <Image src={"/jupurr.png"} height={40} width={40} alt="juprr" className='apect-auto' />

                    </div>
                  )}
                  <div ref={messages.length -1 === i ? lastmessageRef: null} className={`flex items-center gap-3 max-w-lg ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`rounded-2xl px-2 py-2 shadow-lg ${'bg-slate-800/80 backdrop-blur-sm border border-slate-700/30'}`}>
                      <p className={`${'text-slate-200'} text-[8px] md:text-xs leading-relaxed`}>
                        {msg.text}
                      </p>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-white font-medium text-[8px] md:text-xs flex-shrink-0">
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
            <div className="px-6 py-2 border-t border-slate-700/30">
              <div className="">
                <h3 className="text-slate-300 text-xs font-medium mb-2">Suggested prompts:</h3>
                <div className="flex flex-wrap gap-2">
                  {/* These buttons will set the input field directly */}
                  <button
                    onClick={() => setInput("swap 50 USDC to SOL")}
                    className="px-1.5 md:px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 rounded-full text-slate-300 text-[8px] md:text-xs transition-colors"
                  >
                    Swap 50 USDC to SOL
                  </button>
                  <button
                    onClick={() => setInput("Can you tell me about Solana?")}
                   className="px-1.5 md:px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 rounded-full text-slate-300 text-[8px] md:text-xs transition-colors"
                  >
                    Tell me about Solana
                  </button>
                  <button
                    onClick={() => setInput("Buy some bonk using my sol")}
                    className="px-1.5 md:px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 rounded-full text-slate-300 text-[8px] md:text-xs transition-colors"
                  >
                    Buy some bonk
                  </button>
                  <button
                    onClick={() => setInput("What is DeFi?")}
                    className="px-1.5 md:px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 rounded-full text-slate-300 text-[8px] md:text-xs transition-colors"
                  >
                    What is DeFi?
                  </button>
                </div>
              </div>
            </div>


            {/* Input Area */}
            <div className="p-3 pt-2">
              <div className="flex items-center gap-3 bg-black/80 backdrop-blur-sm rounded-2xl p-2 border border-slate-700/50">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Meow! type here nya~"
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-[8px] md:text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      onHandleSend();
                    }
                  }}
                />
                <Button
                  onClick={onHandleSend} 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-medium px-3 md:px-6 rounded-xl text-sm"
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