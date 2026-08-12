import { useState, FormEvent } from 'react';
import { User } from '../../../types/auth';
import { ChatMessage } from '../../../types/mentor';
import { showToast } from '../../../utils/swal';
import { initialChatMessages } from '../../../data/mentorSampleData';

interface ForumDiskusiTabProps {
  user: User;
}

export function ForumDiskusiTab({ user }: ForumDiskusiTabProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: user.name || 'Mentor Aplikasi',
      role: 'mentor',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setChatMessages([...chatMessages, newMessage]);
    setInputMessage('');
    showToast('success', 'Pesan berhasil dikirim!');
  };

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Petunjuk Penggunaan Box */}
      <div className="p-4 rounded-xl bg-[#E6F7F3] border border-[#C6EFE7] text-slate-700 text-xs sm:text-sm font-medium">
        <span className="font-bold text-[#1f877c]">Petunjuk Penggunaan:</span> Ini adalah menu chat bagi peserta magang. Anda dapat melakukan diskusi dengan mentor terkait magang.
      </div>

      {/* CHAT CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs flex flex-col min-h-[480px]">

        {/* Scrollable messages area */}
        <div className="flex-1 bg-[#F1F5F9]/70 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 min-h-[360px]">
          {chatMessages.map((msg) => (
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
                  {msg.timestamp}
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
          />
          <button
            type="submit"
            className="w-11 h-11 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer"
            title="Kirim Pesan"
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </form>

      </div>

    </div>
  );
}