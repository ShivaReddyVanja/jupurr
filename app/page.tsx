import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Eye, Plus } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/newbg.png" alt="Sci-fi landscape background" fill className="object-cover" priority />
      </div>

      {/* Content Overlay */}
      <div className="relative z-200 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-2 lg:p-4">
          <div className="flex items-center">
            <Image src="/jupurr.png" alt="Jupurr Logo" width={40} height={40} className="aspect-auto align-middle" />
            <p className="text-white font-semibold md:mt-2 text-lg">Jupurr</p>
          </div>
          <Link href="/jupurr">
            <Button
              variant="outline"
              className="bg-green-500/20 border-green-400/50 text-green-400 hover:bg-green-500/30 hover:text-green-300"
            >
              Try it now
            </Button>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 lg:px-8 text-center">
          {/* Cat Mascot */}
          <div className="mb-2">
            <Image
              src="/jupurr.png"
              alt="Jupurr Cat Mascot"
              width={200}
              height={150}
              className=""
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-hero  leading-tight">
            DeFi that{" "} purrs back.
      
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-lg lg:text-xl text-gray-300 mb-6 max-w-2xl leading-relaxed font-poppins">
            Cuddly Ai companion that can hanlde swaps, buys, 
            <br />
            triggers & more using jupiter for you !
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Button
              variant="outline"
              className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white px-6 py-3"
            >
              Swap 60 SOL to SOLChat
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white px-6 py-3"
            >
              Send 0.2 SOL to @friend
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white px-6 py-3"
            >
              View portfolio
              <Eye className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Wallet Connection Interface */}
          <div className="w-full max-w-2xl">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-2 flex justify-between items-center">
              <div className="flex items-center justify-between ">
                <input
                  type="text"
                  placeholder="Connect my wallet nya~"
                  className="bg-transparent text-gray-300 placeholder-gray-500 text-sm sm:text-lg  outline-none w-fit"
                  readOnly
                />
              </div>
              <div className="flex items-center">
              
                <Link href="/jupurr">
                  <Button className="button-primary hover:bg-green-600 text-black font-semibold px-6 py-2 rounded-lg">
                    Try it now
             
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
