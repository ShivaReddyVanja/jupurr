
'use client';
import { useState, useEffect, useRef } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { handleWalletStatus } from '@/services';
import { handleSend } from "@/services/handleSend"
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { Message } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JupiterQuoteResponse = any;

type SwapDetails = { amount: number; fromToken: string; toToken: string };


export default function Chat() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingJupiterQuote, setPendingJupiterQuote] = useState<JupiterQuoteResponse | null>(null);
  const [pendingSwapDetails, setPendingSwapDetails] = useState<SwapDetails | null>(null);

  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();
  const lastmessageRef = useRef<HTMLDivElement>(null)

  const bgGradient = "bg-[linear-gradient(0deg,rgba(21,30,40,0.6),rgba(21,30,40,0.6)),linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.2))]"



  useEffect(() => {
    handleWalletStatus(connected, publicKey, setMessages);
  }, [connected, publicKey]);

  useEffect(() => {
    const scrollToDiv = () => {
      if (lastmessageRef.current) {
        lastmessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    scrollToDiv()
  }, [messages])

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
    <div className="min-h-screen h-full w-full flex  flex-col">
      {/* Background Image */}
      <div
        className="fixed inset-0 opacity-100"
        style={{
          backgroundImage: "url('/newbg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Header */}
      <header className={`relative  flex items-center justify-between px-6 py-2 ${bgGradient} backdrop-blur-sm border-b border-slate-700/50`}>
        <div className="flex items-center">
          <div className="">
            {/* <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-80"></div> */}
            <Image src={"/jupurr.png"} height={40} width={40} alt="juprr" />
          </div>
          <span className="text-white font-semibold text-lg mt-2">Jupurr</span>
        </div>
        {/* Replaced static connect button with WalletMultiButton */}
        <div className='z-1000'>
             <WalletMultiButton className="wallet-adapter-button custom-wallet-button " />
        </div>
     
      </header>

      {/* Main Content */}
      <div className={`relative  flex flex-col flex-1 w-full items-center px-6  h-full my-4 `}>
        {/* Main Chat Modal */}
        <div className={`flex flex-col  w-full h-full max-w-3xl flex-1 backdrop-blur-[20px] rounded-3xl border border-slate-700/50 shadow-2xl ${bgGradient} h-[80vh] max-h-[80vh] overflow-hidden `}>
          {/* Chat Messages Area */}
          <div className="p-4 space-y-2 h-full overflow-y-auto  flex-1 chat-messages w-5/6 mx-auto">
            {/* Dynamic Chat Messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} w-full`}>
                {msg.sender === 'bot' && (
                  <div className="flex items-center mb-1">
                    <div className="z-10 flex-shrink-0 w-6 h-6">
                      <Image src="/nojupurr.png" height={40} width={40} alt="juprr" className="rounded-full" />
                    </div>
                    <div className="text-white text-[8px] md:text-xs ml-1">Jupurr</div>
                  </div>
                )}
                <div ref={messages.length - 1 === i ? lastmessageRef : null} className={`overflow-x-hidden flex flex-col justify-end gap-3 max-w-lg ${msg.sender==='user' && "flex-col-reverse"} `}>
                  <div className={`${msg.sender === 'user' ? 'text-[#002D24] bg-[linear-gradient(90deg,#F4FCD5_0%,#8CF4BF_100%)]' : 'text-white'} rounded-2xl px-2 py-2 shadow-lg backdrop-blur-sm border border-slate-700/30`}>
                    <p className="text-[8px] md:text-xs leading-relaxed">{msg.text}
                      {msg.url && 
                        <Link href={msg.url}><span className='text-green-400 underline block'>View on Explorer</span></Link>
                      }
              
                       </p>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 self-end text-white font-medium text-[8px] md:text-xs flex-shrink-0 flex mr-6 items-center">
                      <Image src="/punk.webp" width={40} height={40} alt="punk" className="rounded-full" />
                      <p className="px-1">Me</p>
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


          {/* Suggestions and input  */}
          <div className='rounded-xl  custom-gradient-border shadow-[0px_1.48px_5.91px_0px_rgba(0,0,0,0.08)] backdrop-[blur(21.9px)] w-5/6 mx-auto mb-6'

          >
            <div className=' w-full bg-black/80 rounded-xl'>
              {/* Suggested Prompts (can integrate with `setInput` if needed) */}
              <div className="px-6 py-2 border-t border-slate-700/30 w-full">

                <h3 className="text-slate-300 text-xs font-medium mb-2">Suggested prompts:</h3>
                <div className="flex flex-wrap gap-2 w-full">
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
                    className={`button-primary hover:to-emerald-600 text-black font-medium px-3 md:px-6 rounded-xl text-sm`}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}