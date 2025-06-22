import { Message } from '@/types';

export class MessageService {
  static addMessage(
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    text: string,
    sender: 'user' | 'bot' = 'bot',
  ) {
    setMessages((prev) => [...prev, { sender, text }]);
  }

  static addError(
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    error: string,
  ) {
    setMessages((prev) => [...prev, { sender: 'bot', text: `❌ ${error}` }]);
  }
}