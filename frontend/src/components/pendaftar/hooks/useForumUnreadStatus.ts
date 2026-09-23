import { useCallback, useEffect, useState } from 'react';
import { fetchApplicantForumMessages } from './forumApplicantApi';
import { getLastReadTimestamp, FORUM_READ_UPDATED_EVENT } from '../../../utils/forumReadTracker';

const READ_KEY = 'applicant_forum';
const POLL_INTERVAL_MS = 20000;

export function useForumUnreadStatus() {
  const [hasUnread, setHasUnread] = useState(false);

  const checkUnread = useCallback(async () => {
    try {
      const messages = await fetchApplicantForumMessages();
      const lastRead = getLastReadTimestamp(READ_KEY);
      const unread = messages.some((msg) => {
        if (msg.role !== 'mentor' || !msg.timestamp) return false;
        return new Date(msg.timestamp).getTime() > lastRead;
      });
      setHasUnread(unread);
    } catch {
      // Diamkan, coba lagi di siklus berikutnya.
    }
  }, []);

  useEffect(() => {
    void checkUnread();
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') void checkUnread();
    }, POLL_INTERVAL_MS);
    window.addEventListener(FORUM_READ_UPDATED_EVENT, checkUnread);
    document.addEventListener('visibilitychange', checkUnread);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(FORUM_READ_UPDATED_EVENT, checkUnread);
      document.removeEventListener('visibilitychange', checkUnread);
    };
  }, [checkUnread]);

  return { hasUnread, refreshUnreadStatus: checkUnread };
}