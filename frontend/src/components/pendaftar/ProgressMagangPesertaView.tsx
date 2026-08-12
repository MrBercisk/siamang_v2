import React, { useState } from 'react';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../utils/swal';

export interface ProgressItem {
  id: number;
  judulProject: string;
  tanggalBimbingan: string;
  pencapaian: string;
  catatan: string;
  filePresentasi: string;
  tanggalUpload: string;
}

export const ProgressMagangPesertaView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'form' | 'detail'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);

  // Initial Sample Progress Data matching Screenshot 1
  const [progressList, setProgressList] = useState<ProgressItem[]>([
    {
      id: 1,
      judulProject: 'Design Web Aplikasi Magang',
      tanggalBimbingan: '2023-05-26',
      pencapaian: 'Halaman Utama',
      catatan: 'Warna kurang menarik',
      filePresentasi: 'Design_Web_Aplikasi_Magang.pdf',
      tanggalUpload: '2023-05-26 14:06:39',
    },
    {
      id: 2,
      judulProject: 'Perencanaan dan Implementasi Sistem Informasi',
      tanggalBimbingan: '2023-06-02',
      pencapaian: 'Membuat Wireframe & Hi-Fi Mockup',
      catatan: 'Lanjutkan ke integrasi frontend',
      filePresentasi: 'Wireframe_SI_AMANG.pdf',
      tanggalUpload: '2023-06-02 10:15:20',
    },
  ]);

  // Form State matching Screenshot 2
  const [formData, setFormData] = useState({
    judulProject: '',
    tanggalBimbingan: '',
    pencapaian: '',
    catatan: '',
    filePresentasi: '',
  });

  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData({
      judulProject: 'Design Web Aplikasi Magang',
      tanggalBimbingan: new Date().toISOString().split('T')[0],
      pencapaian: '',
      catatan: '',
      filePresentasi: '',
    });
    setViewMode('form');
  };

  const handleOpenEditForm = (item: ProgressItem) => {
    setEditingId(item.id);
    setFormData({
      judulProject: item.judulProject,
      tanggalBimbingan: item.tanggalBimbingan,
      pencapaian: item.pencapaian,
      catatan: item.catatan,
      filePresentasi: item.filePresentasi,
    });
    setViewMode('form');
  };

  const handleOpenDetail = (item: ProgressItem) => {
    setSelectedItem(item);
    setViewMode('detail');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFormData((prev) => ({ ...prev, filePresentasi: file.name }));
      showToast('success', `File ${file.name} berhasil dipilih.`);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judulProject || !formData.tanggalBimbingan || !formData.pencapaian) {
      showToast('error', 'Harap isi semua kolom wajib!');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (editingId) {
      // Update existing
      setProgressList((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                judulProject: formData.judulProject,
                tanggalBimbingan: formData.tanggalBimbingan,
                pencapaian: formData.pencapaian,
                catatan: formData.catatan,
                filePresentasi: formData.filePresentasi || item.filePresentasi,
                tanggalUpload: nowStr,
              }
            : item
        )
      );
      showSuccessAlert('Progress Diperbarui!', 'Data progress magang berhasil diperbarui.');
    } else {
      // Add new
      const newItem: ProgressItem = {
        id: Date.now(),
        judulProject: formData.judulProject,
        tanggalBimbingan: formData.tanggalBimbingan,
        pencapaian: formData.pencapaian,
        catatan: formData.catatan,
        filePresentasi: formData.filePresentasi || 'File_Presentasi.pdf',
        tanggalUpload: nowStr,
      };
      setProgressList((prev) => [newItem, ...prev]);
      showSuccessAlert('Progress Tersimpan!', 'Data progress magang berhasil ditambahkan.');
    }

    setViewMode('table');
  };

  const filteredList = progressList.filter(
    (item) =>
      item.judulProject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pencapaian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.catatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      {/* 1. VIEW MODE: TABLE (Matching Screenshot 1) */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
          
          {/* HEADER & TOP ACTION BAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">Data Progress Magang</h2>

            <div className="flex items-center gap-3">
              {/* Filter Icon Button */}
              <button
                type="button"
                onClick={() => showToast('info', 'Filter data progress...')}
                className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 cursor-pointer transition-all shrink-0"
                title="Filter Data"
              >
                <span className="material-symbols-outlined text-lg">filter_alt</span>
              </button>

              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c] bg-white"
                />
              </div>

              {/* Tambah Progress Button */}
              <button
                type="button"
                onClick={handleOpenAddForm}
                className="px-4 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Tambah Progress</span>
                <span className="material-symbols-outlined text-lg leading-none">add</span>
              </button>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-900 font-bold bg-white">
                    <th className="py-4 px-4 text-center w-12">No</th>
                    <th className="py-4 px-4">Judul Project</th>
                    <th className="py-4 px-4 text-center whitespace-nowrap">Tanggal Bimbingan</th>
                    <th className="py-4 px-4">Pencapaian</th>
                    <th className="py-4 px-4">Catatan</th>
                    <th className="py-4 px-4 text-center">File Presentasi</th>
                    <th className="py-4 px-4 text-center whitespace-nowrap">Tanggal Upload</th>
                    <th className="py-4 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4 text-center font-bold text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800 max-w-[180px] leading-relaxed">
                        {item.judulProject}
                      </td>
                      <td className="py-4 px-4 text-center text-slate-600 font-medium whitespace-nowrap">
                        {item.tanggalBimbingan}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-900 max-w-[180px] leading-relaxed">
                        {item.pencapaian}
                      </td>
                      <td className="py-4 px-4 text-slate-600 max-w-[180px] leading-relaxed">
                        {item.catatan}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => showToast('info', `Mengunduh ${item.filePresentasi}...`)}
                          className="px-4 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          Download File
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center text-slate-500 font-medium whitespace-nowrap">
                        {item.tanggalUpload}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Detail Button (Eye) */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="w-8 h-8 rounded-lg border border-[#1f877c] text-[#1f877c] hover:bg-[#E6F7F3] flex items-center justify-center cursor-pointer transition-all"
                            title="Lihat Detail Progress"
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                          </button>

                          {/* Edit Button (Pencil) */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditForm(item)}
                            className="w-8 h-8 rounded-lg border border-sky-400 text-sky-500 hover:bg-sky-50 flex items-center justify-center cursor-pointer transition-all"
                            title="Edit Progress"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                        Belum ada data progress magang.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 text-xs text-slate-500">
              <span>
                Menampilkan 1 - {filteredList.length} dari {filteredList.length} riwayat.
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 cursor-not-allowed"
                  disabled
                >
                  <span className="material-symbols-outlined text-xs">chevron_left</span>
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg bg-[#1f877c] text-white font-bold text-xs flex items-center justify-center"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 cursor-not-allowed"
                  disabled
                >
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. VIEW MODE: INPUT / EDIT FORM (Matching Screenshot 2) */}
      {viewMode === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            {editingId ? 'Edit Progress Magang' : 'Input Progress Magang'}
          </h2>

          <form onSubmit={handleSubmitForm} className="space-y-5">
            
            {/* ROW 1: JUDUL PROJECT & TANGGAL BIMBINGAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Judul Project */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Judul Project
                </label>
                <input
                  type="text"
                  value={formData.judulProject}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, judulProject: e.target.value }))
                  }
                  placeholder="Design Web Aplikasi Magang"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c] bg-white font-medium"
                  required
                />
              </div>

              {/* Tanggal Bimbingan */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Tanggal Bimbingan
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalBimbingan}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tanggalBimbingan: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c] bg-white font-medium"
                    required
                  />
                </div>
              </div>

            </div>

            {/* ROW 2: PENCAPAIAN */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Pencapaian
              </label>
              <textarea
                rows={3}
                value={formData.pencapaian}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, pencapaian: e.target.value }))
                }
                placeholder="Tuliskan pencapaian atau progress Anda"
                className="w-full p-4 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c] bg-white font-medium resize-none"
                required
              />
            </div>

            {/* ROW 3: CATATAN */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Catatan
              </label>
              <textarea
                rows={3}
                value={formData.catatan}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, catatan: e.target.value }))
                }
                placeholder="Tuliskan catatan dari mentor saat bimbingan (jika ada)"
                className="w-full p-4 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#1f877c] bg-white font-medium resize-none"
              />
            </div>

            {/* ROW 4: FILE PRESENTASI (PDF) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                File Presentasi (PDF)
              </label>
              
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#1f877c] cursor-pointer transition-all shadow-2xs">
                <span className="text-xs text-slate-500 font-medium truncate">
                  {formData.filePresentasi || 'Pilih File'}
                </span>
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  file_upload
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400 font-medium">
                File harus berformat PDF dan tidak lebih dari 2 MB.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className="px-6 py-2.5 rounded-xl border border-[#1f877c] text-[#1f877c] font-bold text-xs hover:bg-[#E6F7F3] transition-all cursor-pointer"
              >
                Kembali
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Simpan
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 3. VIEW MODE: DETAIL VIEW */}
      {viewMode === 'detail' && selectedItem && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Detail Progress Magang</h2>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
            >
              Kembali
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 font-medium">Judul Project</span>
              <p className="font-bold text-slate-900 text-sm">{selectedItem.judulProject}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 font-medium">Tanggal Bimbingan</span>
              <p className="font-bold text-slate-900 text-sm">{selectedItem.tanggalBimbingan}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-1 md:col-span-2">
              <span className="text-slate-400 font-medium">Pencapaian</span>
              <p className="font-bold text-slate-900 leading-relaxed">{selectedItem.pencapaian}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-1 md:col-span-2">
              <span className="text-slate-400 font-medium">Catatan Mentor</span>
              <p className="font-semibold text-slate-800 leading-relaxed">{selectedItem.catatan || '-'}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 font-medium">File Presentasi</span>
              <div>
                <button
                  type="button"
                  onClick={() => showToast('info', `Mengunduh ${selectedItem.filePresentasi}...`)}
                  className="mt-1 px-4 py-2 rounded-xl bg-[#1f877c] text-white font-bold text-xs shadow-2xs inline-flex items-center gap-1.5"
                >
                  Download File ({selectedItem.filePresentasi})
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 font-medium">Tanggal &amp; Waktu Upload</span>
              <p className="font-bold text-slate-900">{selectedItem.tanggalUpload}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
