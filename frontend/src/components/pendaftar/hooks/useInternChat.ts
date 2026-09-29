import { useCallback, useRef, useState } from 'react';
import { ApiError } from '../../../lib/api';
import { sendInternChatMessage } from './chatApplicantApi';
import type { ChatMessage } from '../../../types/chat';

function createMessage(role: ChatMessage['role'], content: string, isError = false): ChatMessage {
  return {
    id: `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
    isError,
  };
}

export function useInternChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, createMessage('user', trimmed)]);
    setSending(true);

    try {
      const reply = await sendInternChatMessage(trimmed, sessionIdRef.current);
      setMessages((prev) => [...prev, createMessage('assistant', reply)]);
    } catch (err) {
      const msg = err instanceof ApiError
        ? err.message
        : 'Asisten sedang tidak tersedia. Coba lagi beberapa saat lagi.';
      setMessages((prev) => [...prev, createMessage('assistant', msg, true)]);
    } finally {
      setSending(false);
    }
  }, [sending]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    sessionIdRef.current = crypto.randomUUID(); // percakapan baru = memory baru
  }, []);

  return { messages, sending, sendMessage, clearMessages };
}