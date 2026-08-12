import React, { useState } from 'react';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../utils/swal';

export interface BidangItem {
  id: number;
  name: string;
  code: string;
  count: number;
  status: 'Aktif' | 'Nonaktif';
  description?: string;
  headOfDepartment?: string;
}

export const BidangAdminView: React.FC = () => {
  // Initial Bidang Data
  const [bidangList, setBidangList] = useState<BidangItem[]>([
    {
      id: 1,
      name: 'Infrastruktur dan Sistem Informasi',
      code: 'ISI-01',
      count: 8,
      status: 'Aktif',
      description: 'Pengelolaan server, jaringan, pusat data, dan aplikasi e-Government Kota Yogyakarta.',
      headOfDepartment: 'Bpk. Hendra Wijaya, S.T.',
    },
    {
      id: 2,
      name: 'Komunikasi dan Informasi Publik',
      code: 'KIP-02',
      count: 5,
      status: 'Aktif',
      description: 'Pengelolaan siaran pers, media sosial resmi, kehumasan, dan pembuatan konten informasi publik.',
      headOfDepartment: 'Ibu Retno Wulandari, M.T.',
    },
    {
      id: 3,
      name: 'Sertifikasi dan Layanan E-Gov',
      code: 'EGov-03',
      count: 4,
      status: 'Aktif',
      description: 'Standardisasi sertifikasi elektronik, tanda tangan digital, dan integrasi sistem layanan publik.',
      headOfDepartment: 'Bpk. Ahmad Fauzi, S.Kom.',
    },
    {
      id: 4,
      name: 'Keamanan Informasi dan Persandian',
      code: 'KIP-04',
      count: 4,
      status: 'Aktif',
      description: 'Penanganan insiden keamanan cyber (CSIRT), audit keamanan web, dan enkripsi persandian.',
      headOfDepartment: 'Dra. Endang Sulastri, M.Kom.',
    },
    {
      id: 5,
      name: 'Layanan Statistik & Data Terpadu',
      code: 'LST-05',
      count: 3,
      status: 'Aktif',
      description: 'Pengolahan data statistik sektoral Pemkot Yogyakarta dan portal Open Data Jogja.',
      headOfDepartment: 'Bpk. Supriyanto, S.Si.',
    },
  ]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedBidang, setSelectedBidang] = useState<BidangItem | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCount, setFormCount] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formHead, setFormHead] = useState<string>('');

  // Reset Form
  const resetForm = () => {
    setFormName('');
    setFormCode('');
    setFormCount(0);
    setFormStatus('Aktif');
    setFormDescription('');
    setFormHead('');
    setSelectedBidang(null);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: BidangItem) => {
    setSelectedBidang(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormCount(item.count);
    setFormStatus(item.status);
    setFormDescription(item.description || '');
    setFormHead(item.headOfDepartment || '');
    setShowEditModal(true);
  };

  // Submit Add Bidang
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showToast('error', 'Nama bidang tidak boleh kosong.');
      return;
    }

    const newId = bidangList.length > 0 ? Math.max(...bidangList.map((b) => b.id)) + 1 : 1;
    const generatedCode = formCode.trim() || `BDG-${String(newId).padStart(2, '0')}`;

    const newBidang: BidangItem = {
      id: newId,
      name: formName.trim(),
      code: generatedCode,
      count: formCount || 0,
      status: formStatus,
      description: formDescription.trim(),
      headOfDepartment: formHead.trim() || 'Tim DISKOMINFOSAN',
    };

    setBidangList((prev) => [newBidang, ...prev]);
    setShowAddModal(false);
    resetForm();

    showSuccessAlert(
      'Bidang Berhasil Ditambahkan!',
      `Unit kerja "${newBidang.name}" telah ditambahkan ke database Master Data.`
    );
  };

  // Submit Edit Bidang
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBidang || !formName.trim()) {
      showToast('error', 'Nama bidang tidak boleh kosong.');
      return;
    }

    setBidangList((prev) =>
      prev.map((b) =>
        b.id === selectedBidang.id
          ? {
              ...b,
              name: formName.trim(),
              code: formCode.trim() || b.code,
              count: formCount,
              status: formStatus,
              description: formDescription.trim(),
              headOfDepartment: formHead.trim(),
            }
          : b
      )
    );

    setShowEditModal(false);
    resetForm();

    showSuccessAlert('Pembaruan Berhasil!', `Data bidang "${formName}" telah diperbarui.`);
  };

  // Delete Bidang with SweetAlert Confirmation
  const handleDeleteBidang = async (item: BidangItem) => {
    const confirm = await showConfirmAlert(
      'Hapus Bidang Ini?',
      `Apakah Anda yakin ingin menghapus bidang "${item.name}"? Kategori magang yang bernaung di bawah bidang ini mungkin perlu disesuaikan.`
    );

    if (confirm.isConfirmed) {
      setBidangList((prev) => prev.filter((b) => b.id !== item.id));
      showSuccessAlert('Bidang Dihapus', `Data bidang "${item.name}" telah dihapus dari sistem.`);
    }
  };

  // Toggle Status directly in Table
  const handleToggleStatus = (id: number) => {
    setBidangList((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextStatus = b.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
          showToast('info', `Status bidang "${b.name}" diubah menjadi ${nextStatus}.`);
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  // Filtered List
  const filteredBidang = bidangList.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.headOfDepartment && b.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      {/* PAGE HEADER & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Master Data Bidang
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Kelola daftar unit kerja, penanggung jawab, dan kuota kategori magang di DISKOMINFOSAN Kota Yogyakarta.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>+ Tambah Bidang Baru</span>
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Total Bidang</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">{bidangList.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1f877c] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">database</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Status Aktif</span>
            <span className="text-2xl font-black text-emerald-600 mt-0.5 block">
              {bidangList.filter((b) => b.status === 'Aktif').length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Total Kategori Dinaungi</span>
            <span className="text-2xl font-black text-blue-600 mt-0.5 block">
              {bidangList.reduce((acc, curr) => acc + curr.count, 0)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">account_tree</span>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
        
        {/* SEARCH BAR & FILTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama bidang, kode, atau kepala bidang..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1f877c]"
            />
          </div>

          <span className="text-xs text-slate-400 font-bold self-end sm:self-center">
            Menampilkan {filteredBidang.length} dari {bidangList.length} Bidang
          </span>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16">Kode</th>
                <th className="py-3.5 px-4">Nama Bidang &amp; Deskripsi</th>
                <th className="py-3.5 px-4">Kepala / PJ Bidang</th>
                <th className="py-3.5 px-4 text-center">Kategori</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBidang.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    Tidak ada data bidang yang sesuai dengan pencarian &ldquo;{searchTerm}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredBidang.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#1f877c]">
                      {item.code}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {item.headOfDepartment || '-'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.count} Kategori
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          item.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                        }`}
                        title="Klik untuk mengubah status"
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* EDIT BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-600 transition-colors cursor-pointer"
                          title="Edit Data Bidang"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleDeleteBidang(item)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-600 transition-colors cursor-pointer"
                          title="Hapus Bidang"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL TAMBAH BIDANG */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">add_box</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Tambah Bidang Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Bidang *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Layanan Statistik & Persandian"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#1f877c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Bidang</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="Contoh: LST-05"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kepala / Penanggung Jawab Bidang</label>
                <input
                  type="text"
                  value={formHead}
                  onChange={(e) => setFormHead(e.target.value)}
                  placeholder="Contoh: Bpk. Supriyanto, S.Si."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Tugas &amp; Fungsi Bidang</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Penjelasan singkat mengenai unit kerja ini..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold cursor-pointer shadow-xs"
                >
                  Simpan Bidang Baru
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT BIDANG */}
      {showEditModal && selectedBidang && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Edit Data Bidang</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Bidang *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#1f877c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Bidang</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kepala / Penanggung Jawab Bidang</label>
                <input
                  type="text"
                  value={formHead}
                  onChange={(e) => setFormHead(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Tugas &amp; Fungsi Bidang</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Simpan Pembaruan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
