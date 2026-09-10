import { ChangeEvent } from 'react';
import { DocumentFile } from '../types';
import { showWarningAlert, showToast } from '../../../utils/swal';

interface StepBerkasProps {
  documents: DocumentFile[];
  onUpload: (docId: number, e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: (docId: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepBerkas({ documents, onUpload, onDelete, onBack, onNext }: StepBerkasProps) {
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

  const handleViewDocument = (doc: DocumentFile) => {
    showToast('info', `Melihat berkas: ${doc.fileName}`);
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
            {documents.map((doc, idx) => (
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
                        <input type="file" onChange={(e) => onUpload(doc.id, e)} className="hidden" />
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
                      <input type="file" onChange={(e) => onUpload(doc.id, e)} className="hidden" />
                      <span className="material-symbols-outlined text-base">upload</span>
                    </label>
                  )}
                </td>
              </tr>
            ))}
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
    </div>
  );
}