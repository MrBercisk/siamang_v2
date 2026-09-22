import { apiRequest } from '../../../lib/api';
import type { ChatMessage } from '../../../types/mentor';

interface ApiCollection<T> {
  data: T[];
}

interface ApiItem<T> {
  data: T;
}

interface BackendChatMessage {
  id: number | string;
  bimbinganId: number | string;
  senderId?: number | string | null;
  sender?: string | null;
  role?: 'mentor' | 'applicant' | null;
  message: string;
  timestamp?: string | null;
}

function mapMessage(item: BackendChatMessage): ChatMessage {
  return {
    id: item.id,
    bimbinganId: item.bimbinganId,
    senderId: item.senderId ?? undefined,
    sender: item.sender || 'Pengguna',
    role: item.role === 'mentor' ? 'mentor' : 'applicant',
    message: item.message,
    timestamp: item.timestamp || '',
  };
}

/**
 * Peserta hanya punya satu bimbingan aktif, jadi endpoint ini tidak
 * memerlukan bimbingan_id -- backend menentukannya dari user yang login.
 * Sesuaikan path '/pendaftar/forum' jika endpoint sebenarnya berbeda.
 */
export async function fetchApplicantForumMessages(): Promise<ChatMessage[]> {
  const response = await apiRequest<ApiCollection<BackendChatMessage>>('/intern/forum');
  return response.data.map(mapMessage);
}

export async function sendApplicantForumMessage(message: string): Promise<ChatMessage> {
  const response = await apiRequest<ApiItem<BackendChatMessage>>('/intern/forum', {
    method: 'POST',
    data: { message },
  });
  return mapMessage(response.data);
}