import { useState } from 'react';

export function HelpChatWidget() {
  const [showHelpChat, setShowHelpChat] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={() => setShowHelpChat(!showHelpChat)}
        className="w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold shadow-xl flex items-center justify-center transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl">chat_bubble</span>
      </button>

      {showHelpChat && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <h4 className="text-xs font-bold text-slate-800">Bantuan SI AMANG</h4>
            <button type="button" onClick={() => setShowHelpChat(false)} className="text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Ada pertanyaan terkait pendaftaran magang? Silakan hubungi admin DISKOMINFOSAN Kota Yogyakarta.
          </p>
          <button
            type="button"
            onClick={() => window.open('https://wa.me/628123456789', '_blank')}
            className="w-full bg-[#1f877c] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#196e65]"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>Hubungi Admin WA</span>
          </button>
        </div>
      )}
    </div>
  );
}