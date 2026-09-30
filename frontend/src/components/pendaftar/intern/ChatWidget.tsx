import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatAudience, useInternChat } from '../hooks/useInternChat';

// Mapping elemen markdown -> class Tailwind, disamakan dengan skala teks (text-xs)
// yang dipakai komponen lain di dashboard peserta.
const markdownComponents = {
  p: (props: React.ComponentProps<'p'>) => (
    <p className="text-xs leading-relaxed text-slate-700 mb-2 last:mb-0" {...props} />
  ),
  strong: (props: React.ComponentProps<'strong'>) => (
    <strong className="font-bold text-slate-900" {...props} />
  ),
  ul: (props: React.ComponentProps<'ul'>) => (
    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700 mb-2" {...props} />
  ),
  ol: (props: React.ComponentProps<'ol'>) => (
    <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-700 mb-2" {...props} />
  ),
  li: (props: React.ComponentProps<'li'>) => <li {...props} />,
  h1: (props: React.ComponentProps<'h4'>) => (
    <h4 className="text-xs font-bold text-slate-900 mt-2 mb-1" {...props} />
  ),
  h2: (props: React.ComponentProps<'h4'>) => (
    <h4 className="text-xs font-bold text-slate-900 mt-2 mb-1" {...props} />
  ),
  h3: (props: React.ComponentProps<'h4'>) => (
    <h4 className="text-xs font-bold text-slate-900 mt-2 mb-1" {...props} />
  ),
  table: (props: React.ComponentProps<'table'>) => (
    <div className="overflow-x-auto mb-2 rounded-lg border border-slate-200">
      <table className="min-w-full text-[11px]" {...props} />
    </div>
  ),
  thead: (props: React.ComponentProps<'thead'>) => (
    <thead className="bg-slate-50" {...props} />
  ),
  th: (props: React.ComponentProps<'th'>) => (
    <th
      className="px-2 py-1.5 text-left font-bold text-slate-700 border-b border-slate-200"
      {...props}
    />
  ),
  td: (props: React.ComponentProps<'td'>) => (
    <td className="px-2 py-1.5 text-slate-600 border-b border-slate-100" {...props} />
  ),
  code: (props: React.ComponentProps<'code'>) => (
    <code className="bg-slate-100 rounded px-1 py-0.5 text-[11px]" {...props} />
  ),
  a: (props: React.ComponentProps<'a'>) => (
    <a className="text-[#1f877c] underline" target="_blank" rel="noreferrer" {...props} />
  ),
};

const SUGGESTED_PROMPTS: Record<ChatAudience, string[]> = {
  public: [
    'Kapan periode magang aktif?',
    'Lowongan apa yang masih tersedia?',
    'Apa syarat pendaftaran?',
    'Apa kontak resmi SIAMANG?',
  ],
  applicant: [
    'Bagaimana status pendaftaran saya?',
    'Tampilkan riwayat pendaftaran saya.',
  ],
  intern: [
    'Berapa nilai dan siapa mentor saya?',
    'Kapan jadwal bimbingan saya?',
    'Berapa persen progress magang saya?',
    'Tampilkan catatan progress saya.',
    'Bagaimana status laporan magang saya?',
  ],
};

interface ChatWidgetProps {
  publicMode?: boolean;
  audience?: ChatAudience;
}

export function ChatWidget({ publicMode = false, audience }: ChatWidgetProps) {
  const chatAudience = audience ?? (publicMode ? 'public' : 'intern');
  const isPublic = chatAudience === 'public';
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sending, sendMessage } = useInternChat(chatAudience);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, sending, open]);

  const handleSend = () => {
    if (!input.trim() || sending) return;
    void sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return createPortal(
    <>
      {/* Tombol bubble mengambang, selalu terlihat di semua tab */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`fixed ${isPublic ? (open ? 'hidden' : 'bottom-24') : 'bottom-5'} right-5 z-40 w-14 h-14 rounded-full bg-[#1f877c] text-white shadow-xl flex items-center justify-center hover:bg-[#186b62] transition-colors cursor-pointer`}
        aria-label="Buka asisten SIAMANG"
      >
        <span className="material-symbols-outlined text-2xl">{open ? 'close' : 'chat'}</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="px-4 py-3 bg-[#1f877c] text-white flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-lg">smart_toy</span>
            <div>
              <p className="text-xs font-bold leading-none">Asisten SIAMANG</p>
              <p className="text-[10px] text-teal-50/80 mt-0.5">Tanya seputar magangmu</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-auto w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
              aria-label="Tutup asisten SIAMANG"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-slate-50/60">
            {messages.length === 0 && (
              <div className="mt-5 space-y-2">
                <p className="text-[11px] text-slate-400 text-center">Contoh pertanyaan</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTED_PROMPTS[chatAudience].map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      disabled={sending}
                      className="max-w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-[11px] leading-snug text-slate-600 hover:border-[#1f877c] hover:bg-[#E6F7F3] hover:text-[#005c55] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                    msg.role === 'user'
                      ? 'bg-[#1f877c] text-white text-xs'
                      : msg.isError
                      ? 'bg-red-50 border border-red-200 text-red-700 text-xs'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-xs">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2">
                  <p className="text-xs text-slate-400">Sedang mengetik...</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-200 bg-white flex items-end gap-2 shrink-0">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tulis pertanyaan..."
              rows={1}
              className="flex-1 resize-none text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1f877c]/30 max-h-24"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="w-9 h-9 rounded-xl bg-[#1f877c] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              aria-label="Kirim pesan"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}