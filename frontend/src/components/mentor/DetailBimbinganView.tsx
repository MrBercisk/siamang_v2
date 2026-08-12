import React, { useState } from 'react';
import { showSuccessAlert, showToast } from '../../utils/swal';

export interface BimbinganData {
  id: number;
  nama: string;
  fotoUrl: string;
  kategori: string;
  judulProject: string;
  tipePendaftaran: string;
  lastUpdate: string;
  status: 'On Progress' | 'Selesai';
  progress: number;
  ketua: string;
  anggota2: string;
  anggota3: string;
  progressList: Array<{
    id: number;
    tanggal: string;
    pencapaian: string;
    catatan: string;
    filePresentasi?: string;
  }>;
  laporanList: Array<{
    id: number;
    judulLaporan: string;
    fileLaporan: string;
    linkProject: string;
    formNilai: string;
    status?: 'disetujui' | 'ditolak' | 'pending';
  }>;
  nilai: {
    kehadiran: number;
    kemampuanKerja: number;
    kualitasKerja: number;
    kerjasama: number;
    inisiatifKreativitas: number;
    disiplin: number;
    suratKeteranganName?: string;
  };
}

interface DetailBimbinganViewProps {
  bimbingan: BimbinganData;
  onBack: () => void;
  onUpdateBimbingan: (updated: BimbinganData) => void;
}

