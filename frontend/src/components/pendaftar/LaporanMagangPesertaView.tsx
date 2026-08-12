import React, { useState } from 'react';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../utils/swal';

export type LaporanStatusType =
  | 'locked' // Progress < 100% (Halaman belum bisa diakses)
  | 'belum_upload' // Progress 100%, Belum Upload Laporan
  | 'pending' // Sudah upload, pending verification / 3 hari edit
  | 'ditolak' // Laporan Ditolak
  | 'diterima'; // Laporan Diterima

export interface LaporanItem {
  id: number;
  judulLaporan: string;
  fileLaporan: string;
  linkGoogleDrive: string;
  formNilai: string;
  nilaiMagang: string;
  tanggalUpload: string;
  status: 'pending' | 'ditolak' | 'diterima';
}

export const LaporanMagangPesertaView: React.FC = () => {
  // Simulator state to test all 5 conditions from screenshots
  const [currentScenario, setCurrentScenario] = useState<LaporanStatusType>('pending');

  // View state for when uploading or editing in 'belum_upload' or 'ditolak' state
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sample uploaded report data
  const [laporan, setLaporan] = useState<LaporanItem>({
    id: 1,
    judulLaporan: 'Design Web Aplikasi Magang',
    fileLaporan: 'Laporan_Design_Web_Aplikasi.pdf',
    linkGoogleDrive: 'Halaman Utama',
    formNilai: 'Form_Nilai_Design_Web.pdf',
    nilaiMagang: 'Belum Ada Nilai Magang',
    tanggalUpload: '2023-05-26 14:06:39',
    status: 'pending',
  });

  // Form input state
  const [formData, setFormData] = useState({
    judulLaporan: '',
    fileLaporan: '',
    linkGoogleDrive: '',
    formNilai: '',
  });

  const handleOpenForm = (initialJudul = '') => {
    setFormData({
      judulLaporan: initialJudul || laporan.judulLaporan || '',
      fileLaporan: laporan.fileLaporan || '',
      linkGoogleDrive: laporan.linkGoogleDrive || '',
      formNilai: laporan.formNilai || '',
    });
    setIsFormOpen(true);
  };

  const handleFileUpload = (
    field: 'fileLaporan' | 'formNilai',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showToast('error', 'File harus berformat PDF!');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToast('error', 'Ukuran file tidak boleh lebih dari 2 MB!');
        return;
      }
      setFormData((prev) => ({ ...prev, [field]: file.name }));
      showToast('success', `File ${file.name} dipilih.`);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judulLaporan || !formData.linkGoogleDrive) {
      showToast('error', 'Harap isi semua kolom wajib!');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setLaporan({
      id: Date.now(),
      judulLaporan: formData.judulLaporan,
      fileLaporan: formData.fileLaporan || 'Laporan_Magang_Terbaru.pdf',
      linkGoogleDrive: formData.linkGoogleDrive,
      formNilai: formData.formNilai || 'Form_Nilai.pdf',
      nilaiMagang: 'Belum Ada Nilai Magang',
      tanggalUpload: nowStr,
      status: 'pending',
    });

    showSuccessAlert('Laporan Berhasil Disimpan!', 'Laporan magang Anda telah terunggah.');
    setCurrentScenario('pending');
    setIsFormOpen(false);
  };

  const handleDeleteLaporan = async () => {
    const confirmed = await showConfirmAlert(
      'Hapus Laporan?',
      'Apakah Anda yakin ingin menghapus laporan ini?'
    );
    if (confirmed) {
      showSuccessAlert('Terhapus', 'Laporan magang berhasil dihapus.');
      setCurrentScenario('belum_upload');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      {/* SIMULATOR SWITCHER BAR (To easily test all 5 conditions from reference images) */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Simulasi Kondisi Akses Laporan Magang:</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            (Klik tombol untuk menguji 5 tampilan sesuai screenshot)
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setCurrentScenario('locked');
              setIsFormOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs ${
              currentScenario === 'locked'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            1. Belum 100% Progress (Terkunci)
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentScenario('belum_upload');
              setIsFormOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs ${
              currentScenario === 'belum_upload'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            2. 100% - Belum Upload
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentScenario('pending');
              setIsFormOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs ${
              currentScenario === 'pending'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            3. Sudah Upload (Edit 3 Hari)
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentScenario('ditolak');
              setIsFormOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs ${
              currentScenario === 'ditolak'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            4. Laporan Ditolak
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentScenario('diterima');
              setIsFormOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs ${
              currentScenario === 'diterima'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            5. Laporan Diterima
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. KONDISI 1: BELUM 100% PROGRESS (SCREENSHOT 1)           */}
      {/* ========================================================= */}
      {currentScenario === 'locked' && (
        <div className="min-h-[380px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-8 flex flex-col items-center justify-center text-center space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Halaman ini belum bisa diakses!
          </h2>
          <p className="text-sm text-slate-600 font-medium max-w-md">
            Selesaikan progress magang agar bisa upload laporan magang Anda.
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. KONDISI 2: BELUM UPLOAD LAPORAN / FORM (SCREENSHOT 2)  */}
      {/* ========================================================= */}
      {currentScenario === 'belum_upload' && (
        <div className="space-y-6">
          {/* Red Keterangan Banner */}
          <div className="p-4 px-6 rounded-2xl bg-[#e53935] text-white flex items-center gap-3 shadow-sm font-semibold text-xs sm:text-sm">
            <span className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center font-bold text-xs shrink-0">
              i
            </span>
            <span>Keterangan: Anda Belum Upload Laporan</span>
          </div>

          {/* Input Laporan Magang Form */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Input Laporan Magang</h3>

            <form onSubmit={handleSubmitForm} className="space-y-5 text-xs">
              
              {/* Judul Laporan */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">Judul Laporan</label>
                <input
                  type="text"
                  placeholder="Masukkan Judul Laporan Anda"
                  value={formData.judulLaporan}
                  onChange={(e) => setFormData({ ...formData, judulLaporan: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-[#1f877c] font-medium"
                  required
                />
              </div>

              {/* File Laporan (PDF) */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">File Laporan (PDF)</label>
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#1f877c] cursor-pointer transition-all">
                  <span className="text-slate-500 font-medium truncate">
                    {formData.fileLaporan || 'Pilih File'}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-lg">
                    file_upload
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload('fileLaporan', e)}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400 font-medium">
                  File harus berformat PDF dan tidak lebih dari 2 MB.
                </p>
              </div>

              {/* Link Google Drive */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">Link Google Drive</label>
                <input
                  type="text"
                  placeholder="Masukkan Link Google Drive Project Anda"
                  value={formData.linkGoogleDrive}
                  onChange={(e) => setFormData({ ...formData, linkGoogleDrive: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-[#1f877c] font-medium"
                  required
                />
              </div>

              {/* Form Nilai (PDF) */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">Form Nilai (PDF)</label>
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#1f877c] cursor-pointer transition-all">
                  <span className="text-slate-500 font-medium truncate">
                    {formData.formNilai || 'Pilih File'}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-lg">
                    file_upload
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload('formNilai', e)}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400 font-medium">
                  File harus berformat PDF dan tidak lebih dari 2 MB.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end pt-4">
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Simpan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. KONDISI 3: SUDAH UPLOAD / PENDING (SCREENSHOT 3)       */}
      {/* ========================================================= */}
      {currentScenario === 'pending' && !isFormOpen && (
        <div className="space-y-6">
          {/* Blue Keterangan Banner */}
          <div className="p-4 px-6 rounded-2xl bg-[#00a0e9] text-white flex items-center gap-3 shadow-sm font-semibold text-xs sm:text-sm">
            <span className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center font-bold text-xs shrink-0">
              i
            </span>
            <span>
              Keterangan: Anda Sudah Upload Laporan. Pengeditan dapat dilakukan dalam 3 hari.
            </span>
          </div>

          {/* Table Container Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Data Laporan Magang</h3>

            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-900 font-bold bg-white">
                      <th className="py-4 px-6 text-center w-16">No</th>
                      <th className="py-4 px-6">Judul Laporan</th>
                      <th className="py-4 px-6 text-center">File Laporan</th>
                      <th className="py-4 px-6">Link Google Drive</th>
                      <th className="py-4 px-6 text-center">Nilai Magang</th>
                      <th className="py-4 px-6 text-center whitespace-nowrap">Tanggal Upload</th>
                      <th className="py-4 px-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-5 px-6 text-center font-bold text-slate-400">1</td>
                      <td className="py-5 px-6 font-semibold text-slate-800">
                        {laporan.judulLaporan}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => showToast('info', `Mengunduh ${laporan.fileLaporan}...`)}
                          className="px-5 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          Download File
                        </button>
                      </td>
                      <td className="py-5 px-6 font-medium text-slate-700">
                        {laporan.linkGoogleDrive}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="px-4 py-2 rounded-full text-xs font-bold bg-[#fef3c7] text-[#b45309] border border-[#fde68a] inline-block whitespace-nowrap">
                          {laporan.nilaiMagang}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center text-slate-500 font-medium whitespace-nowrap">
                        {laporan.tanggalUpload}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenForm(laporan.judulLaporan)}
                            className="w-8 h-8 rounded-lg border border-sky-400 text-sky-500 hover:bg-sky-50 flex items-center justify-center cursor-pointer transition-all"
                            title="Edit Laporan"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteLaporan}
                            className="w-8 h-8 rounded-lg border border-rose-400 text-rose-500 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-all"
                            title="Hapus Laporan"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. KONDISI 4: LAPORAN DITOLAK (SCREENSHOT 4)               */}
      {/* ========================================================= */}
      {currentScenario === 'ditolak' && !isFormOpen && (
        <div className="space-y-6">
          {/* Red Keterangan Banner */}
          <div className="p-4 px-6 rounded-2xl bg-[#e53935] text-white flex items-center gap-3 shadow-sm font-semibold text-xs sm:text-sm">
            <span className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center font-bold text-xs shrink-0">
              i
            </span>
            <span>Keterangan: Laporan Anda ditolak! Harap upload laporan terbaru.</span>
          </div>

          {/* Table Container Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-slate-900">Data Laporan Magang</h3>
              
              <button
                type="button"
                onClick={() => handleOpenForm(laporan.judulLaporan)}
                className="px-4 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <span>Upload Laporan</span>
                <span className="material-symbols-outlined text-lg leading-none">add</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-900 font-bold bg-white">
                      <th className="py-4 px-6 text-center w-16">No</th>
                      <th className="py-4 px-6">Judul Laporan</th>
                      <th className="py-4 px-6 text-center">File Laporan</th>
                      <th className="py-4 px-6">Link Google Drive</th>
                      <th className="py-4 px-6 text-center">Nilai Magang</th>
                      <th className="py-4 px-6 text-center whitespace-nowrap">Tanggal Upload</th>
                      <th className="py-4 px-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-5 px-6 text-center font-bold text-slate-400">1</td>
                      <td className="py-5 px-6 font-semibold text-slate-800">
                        {laporan.judulLaporan}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => showToast('info', `Mengunduh ${laporan.fileLaporan}...`)}
                          className="px-5 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          Download File
                        </button>
                      </td>
                      <td className="py-5 px-6 font-medium text-slate-700">
                        {laporan.linkGoogleDrive}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="px-4 py-2 rounded-full text-xs font-bold bg-[#fef3c7] text-[#b45309] border border-[#fde68a] inline-block whitespace-nowrap">
                          {laporan.nilaiMagang}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center text-slate-500 font-medium whitespace-nowrap">
                        {laporan.tanggalUpload}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="px-5 py-2 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-300 inline-block">
                          Ditolak
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. KONDISI 5: LAPORAN DITERIMA (SCREENSHOT 5)              */}
      {/* ========================================================= */}
      {currentScenario === 'diterima' && !isFormOpen && (
        <div className="space-y-6">
          {/* Green Keterangan Banner */}
          <div className="p-4 px-6 rounded-2xl bg-[#10b981] text-white flex items-center gap-3 shadow-sm font-semibold text-xs sm:text-sm">
            <span className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center font-bold text-xs shrink-0">
              i
            </span>
            <span>
              Keterangan: Laporan Anda telah diterima! Silahkan download nilai magang Anda atau tunggu jika belum tersedia.
            </span>
          </div>

          {/* Table Container Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Data Laporan Magang</h3>

            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-900 font-bold bg-white">
                      <th className="py-4 px-6 text-center w-16">No</th>
                      <th className="py-4 px-6">Judul Laporan</th>
                      <th className="py-4 px-6 text-center">File Laporan</th>
                      <th className="py-4 px-6">Link Google Drive</th>
                      <th className="py-4 px-6 text-center">Nilai Magang</th>
                      <th className="py-4 px-6 text-center whitespace-nowrap">Tanggal Upload</th>
                      <th className="py-4 px-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-5 px-6 text-center font-bold text-slate-400">1</td>
                      <td className="py-5 px-6 font-semibold text-slate-800">
                        {laporan.judulLaporan}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => showToast('info', `Mengunduh ${laporan.fileLaporan}...`)}
                          className="px-5 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          Download File
                        </button>
                      </td>
                      <td className="py-5 px-6 font-medium text-slate-700">
                        {laporan.linkGoogleDrive}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="px-4 py-2 rounded-full text-xs font-bold bg-[#fef3c7] text-[#b45309] border border-[#fde68a] inline-block whitespace-nowrap">
                          {laporan.nilaiMagang}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center text-slate-500 font-medium whitespace-nowrap">
                        {laporan.tanggalUpload}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="px-5 py-2 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block">
                          Diterima
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL / OVERLAY FOR RE-UPLOADING OR EDITING */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Upload / Re-Upload Laporan Magang</h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-5 text-xs">
            <div className="space-y-2">
              <label className="block font-bold text-slate-800">Judul Laporan</label>
              <input
                type="text"
                value={formData.judulLaporan}
                onChange={(e) => setFormData({ ...formData, judulLaporan: e.target.value })}
                placeholder="Masukkan Judul Laporan Anda"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-800">File Laporan (PDF)</label>
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#1f877c] cursor-pointer">
                <span className="text-slate-500 font-medium truncate">
                  {formData.fileLaporan || 'Pilih File'}
                </span>
                <span className="material-symbols-outlined text-slate-400 text-lg">file_upload</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload('fileLaporan', e)}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400 font-medium">
                File harus berformat PDF dan tidak lebih dari 2 MB.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-800">Link Google Drive</label>
              <input
                type="text"
                value={formData.linkGoogleDrive}
                onChange={(e) => setFormData({ ...formData, linkGoogleDrive: e.target.value })}
                placeholder="Masukkan Link Google Drive Project Anda"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-800">Form Nilai (PDF)</label>
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#1f877c] cursor-pointer">
                <span className="text-slate-500 font-medium truncate">
                  {formData.formNilai || 'Pilih File'}
                </span>
                <span className="material-symbols-outlined text-slate-400 text-lg">file_upload</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload('formNilai', e)}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400 font-medium">
                File harus berformat PDF dan tidak lebih dari 2 MB.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-[#1f877c] text-[#1f877c] font-bold text-xs hover:bg-[#E6F7F3]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-md"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
