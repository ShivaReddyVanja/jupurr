// src/services/walletService.ts
import { PublicKey } from '@solana/web3.js';
import { MessageService } from './messageService';

export class WalletService {
  static handleWalletStatus(
    connected: boolean,
    publicKey: PublicKey | null,
    setMessages: React.Dispatch<React.SetStateAction<{ sender: string; text: string }[]>>,
  ) {
    const message = connected && publicKey
      ? `Wallet connected: ${publicKey.toBase58().slice(0, 8)}...`
      : 'Wallet disconnected.';
    MessageService.addMessage(setMessages, message);
  }
}