import { FormEvent, useCallback, useEffect, useState } from 'react';
import { User } from '../../../types/auth';
import { ApiError } from '../../../lib/api';
import { showToast } from '../../../utils/swal';
import { formatChatTime } from '../../../utils/formatters';
import { fetchApplicantForumMessages, sendApplicantForumMessage } from '../hooks/forumApplicantApi';

interface ForumDiskusiPesertaTabProps {
  user: User;
}

export function ForumDiskusiPesertaTab({ user }: ForumDiskusiPesertaTabProps) {
  const [chatMessages, setChatMessages] = useState<Awaited<ReturnType<typeof fetchApplicantForumMessages>>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const loadMessages = useCallback(async (silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const messages = await fetchApplicantForumMessages();
      setChatMessages(messages);
    } catch (err) {
      if (!silent) {
        showToast('error', err instanceof ApiError ? err.message : 'Gagal memuat pesan forum.');
      }
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    const refreshMessages = () => {
      if (document.visibilityState === 'visible') {
        void loadMessages(true);
      }
    };
    const intervalId = window.setInterval(refreshMessages, 3000);

    document.addEventListener('visibilitychange', refreshMessages);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refreshMessages);
    };
  }, [loadMessages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const message = inputMessage.trim();
    if (!message || sending) return;

    setSending(true);
    try {
      const newMessage = await sendApplicantForumMessage(message);
      setChatMessages((current) => [...current, newMessage]);
      setInputMessage('');
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal mengirim pesan.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 animate-in fade-in flex flex-col h-[550px]">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Forum Diskusi Magang</h2>
        <p className="text-xs text-slate-500">
          Ruang komunikasi antara peserta magang dan mentor DISKOMINFOSAN Kota Yogyakarta.
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 overflow-y-auto space-y-3 text-xs">
        {loadingMessages ? (
          <p className="text-center text-slate-500">Memuat pesan...</p>
        ) : chatMessages.length === 0 ? (
          <p className="text-center text-slate-500">Belum ada pesan pada percakapan ini.</p>
        ) : (
          chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'mentor' ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-bold text-[10px] text-slate-600">{msg.sender}</span>
                <span className="text-[9px] text-slate-400">{formatChatTime(msg.timestamp)}</span>
              </div>
              <div
                className={`p-3 rounded-2xl max-w-xs sm:max-w-md text-xs leading-relaxed ${
                  msg.role === 'mentor'
                    ? 'bg-white border border-slate-200 text-slate-800'
                    : 'bg-[#1f877c] text-white'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Send Box */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ketik pesan atau pertanyaan untuk mentor..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#1f877c] focus:ring-1 focus:ring-[#1f877c]"
          disabled={sending}
        />
        <button
          type="submit"
          className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={sending || !inputMessage.trim()}
        >
          <span className="material-symbols-outlined text-base">send</span>
          <span>Kirim</span>
        </button>
      </form>
    </div>
  );
}