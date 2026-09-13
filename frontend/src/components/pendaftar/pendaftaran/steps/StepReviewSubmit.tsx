import { FormEvent } from 'react';
import { BiodataState, DocumentFile, RegistrationType, TeamMember } from '../../types';
import { showToast, showWarningAlert } from '../../../../utils/swal';

interface StepReviewSubmitProps {
  biodata: BiodataState;
  registrationType: RegistrationType;
  teamMembers: TeamMember[];
  selectedBidang: string;
  selectedKategori: string;
  selectedLowongan: string;
  documents: DocumentFile[];
  isDeclared: boolean;
  setIsDeclared: (value: boolean) => void;
  onEditStep: (step: number) => void;
  onBack: () => void;
  onSubmit: (e: FormEvent) => void;
}

export function StepReviewSubmit({
  biodata,
  registrationType,
  teamMembers,
  selectedBidang,
  selectedKategori,
  selectedLowongan,
  documents,
  isDeclared,
  setIsDeclared,
  onEditStep,
  onBack,
  onSubmit,
}: StepReviewSubmitProps) {
  const handleViewDocument = (doc: DocumentFile) => {
    showToast('info', `Melihat berkas: ${doc.fileName}`);
  };

  const handleDeleteInReview = () => {
    showWarningAlert(
      'Belum Bisa Dihapus di Sini',
      'Untuk menghapus atau mengganti berkas, silakan kembali ke langkah "Berkas Pendaftaran" melalui tombol Ubah.'
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-8">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Review Pendaftaran</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Periksa kembali seluruh data yang telah Anda lengkapi sebelum melakukan submit.
          </p>
        </div>

        {/* SECTION 1: BIODATA */}
        <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-lg">account_circle</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Biodata</h3>
            </div>

            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="px-3.5 py-1.5 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Ubah</span>
              <span className="material-symbols-outlined text-sm">edit_note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
              <h4 className="font-bold text-[#1f877c] text-xs border-b border-slate-200/80 pb-1.5">Informasi Personal</h4>
              <div><span className="text-slate-400 block font-medium">Nama Lengkap</span><span className="font-bold text-slate-900">{biodata.fullName}</span></div>
              <div><span className="text-slate-400 block font-medium">Email</span><span className="font-bold text-slate-900">{biodata.email}</span></div>
              <div><span className="text-slate-400 block font-medium">No. Handphone</span><span className="font-bold text-slate-900">{biodata.phone}</span></div>
              <div><span className="text-slate-400 block font-medium">Alamat Lengkap</span><span className="font-bold text-slate-900">{biodata.address}</span></div>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
              <h4 className="font-bold text-[#1f877c] text-xs border-b border-slate-200/80 pb-1.5">Informasi Akademik</h4>
              <div><span className="text-slate-400 block font-medium">Nama Kampus / Universitas</span><span className="font-bold text-slate-900">{biodata.university}</span></div>
              <div><span className="text-slate-400 block font-medium">Program Studi</span><span className="font-bold text-slate-900">{biodata.major}</span></div>
              <div><span className="text-slate-400 block font-medium">Semester</span><span className="font-bold text-slate-900">{biodata.semester}</span></div>
              <div><span className="text-slate-400 block font-medium">NIM</span><span className="font-bold text-slate-900">{biodata.nim}</span></div>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
              <h4 className="font-bold text-[#1f877c] text-xs border-b border-slate-200/80 pb-1.5">Informasi Project</h4>
              <div><span className="text-slate-400 block font-medium">Judul / Informasi project</span><span className="font-bold text-slate-900">{biodata.projectTitle}</span></div>
              <div><span className="text-slate-400 block font-medium">Keahlian</span><span className="font-bold text-slate-900">{biodata.skills}</span></div>
              <div><span className="text-slate-400 block font-medium">Tools yang dikuasai</span><span className="font-bold text-slate-900">{biodata.tools}</span></div>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
              <h4 className="font-bold text-[#1f877c] text-xs border-b border-slate-200/80 pb-1.5">Periode Magang</h4>
              <div><span className="text-slate-400 block font-medium">Tanggal Mulai</span><span className="font-bold text-slate-900">{biodata.startDate}</span></div>
              <div><span className="text-slate-400 block font-medium">Tanggal Selesai</span><span className="font-bold text-slate-900">{biodata.endDate}</span></div>
            </div>
          </div>
        </div>

        {/* SECTION 2: TIPE PENDAFTARAN */}
        <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-lg">group</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Tipe Pendaftaran</h3>
            </div>

            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="px-3.5 py-1.5 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Ubah</span>
              <span className="material-symbols-outlined text-sm">edit_note</span>
            </button>
          </div>

          <div className="text-xs text-slate-700 flex items-center gap-6">
            <div><span className="text-slate-400 font-medium mr-2">Tipe Pendaftaran:</span><span className="font-bold text-slate-900">{registrationType}</span></div>
            {registrationType === 'Kelompok' && (
              <div><span className="text-slate-400 font-medium mr-2">Jumlah Anggota:</span><span className="font-bold text-slate-900">{teamMembers.length + 1} Orang</span></div>
            )}
          </div>

          {registrationType === 'Kelompok' && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-900">Anggota Kelompok</h4>

              <div className="p-3.5 bg-[#E6F7F3]/70 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E6F7F3] text-[#1f877c] border border-emerald-300">Ketua Tim</span>
                  <span className="font-bold text-slate-900">{biodata.fullName}</span>
                </div>
                <span className="text-slate-600">{biodata.email}</span>
                <span className="text-slate-600">{biodata.phone}</span>
              </div>

              {teamMembers.map((m, i) => (
                <div key={m.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 w-24">Anggota {i + 2}</span>
                    <span className="font-bold text-slate-900">{m.fullName || 'Belum diisi'}</span>
                  </div>
                  <span className="text-slate-600">{m.email || '-'}</span>
                  <span className="text-slate-600">{m.phone || '-'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: BIDANG & KATEGORI */}
        <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-lg">category</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Bidang & Kategori</h3>
            </div>

            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="px-3.5 py-1.5 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Ubah</span>
              <span className="material-symbols-outlined text-sm">edit_note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-bold block mb-1">
                Bidang yang dipilih
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {selectedBidang}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-bold block mb-1">
                Kategori yang dipilih
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {selectedKategori}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-bold block mb-1">
                Lowongan yang dipilih
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {selectedLowongan}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: BERKAS PENDAFTARAN */}
        <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-lg">folder</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Berkas Pendaftaran</h3>
            </div>

            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="px-3.5 py-1.5 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Ubah</span>
              <span className="material-symbols-outlined text-sm">edit_note</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-2">No</th>
                  <th className="py-2.5 px-2">Jenis Berkas</th>
                  <th className="py-2.5 px-2">File</th>
                  <th className="py-2.5 px-2">Ukuran</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {documents.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-2 font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-2 font-bold text-slate-900">{doc.name}</td>
                    <td className="py-3 px-2 text-slate-600 font-mono">{doc.fileName || '-'}</td>
                    <td className="py-3 px-2 text-slate-500">{doc.maxSize}</td>
                    <td className="py-3 px-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Lengkap
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleViewDocument(doc)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1f877c] text-emerald-700 hover:bg-[#E6F7F3] cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditStep(4)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1f877c] text-emerald-700 hover:bg-[#E6F7F3] cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteInReview}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-400 text-rose-500 hover:bg-rose-50 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 5: PERNYATAAN */}
        <div className="p-5 bg-[#E6F7F3] border border-emerald-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <span className="material-symbols-outlined text-emerald-700 text-lg">verified</span>
            <span>Pernyataan</span>
          </div>

          <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 leading-relaxed">
            <input
              type="checkbox"
              checked={isDeclared}
              onChange={(e) => setIsDeclared(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-emerald-400 text-[#1f877c] focus:ring-[#1f877c] cursor-pointer"
            />
            <span>
              Saya menyatakan bahwa semua data yang saya isi adalah benar dan dapat dipertanggungjawabkan. Saya memahami bahwa data yang sudah di submit tidak dapat diubah.
            </span>
          </label>
        </div>

        {/* Bottom Bar Footer Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Kembali
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            Submit Pendaftaran
          </button>
        </div>
      </div>
    </form>
  );
}