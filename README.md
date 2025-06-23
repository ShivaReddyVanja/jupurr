Jupurr - AI Assistant for Jupiter Features
Overview
Jupurr is a delightful, cat-themed AI assistant built to simplify interaction with Jupiter's features on the Solana blockchain, starting with token swapping. With a playful personality, Jupurr purrs, speaks cutely, and answers both crypto and general questions. Currently, it supports token swaps, with plans to add trigger orders and recurring transactions soon.
Features

AI-Powered Chat: Ask Jupurr anything—crypto queries or random questions—and enjoy its cat-like, playful responses.
Token Swapping: Execute swaps on Jupiter with commands like "swap 0.001 SOL to USDC".
Transaction Approval: Securely approve transactions via your Solana wallet.
Cat-Themed Personality: Jupurr’s purrs and cute dialogue make crypto fun!
Upcoming Features: Support for trigger orders, recurring transactions, and more.

Tech Stack

Frontend: Next.js for a fast, server-rendered React app.
Solana Integration:
@solana/web3.js: For Solana blockchain interactions.
@solana/wallet-adapter: For wallet connections and management.


AI Backend: Powered by Gemini API for natural language processing.
Jupiter Integration: Leverages Jupiter’s infrastructure for token swaps (no API key required).

Getting Started
Prerequisites

Node.js (v16 or higher)
A Solana wallet (e.g., Phantom, Solflare)
Gemini API key for AI functionality
Basic understanding of Solana and Jupiter

Installation

Clone the repository:git clone https://github.com/yourusername/jupurr.git
cd jupurr


Install dependencies:npm install


Set up environment variables:Create a .env.local file in the root directory with the following:NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
GEMINI_API_KEY=your_gemini_api_key


Run the development server:npm run dev


Visit http://localhost:3000 in your browser.

Usage

Connect your Solana wallet through the app.
Chat with Jupurr! Ask about crypto or anything else.
To swap tokens, say:swap 0.001 SOL to USDC


Approve the transaction in your wallet.
Jupurr will confirm the swap with a happy purr!

Roadmap

Add trigger orders and recurring transactions.
Enhance AI with more cat-themed animations and responses.
Support additional Jupiter features as they roll out.

Contributing
Want to make Jupurr even more pawsome? Here’s how:

Fork the repository.
Create a branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Submit a pull request.

License
Licensed under the MIT License. See LICENSE for details.
Contact
For support or feedback, reach out on Twitter or open a GitHub issue.
Enjoy swapping with Jupurr’s purrs! 🐾
