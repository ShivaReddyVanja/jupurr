import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Eye, Plus } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/bg.png" alt="Sci-fi landscape background" fill className="object-cover" priority />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-6 lg:p-8">
          <div className="flex items-center">
            <Image src="/jupiter.png" alt="Jupurr Logo" width={120} height={40} className="h-10 w-auto" />
            <p className="text-white">Jupurr</p>

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
          <div className="mb-8">
            <Image
              src="/jupurr.png"
              alt="Jupurr Cat Mascot"
              width={300}
              height={120}
              className="w-24 h-24 lg:w-32 lg:h-32"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
            DeFi that{" "}
            <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              purrs back.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg lg:text-xl text-gray-300 mb-12 max-w-2xl leading-relaxed">
            Jupurr, your cuddly AI cat, purrs
            <br />
            through all Jupiter —just chat!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
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
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  placeholder="Connect my wallet nya~"
                  className="bg-transparent text-gray-300 placeholder-gray-500 text-lg flex-1 outline-none"
                  readOnly
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">0.0000</span>
                <Link href="/jupurr">
                  <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-2 rounded-lg">
                    Try it now
                    <Plus className="ml-2 h-4 w-4" />
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
