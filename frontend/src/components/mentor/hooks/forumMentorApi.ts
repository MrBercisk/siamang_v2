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

export async function fetchForumMessages(bimbinganId: string): Promise<ChatMessage[]> {
  const response = await apiRequest<ApiCollection<BackendChatMessage>>(
    `/mentor/forum?bimbingan_id=${encodeURIComponent(bimbinganId)}`
  );
  return response.data.map(mapMessage);
}

export async function sendForumMessage(
  bimbinganId: string,
  message: string
): Promise<ChatMessage> {
  const response = await apiRequest<ApiItem<BackendChatMessage>>('/mentor/forum', {
    method: 'POST',
    data: { bimbingan_id: Number(bimbinganId), message },
  });
  return mapMessage(response.data);
}