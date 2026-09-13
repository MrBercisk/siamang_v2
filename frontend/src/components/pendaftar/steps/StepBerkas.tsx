import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DocumentFile } from '../types';
import { showWarningAlert } from '../../../utils/swal';

interface StepBerkasProps {
  documents: DocumentFile[];
  onUpload: (docId: number, e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: (docId: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepBerkas({ documents, onUpload, onDelete, onBack, onNext }: StepBerkasProps) {
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);

  const handleNext = () => {
    const missingDocs = documents.filter(
      (doc) => doc.required && doc.status !== 'Berhasil Upload'
    );

    if (missingDocs.length > 0) {
      showWarningAlert(
        'Berkas Wajib Belum Lengkap',
        `Mohon unggah terlebih dahulu: ${missingDocs.map((d) => d.name).join(', ')}.`
      );
      return;
    }

    onNext();
  };

  // Reset input value right after it fires, so re-selecting the exact
  // same file (e.g. after edit/delete) always triggers onChange again.
  const handleUploadChange = (docId: number, e: ChangeEvent<HTMLInputElement>) => {
    onUpload(docId, e);
    e.target.value = '';
  };

  const handleViewDocument = (doc: DocumentFile) => {
    setPreviewDoc(doc);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Upload Berkas Pendaftaran</h2>
        <p className="text-xs text-slate-500 mt-0.5">Pastikan semua berkas sesuai dengan ketentuan yang berlaku.</p>
      </div>

      {/* Alert Info */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-slate-700">
        <span className="material-symbols-outlined text-emerald-700 text-lg">info</span>
        <div>
          <span className="font-bold text-emerald-900 mr-1">Informasi:</span>
          <span>Semua berkas wajib diunggah dalam format yang sesuai dan dalam kondisi jelas terbaca.</span>
        </div>
      </div>

      {/* Table of Documents */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-700 font-bold">
              <th className="py-3 px-2">No</th>
              <th className="py-3 px-2">Jenis Berkas</th>
              <th className="py-3 px-2">Keterangan</th>
              <th className="py-3 px-2">Format</th>
              <th className="py-3 px-2">Ukuran Maks</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {documents.map((doc, idx) => {
              // Remount key: changes whenever this doc's upload state changes,
              // forcing the native <input type="file"> to fully reset instead
              // of silently keeping a stale value after a page/state reset.
              const inputKey = `${doc.id}-${doc.status}-${doc.fileName ?? 'empty'}`;

              return (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-2 font-medium text-slate-500">{idx + 1}</td>
                  <td className="py-4 px-2">
                    <span className="font-bold text-slate-900 block">{doc.name}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{doc.desc}</span>
                  </td>
                  <td className="py-4 px-2">
                    {doc.required ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Wajib
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Optional
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-2 font-medium text-slate-600">{doc.format}</td>
                  <td className="py-4 px-2 font-medium text-slate-600">{doc.maxSize}</td>
                  <td className="py-4 px-2">
                    {doc.status === 'Berhasil Upload' ? (
                      <span className="font-bold text-emerald-600 text-xs">Berhasil Upload</span>
                    ) : (
                      <span className="text-slate-400 font-medium">Belum Upload Berkas</span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center">
                    {doc.status === 'Berhasil Upload' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewDocument(doc)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1f877c] text-emerald-700 hover:bg-[#E6F7F3] cursor-pointer"
                          title="Lihat Berkas"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </button>
                        <label className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1f877c] text-emerald-700 hover:bg-[#E6F7F3] cursor-pointer inline-block">
                          <input
                            key={inputKey}
                            type="file"
                            onChange={(e) => handleUploadChange(doc.id, e)}
                            className="hidden"
                          />
                          <span className="material-symbols-outlined text-base block">edit</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => onDelete(doc.id)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-400 text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Hapus Berkas"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    ) : (
                      <label className="p-2 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] font-bold text-xs cursor-pointer inline-flex items-center gap-1">
                        <input
                          key={inputKey}
                          type="file"
                          onChange={(e) => handleUploadChange(doc.id, e)}
                          className="hidden"
                        />
                        <span className="material-symbols-outlined text-base">upload</span>
                      </label>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Bar Footer */}
      <div className="p-4 bg-[#E6F7F3] border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          Kembali
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer ml-auto"
        >
          Simpan & Lanjutkan
        </button>
      </div>

      {previewDoc && (
        <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}
    </div>
  );
}

function DocumentPreviewModal({ doc, onClose }: { doc: DocumentFile; onClose: () => void }) {
  const objectUrl = useMemo(() => {
    if (!doc.file) return null;
    return URL.createObjectURL(doc.file);
  }, [doc.file]);

  // Always revoke the object URL when it changes or the modal unmounts,
  // to avoid leaking memory.
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const mimeType = doc.file?.type ?? '';
  const isImage = mimeType.startsWith('image/');
  const isPdf = mimeType === 'application/pdf';

  return (
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
          {isImage && objectUrl && (
            <img
              src={objectUrl}
              alt={doc.fileName ?? doc.name}
              className="max-w-full max-h-[65vh] object-contain rounded-lg"
            />
          )}

          {isPdf && objectUrl && (
            <iframe
              src={objectUrl}
              title={doc.fileName ?? doc.name}
              className="w-full h-[65vh] rounded-lg border border-slate-200"
            />
          )}

          {!isImage && !isPdf && (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-4xl text-slate-300">description</span>
              <p className="text-xs text-slate-500 mt-2">
                {doc.file
                  ? 'Preview tidak tersedia untuk tipe berkas ini.'
                  : 'Berkas ini belum dimuat ulang dari server sehingga preview tidak tersedia.'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{doc.fileName}</p>
            </div>
          )}
        </div>

        {objectUrl && (
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
}