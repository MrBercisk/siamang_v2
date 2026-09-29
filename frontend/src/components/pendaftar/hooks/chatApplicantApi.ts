import { apiRequest } from '../../../lib/api';

interface ChatApiResponse {
  success: boolean;
  message: string;
}

/**
 * Mengirim pesan ke asisten AI SIAMANG (Laravel -> n8n -> Gemini/Groq).
 * Token diambil otomatis oleh apiRequest() dari localStorage (lihat lib/api.ts).
 */
export async function sendInternChatMessage(message: string, sessionId: string): Promise<string> {
  const res = await apiRequest<ChatApiResponse>('/intern/chat', {
    method: 'POST',
    data: { message, session_id: sessionId },
  });

  if (!res.success || !res.message) {
    throw new Error('Format respons chat tidak valid.');
  }

  return res.message;
}