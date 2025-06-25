// src/services/walletService.ts
import { PublicKey } from '@solana/web3.js';
import { MessageService } from './messageService';
import { Message } from '@solana/web3.js';

export class WalletService {
  static handleWalletStatus(
    connected: boolean,
    publicKey: PublicKey | null,
    setMessages: React.Dispatch<React.SetStateAction<{ sender: "user" | "bot"; text: string }[]>>,
  ) {
    const message = connected && publicKey
      ? `Wallet connected: ${publicKey.toBase58().slice(0, 8)}...`
      : 'Wallet disconnected.';
    MessageService.addMessage(setMessages, message);
  }
}