export const DetailBimbinganView: React.FC<DetailBimbinganViewProps> = ({
  bimbingan,
  onBack,
  onUpdateBimbingan,
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'laporan' | 'nilai'>('progress');

  // Nilai state
  const [scores, setScores] = useState({
    kehadiran: bimbingan.nilai.kehadiran || 0,
    kemampuanKerja: bimbingan.nilai.kemampuanKerja || 0,
    kualitasKerja: bimbingan.nilai.kualitasKerja || 0,
    kerjasama: bimbingan.nilai.kerjasama || 0,
    inisiatifKreativitas: bimbingan.nilai.inisiatifKreativitas || 0,
    disiplin: bimbingan.nilai.disiplin || 0,
  });

  const [suratFile, setSuratFile] = useState<string | undefined>(
    bimbingan.nilai.suratKeteranganName
  );

  const handleScoreChange = (field: keyof typeof scores, val: number) => {
    const num = Math.min(10, Math.max(0, val));
    setScores((prev) => ({ ...prev, [field]: num }));
  };

  // Calculate Average
  const totalScore =
    scores.kehadiran +
    scores.kemampuanKerja +
    scores.kualitasKerja +
    scores.kerjasama +
    scores.inisiatifKreativitas +
    scores.disiplin;

  const averageScore = Number((totalScore / 6).toFixed(1));

  let predikat = 'Belum Ada Predikat';
  if (averageScore >= 8.5) predikat = 'Sangat Baik (A)';
  else if (averageScore >= 7.5) predikat = 'Baik (B)';
  else if (averageScore >= 6.0) predikat = 'Cukup (C)';
  else if (averageScore > 0) predikat = 'Kurang (D)';

  const handleSavePenilaian = () => {
    const updated = {
      ...bimbingan,
      nilai: {
        ...scores,
        suratKeteranganName: suratFile,
      },
    };
    onUpdateBimbingan(updated);
    showSuccessAlert(
      'Penilaian Berhasil Disimpan!',
      `Nilai rata-rata ${averageScore}/10 (${predikat}) telah tersimpan untuk ${bimbingan.nama}.`
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSuratFile(file.name);
      showToast('success', `File ${file.name} berhasil diunggah!`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      {/* HEADER & BREADCRUMB */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Detail Bimbingan Mahasiswa</h2>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
          <button
            type="button"
            onClick={onBack}
            className="hover:underline cursor-pointer text-slate-600 font-medium"
          >
            Bimbingan Mahasiswa
          </button>
          <span className="text-slate-400">&gt;</span>
          <span className="text-[#1f877c] font-semibold">Detail Bimbingan Mahasiswa</span>
        </div>
      </div>

      {/* TOP CARD: PROFILE SUMMARY & PROGRESS (Matching Screenshot 2 & 3) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* LEFT: PHOTO & NAME & BASIC INFO */}
          <div className="md:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={bimbingan.fotoUrl}
              alt={bimbingan.nama}
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-xs shrink-0"
            />
            <div className="space-y-3 text-center sm:text-left">
              <h3 className="text-lg font-bold text-slate-900">{bimbingan.nama}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">Tipe Pendaftaran</span>
                  <span className="font-bold text-slate-800">{bimbingan.tipePendaftaran}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">Kategori</span>
                  <span className="font-bold text-slate-800 truncate block max-w-[140px]" title={bimbingan.kategori}>
                    {bimbingan.kategori}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block text-[11px]">Judul Project</span>
                  <span className="font-bold text-slate-800 truncate block max-w-[140px]" title={bimbingan.judulProject}>
                    {bimbingan.judulProject}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PROGRESS SAAT INI (Huge 70%) */}
          <div className="md:col-span-5 bg-slate-50/60 p-4 rounded-xl border border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Progress Saat ini</span>
            <div className="text-3xl font-black text-slate-900">{bimbingan.progress}%</div>
            <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#1f877c] h-3 rounded-full transition-all duration-500"
                style={{ width: `${bimbingan.progress}%` }}
              />
            </div>
          </div>

        </div>

        {/* ANGGOTA KELOMPOK (3) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-slate-800">
            Anggota Kelompok (3)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E6F7F3] text-[#1f877c] border border-[#C6EFE7]">
                Ketua Kelompok
              </span>
              <span className="font-bold text-slate-800">{bimbingan.ketua}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-600 w-24">Anggota 2</span>
              <span className="font-semibold text-slate-800">{bimbingan.anggota2}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-600 w-24">Anggota 3</span>
              <span className="font-semibold text-slate-800">{bimbingan.anggota3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CARD: TABS FOR PROGRESS MAGANG, LAPORAN, NILAI */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        
        {/* TAB HEADER */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('progress')}
            className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'progress'
                ? 'border-[#1f877c] text-[#1f877c] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Progress Magang
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('laporan')}
            className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'laporan'
                ? 'border-[#1f877c] text-[#1f877c] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Laporan
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nilai')}
            className={`px-6 py-3.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'nilai'
                ? 'border-[#1f877c] text-[#1f877c] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Nilai
          </button>
        </div>

        {/* TAB 1: PROGRESS MAGANG (Matching Screenshot 2) */}
        {activeTab === 'progress' && (
          <div className="p-6">
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-900 font-bold bg-slate-50/60">
                    <th className="py-3.5 px-4 text-center w-12">No</th>
                    <th className="py-3.5 px-4">Tanggal Bimbingan</th>
                    <th className="py-3.5 px-4">Pencapaian</th>
                    <th className="py-3.5 px-4">Catatan</th>
                    <th className="py-3.5 px-4 text-center">File Presentasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bimbingan.progressList.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-medium whitespace-nowrap">
                        {item.tanggal}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {item.pencapaian}
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {item.catatan}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => showToast('info', 'Mengunduh file presentasi...')}
                          className="px-4 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          Download File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: LAPORAN (Matching User Screenshot) */}
        {activeTab === 'laporan' && (
          <div className="p-6">
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-800 font-bold bg-white">
                    <th className="py-4 px-6 text-center w-16">No</th>
                    <th className="py-4 px-6">Judul Laporan</th>
                    <th className="py-4 px-6 text-center">File Laporan</th>
                    <th className="py-4 px-6">Link Project</th>
                    <th className="py-4 px-6 text-center">Form Nilai</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bimbingan.laporanList.map((lap, idx) => (
                    <tr key={lap.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-5 px-6 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-5 px-6 font-semibold text-slate-800 whitespace-nowrap">
                        {lap.judulLaporan}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => showToast('info', `Mengunduh File Laporan (${lap.fileLaporan})...`)}
                          className="px-6 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          Download File
                        </button>
                      </td>
                      <td className="py-5 px-6">
                        <a
                          href={lap.linkProject}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-700 hover:text-[#1f877c] font-medium transition-colors break-all"
                        >
                          {lap.linkProject}
                        </a>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => showToast('info', `Mengunduh Form Nilai (${lap.formNilai})...`)}
                          className="px-6 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          Download File
                        </button>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              showToast('success', 'Laporan disetujui!');
                            }}
                            className="w-9 h-9 rounded-xl border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] flex items-center justify-center cursor-pointer transition-all"
                            title="Setujui Laporan"
                          >
                            <span className="material-symbols-outlined text-lg font-bold">check_circle</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              showToast('info', 'Laporan ditolak / minta revisi.');
                            }}
                            className="w-9 h-9 rounded-xl border border-rose-400 text-rose-500 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-all"
                            title="Tolak / Revisi Laporan"
                          >
                            <span className="material-symbols-outlined text-lg font-bold">cancel</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: NILAI (Matching Screenshot 3) */}
        {activeTab === 'nilai' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT: TABLE ASPECT OF EVALUATION (7 COLS) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                  <table className="w-full text-left text-xs divide-y divide-slate-100">
                    <thead>
                      <tr className="bg-slate-50/60 text-slate-900 font-bold border-b border-slate-200">
                        <th className="py-3.5 px-4 text-center w-12">No</th>
                        <th className="py-3.5 px-4">Aspek Penilaian</th>
                        <th className="py-3.5 px-4 text-center w-36">Nilai Mentor (0-10)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">1</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">Kehadiran</td>
                        <td className="py-2 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={scores.kehadiran}
                            onChange={(e) =>
                              handleScoreChange('kehadiran', Number(e.target.value))
                            }
                            className="w-16 text-center border border-slate-200 rounded-lg py-1 px-2 font-bold text-slate-900 focus:outline-hidden focus:border-[#1f877c]"
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">2</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">Kemampuan Kerja</td>
                        <td className="py-2 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={scores.kemampuanKerja}
                            onChange={(e) =>
                              handleScoreChange('kemampuanKerja', Number(e.target.value))
                            }
                            className="w-16 text-center border border-slate-200 rounded-lg py-1 px-2 font-bold text-slate-900 focus:outline-hidden focus:border-[#1f877c]"
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">3</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">Kualitas kerja</td>
                        <td className="py-2 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={scores.kualitasKerja}
                            onChange={(e) =>
                              handleScoreChange('kualitasKerja', Number(e.target.value))
                            }
                            className="w-16 text-center border border-slate-200 rounded-lg py-1 px-2 font-bold text-slate-900 focus:outline-hidden focus:border-[#1f877c]"
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">4</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">Kerjasama</td>
                        <td className="py-2 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={scores.kerjasama}
                            onChange={(e) =>
                              handleScoreChange('kerjasama', Number(e.target.value))
                            }
                            className="w-16 text-center border border-slate-200 rounded-lg py-1 px-2 font-bold text-slate-900 focus:outline-hidden focus:border-[#1f877c]"
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">5</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">Inisiatif &amp; Kreativitas</td>
                        <td className="py-2 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={scores.inisiatifKreativitas}
                            onChange={(e) =>
                              handleScoreChange('inisiatifKreativitas', Number(e.target.value))
                            }
                            className="w-16 text-center border border-slate-200 rounded-lg py-1 px-2 font-bold text-slate-900 focus:outline-hidden focus:border-[#1f877c]"
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">6</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">Disiplin</td>
                        <td className="py-2 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={scores.disiplin}
                            onChange={(e) =>
                              handleScoreChange('disiplin', Number(e.target.value))
                            }
                            className="w-16 text-center border border-slate-200 rounded-lg py-1 px-2 font-bold text-slate-900 focus:outline-hidden focus:border-[#1f877c]"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* SUMMARY BOX AT FOOTER (Matching Screenshot 3) */}
                  <div className="p-4 bg-[#E6F7F3]/70 border-t border-[#C6EFE7] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">Rata-Rata Nilai Akhir</span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-slate-500 font-medium">Predikat:</span>
                        <span className="font-bold text-rose-600">
                          {averageScore === 0 ? 'Belum Ada Predikat' : predikat}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-black text-[#1f877c]">
                        {averageScore} / 10
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: UPLOAD SURAT KETERANGAN MAGANG & SIMPAN (5 COLS) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                
                {/* Upload Box */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">
                    Upload Surat Keterangan Magang
                  </h4>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#1f877c] cursor-pointer transition-all shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                      {suratFile || 'Pilih surat keterangan magang'}
                    </span>
                    <span className="material-symbols-outlined text-slate-400 text-lg">
                      file_upload
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Submit Action Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleSavePenilaian}
                    className="px-6 py-3 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Simpan Penilaian
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
