const STORAGE_PREFIX = 'siamang_forum_last_read_';
export const FORUM_READ_UPDATED_EVENT = 'siamang-forum-read-updated';

export function getLastReadTimestamp(bimbinganId: string | number): number {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${bimbinganId}`);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function setLastReadTimestamp(bimbinganId: string | number, timestamp: number): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${bimbinganId}`, String(timestamp));
  } catch {
    // Abaikan error storage 
  }
  window.dispatchEvent(new Event(FORUM_READ_UPDATED_EVENT));
}