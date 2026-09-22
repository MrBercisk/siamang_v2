import { FormEvent, useCallback, useEffect, useState } from 'react';
import { User } from '../../../types/auth';
import { ApiError } from '../../../lib/api';
import { showToast } from '../../../utils/swal';
import { formatChatTime } from '../../../utils/formatters';
import { useBimbinganMentorList } from '../hooks/useBimbinganMentorList';
import { fetchForumMessages, sendForumMessage } from '../hooks/forumMentorApi';

interface ForumDiskusiTabProps {
  user: User;
}

export function ForumDiskusiTab({ user }: ForumDiskusiTabProps) {
  const { items: bimbinganItems, loading: bimbinganLoading, error: bimbinganError } =
    useBimbinganMentorList();
  const [selectedBimbinganId, setSelectedBimbinganId] = useState('');
  const [chatMessages, setChatMessages] = useState<Awaited<ReturnType<typeof fetchForumMessages>>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!selectedBimbinganId && bimbinganItems.length > 0) {
      setSelectedBimbinganId(bimbinganItems[0].id);
    }
  }, [bimbinganItems, selectedBimbinganId]);

  const loadMessages = useCallback(async (silent = false) => {
    if (!selectedBimbinganId) {
      setChatMessages([]);
      return;
    }

    if (!silent) setLoadingMessages(true);
    try {
      const messages = await fetchForumMessages(selectedBimbinganId);
      setChatMessages(messages);
    } catch (err) {
      if (!silent) {
        showToast('error', err instanceof ApiError ? err.message : 'Gagal memuat pesan forum.');
      }
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, [selectedBimbinganId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!selectedBimbinganId) return;

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
  }, [loadMessages, selectedBimbinganId]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const message = inputMessage.trim();
    if (!message || !selectedBimbinganId || sending) return;

    setSending(true);
    try {
      const newMessage = await sendForumMessage(selectedBimbinganId, message);
      setChatMessages((current) => [...current, newMessage]);
      setInputMessage('');
      showToast('success', 'Pesan berhasil dikirim!');
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal mengirim pesan.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Petunjuk Penggunaan Box */}
      <div className="p-4 rounded-xl bg-[#E6F7F3] border border-[#C6EFE7] text-slate-700 text-xs sm:text-sm font-medium">
        <span className="font-bold text-[#1f877c]">Forum Diskusi:</span> Pilih mahasiswa bimbingan untuk melihat dan membalas percakapan.
      </div>

      {/* CHAT CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs flex flex-col min-h-[480px]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label htmlFor="forum-bimbingan" className="text-xs font-bold text-slate-700">
            Mahasiswa bimbingan
          </label>
          <select
            id="forum-bimbingan"
            value={selectedBimbinganId}
            onChange={(event) => setSelectedBimbinganId(event.target.value)}
            disabled={bimbinganLoading || bimbinganItems.length === 0}
            className="w-full sm:w-80 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-[#1f877c]"
          >
            {bimbinganItems.length === 0 ? (
              <option value="">Belum ada mahasiswa bimbingan</option>
            ) : (
              bimbinganItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama} - {item.judulProject}
                </option>
              ))
            )}
          </select>
        </div>

        {bimbinganError && (
          <p className="mb-3 text-xs font-medium text-red-500">Gagal memuat daftar bimbingan: {bimbinganError}</p>
        )}

        {/* Scrollable messages area */}
        <div className="flex-1 bg-[#F1F5F9]/70 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 min-h-[360px]">
          {loadingMessages ? (
            <p className="text-center text-xs font-medium text-slate-500">Memuat pesan...</p>
          ) : chatMessages.length === 0 ? (
            <p className="text-center text-xs font-medium text-slate-500">Belum ada pesan pada percakapan ini.</p>
          ) : chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'mentor' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`p-4 rounded-2xl max-w-lg shadow-2xs space-y-1.5 ${
                  msg.role === 'mentor'
                    ? 'bg-[#1f877c] text-white rounded-br-none'
                    : 'bg-[#E3F2FD] text-slate-800 rounded-bl-none'
                }`}
              >
                <span
                  className={`block text-xs font-extrabold uppercase tracking-wide ${
                    msg.role === 'mentor' ? 'text-teal-100' : 'text-slate-900'
                  }`}
                >
                  {msg.sender}
                </span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {msg.message}
                </p>
                <span
                  className={`block text-[10px] ${
                    msg.role === 'mentor' ? 'text-teal-200' : 'text-slate-400'
                  }`}
                >
                  {formatChatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM CHAT INPUT */}
        <form
          onSubmit={handleSendMessage}
          className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-100"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Tulis pesan ..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#1f877c] focus:ring-1 focus:ring-[#1f877c]"
            disabled={!selectedBimbinganId || sending}
          />
          <button
            type="submit"
            className="w-11 h-11 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer"
            title="Kirim Pesan"
            disabled={!selectedBimbinganId || sending}
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </form>

      </div>

    </div>
  );
}