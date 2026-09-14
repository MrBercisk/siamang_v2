import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DocumentFile } from '../../types';

interface DocumentPreviewModalProps {
  doc: DocumentFile;
  onClose: () => void;
}

// mapping ektension
const EXTENSION_MIME_MAP: Record<string, string> = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  ogv: 'video/ogg',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
};

function resolveMimeType(file: File, fileName?: string | null): string {
  if (file.type) return file.type;

  const nameToCheck = fileName || file.name || '';
  const ext = nameToCheck.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSION_MIME_MAP[ext] ?? '';
}

export function DocumentPreviewModal({ doc, onClose }: DocumentPreviewModalProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [mediaError, setMediaError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  // Menyimpan URL yang aktif SAAT INI supaya cleanup hanya me-revoke URL
  // miliknya sendiri, bukan URL yang baru saja dibuat oleh run efek
  // berikutnya (menghindari race saat React StrictMode menjalankan efek
  // dua kali di development: mount → cleanup → mount ulang).
  const activeUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setMediaError(false);

    if (!doc.file) {
      setObjectUrl(null);
      setMimeType('');
      return;
    }

    let cancelled = false;

    const resolvedType = resolveMimeType(doc.file, doc.fileName);
    const blob =
      resolvedType && resolvedType !== doc.file.type
        ? new Blob([doc.file], { type: resolvedType })
        : doc.file;

    const url = URL.createObjectURL(blob);

    if (cancelled) {
      // Efek ini sudah keburu dibersihkan sebelum sempat commit (mis.
      // StrictMode double-invoke) — buang URL yang baru dibuat dan jangan
      // pernah set ke state supaya tidak dipakai video/img sama sekali.
      URL.revokeObjectURL(url);
      return;
    }

    activeUrlRef.current = url;
    setObjectUrl(url);
    setMimeType(resolvedType);

    return () => {
      cancelled = true;
      // Hanya revoke kalau URL ini memang yang terakhir aktif — mencegah
      // efek run pertama (StrictMode) me-revoke URL yang justru masih
      // dipakai oleh run kedua yang sudah commit duluan.
      if (activeUrlRef.current === url) {
        URL.revokeObjectURL(url);
        activeUrlRef.current = null;
      }
    };
  }, [doc.file, doc.fileName, retryCount]);

  // Pengaman tambahan: paksa elemen <video> memuat ulang sumbernya secara
  // eksplisit. Mengubah <source src> saja tidak selalu memicu browser
  // membaca ulang media — beberapa browser butuh .load() dipanggil manual,
  // terlepas dari remount via `key`.
  useEffect(() => {
    if (mimeType.startsWith('video/') && objectUrl && videoRef.current) {
      videoRef.current.load();
    }
  }, [objectUrl, mimeType]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // Lock background scroll while the modal is open, and make sure the
  // viewport is at the top so the centered overlay is immediately visible
  // no matter where on the page the trigger button was.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleRetry = () => {
    setMediaError(false);
    setRetryCount((c) => c + 1); // memicu efek membuat ulang object URL dari awal
  };

  const isImage = mimeType.startsWith('image/');
  const isPdf = mimeType === 'application/pdf';
  const isVideo = mimeType.startsWith('video/');

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-900">{doc.name}</p>
            <p className="text-[11px] text-slate-400">{doc.fileName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
            title="Tutup"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center p-4">
          {!objectUrl && doc.file && !mediaError && (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-4xl text-slate-300 animate-pulse">hourglass_empty</span>
              <p className="text-xs text-slate-500 mt-2">Memuat preview...</p>
            </div>
          )}

          {mediaError && (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-4xl text-rose-300">error</span>
              <p className="text-xs text-slate-500 mt-2">Gagal memuat preview berkas ini.</p>
              <p className="text-[11px] text-slate-400 mt-1">{doc.fileName}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 px-4 py-1.5 rounded-lg bg-[#1f877c] hover:bg-[#196e65] text-white text-xs font-bold cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {!mediaError && isImage && objectUrl && (
            <img
              src={objectUrl}
              alt={doc.fileName ?? doc.name}
              className="max-w-full max-h-[65vh] object-contain rounded-lg"
              onError={() => setMediaError(true)}
            />
          )}

          {!mediaError && isPdf && objectUrl && (
            <iframe
              src={objectUrl}
              title={doc.fileName ?? doc.name}
              className="w-full h-[65vh] rounded-lg border border-slate-200"
              onError={() => setMediaError(true)}
            />
          )}

          {!mediaError && isVideo && objectUrl && (
            <video
              key={objectUrl}
              ref={videoRef}
              controls
              muted
              playsInline
              preload="auto"
              className="max-w-full max-h-[65vh] rounded-lg bg-black"
              onLoadedData={(e) => {
                // Autoplay dipicu manual (bukan atribut autoPlay) supaya
                // penolakan promise oleh kebijakan autoplay browser tidak
                // dianggap error dan tidak memblokir render video itu sendiri.
                e.currentTarget.play().catch(() => {});
              }}
              onError={() => setMediaError(true)}
            >
              <source src={objectUrl} type={mimeType} />
              Browser Anda tidak mendukung pemutaran video.
            </video>
          )}

          {!mediaError && !isImage && !isPdf && !isVideo && objectUrl && (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-4xl text-slate-300">description</span>
              <p className="text-xs text-slate-500 mt-2">Preview tidak tersedia untuk tipe berkas ini.</p>
              <p className="text-[11px] text-slate-400 mt-1">{doc.fileName}</p>
            </div>
          )}

          {!doc.file && (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-4xl text-slate-300">description</span>
              <p className="text-xs text-slate-500 mt-2">
                Berkas ini belum dimuat ulang dari server sehingga preview tidak tersedia.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{doc.fileName}</p>
            </div>
          )}
        </div>

        {objectUrl && !mediaError && (
          <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
            <a
              href={objectUrl}
              download={doc.fileName}
              className="text-xs font-bold text-[#1f877c] hover:underline"
            >
              Unduh Berkas
            </a>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}