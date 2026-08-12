import { useState, FormEvent } from 'react';
import { User } from '../../../types/auth';

interface ForumMessage {
  id: number;
  sender: string;
  time: string;
  text: string;
  isMentor: boolean;
}

interface ForumDiskusiPesertaTabProps {
  user: User;
}

export function ForumDiskusiPesertaTab({ user }: ForumDiskusiPesertaTabProps) {
  const [forumMessages, setForumMessages] = useState<ForumMessage[]>([
    {
      id: 1,
      sender: 'Bpk. Ahmad Fauzi (Mentor DISKOMINFOSAN)',
      time: '08:30 WIB',
      text: 'Selamat pagi rekan-rekan magang. Harap persiapkan draf laporan mingguan untuk sesi bimbingan besok.',
      isMentor: true,
    },
    {
      id: 2,
      sender: user.name || 'Leona Strive',
      time: '08:45 WIB',
      text: 'Baik Pak Ahmad, draf laporan dan progress modul SI AMANG sudah siap untuk direview.',
      isMentor: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setForumMessages([
      ...forumMessages,
      {
        id: Date.now(),
        sender: user.name || 'Leona Strive',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        text: newMessage,
        isMentor: false,
      },
    ]);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 animate-in fade-in flex flex-col h-[550px]">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Forum Diskusi Magang</h2>
        <p className="text-xs text-slate-500">Ruang komunikasi antara peserta magang dan mentor DISKOMINFOSAN Kota Yogyakarta.</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 overflow-y-auto space-y-3 text-xs">
        {forumMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMentor ? 'items-start' : 'items-end'}`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bold text-[10px] text-slate-600">{msg.sender}</span>
              <span className="text-[9px] text-slate-400">{msg.time}</span>
            </div>
            <div
              className={`p-3 rounded-2xl max-w-xs sm:max-w-md text-xs leading-relaxed ${
                msg.isMentor
                  ? 'bg-white border border-slate-200 text-slate-800'
                  : 'bg-[#1f877c] text-white'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Send Box */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ketik pesan atau pertanyaan untuk mentor..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
        />
        <button
          type="submit"
          className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">send</span>
          <span>Kirim</span>
        </button>
      </form>
    </div>
  );
}