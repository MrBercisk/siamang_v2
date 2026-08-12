import React, { useState } from 'react';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../utils/swal';

export interface KategoriItem {
  id: number;
  name: string;
  bidang: string;
  totalApplied: number;
  status: 'Aktif' | 'Nonaktif';
  description?: string;
  requirements?: string;
}

export const KategoriAdminView: React.FC = () => {
  // Sample Data for Kategori (Without Quota as quota is managed in Periode Magang)
  const [kategoriList, setKategoriList] = useState<KategoriItem[]>([
    {
      id: 1,
      name: 'Perencanaan dan Implementasi Sistem Informasi',
      bidang: 'Infrastruktur dan Sistem Informasi',
      totalApplied: 8,
      status: 'Aktif',
      description: 'Pengembangan web & aplikasi e-Government, manajemen database, dan analisis kebutuhan sistem.',
      requirements: 'S1/D4/D3 Teknik Informatika, Sistem Informasi, Rekayasa Perangkat Lunak',
    },
    {
      id: 2,
      name: 'Pengembangan Perangkat Lunak & UI/UX',
      bidang: 'Infrastruktur dan Sistem Informasi',
      totalApplied: 6,
      status: 'Aktif',
      description: 'Perancangan antarmuka pengguna (UI/UX), prototipe aplikasi mobile/web, dan coding frontend React/Vue.',
      requirements: 'Informatika, Ilmu Komputer, Desain Komunikasi Visual (DKV), Teknologi Informasi',
    },
    {
      id: 3,
      name: 'Pengelolaan Media Sosial & Informasi Publik',
      bidang: 'Komunikasi dan Informasi Publik',
      totalApplied: 5,
      status: 'Aktif',
      description: 'Pembuatan konten publikasi harian, videografi, kehumasan, dan pengelolaan media sosial Pemkot Yogyakarta.',
      requirements: 'Ilmu Komunikasi, Hubungan Masyarakat, DKV, Penyiaran / Broadcasting',
    },
    {
      id: 4,
      name: 'Keamanan Siber & Jaringan Komputer',
      bidang: 'Keamanan Informasi dan Persandian',
      totalApplied: 4,
      status: 'Aktif',
      description: 'Pengujian penetrasi web (penetration testing), manajemen firewall, router Cisco/Mikrotik, dan CSIRT.',
      requirements: 'Teknik Komputer, Jaringan, Teknik Elektro, Cyber Security',
    },
    {
      id: 5,
      name: 'Pengolahan Data Statistik Sektoral & Open Data',
      bidang: 'Layanan Statistik & Data Terpadu',
      totalApplied: 3,
      status: 'Aktif',
      description: 'Analisis data statistik daerah, visualisasi dashboard, dan pengelolaan portal Open Data Jogja.',
      requirements: 'Statistika, Matematika, Sains Data, Teknik Informatika',
    },
  ]);

  // List of Bidang for Dropdown
  const bidangOptions = [
    'Infrastruktur dan Sistem Informasi',
    'Komunikasi dan Informasi Publik',
    'Sertifikasi dan Layanan E-Gov',
    'Keamanan Informasi dan Persandian',
    'Layanan Statistik & Data Terpadu',
  ];

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBidangFilter, setSelectedBidangFilter] = useState<string>('Semua');

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedKategori, setSelectedKategori] = useState<KategoriItem | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState<string>('');
  const [formBidang, setFormBidang] = useState<string>(bidangOptions[0]);
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formRequirements, setFormRequirements] = useState<string>('');

  // Reset Form
  const resetForm = () => {
    setFormName('');
    setFormBidang(bidangOptions[0]);
    setFormStatus('Aktif');
    setFormDescription('');
    setFormRequirements('');
    setSelectedKategori(null);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: KategoriItem) => {
    setSelectedKategori(item);
    setFormName(item.name);
    setFormBidang(item.bidang);
    setFormStatus(item.status);
    setFormDescription(item.description || '');
    setFormRequirements(item.requirements || '');
    setShowEditModal(true);
  };

  // Submit Add Kategori
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showToast('error', 'Nama kategori magang tidak boleh kosong.');
      return;
    }

    const newId = kategoriList.length > 0 ? Math.max(...kategoriList.map((k) => k.id)) + 1 : 1;

    const newKategori: KategoriItem = {
      id: newId,
      name: formName.trim(),
      bidang: formBidang,
      totalApplied: 0,
      status: formStatus,
      description: formDescription.trim(),
      requirements: formRequirements.trim(),
    };

    setKategoriList((prev) => [newKategori, ...prev]);
    setShowAddModal(false);
    resetForm();

    showSuccessAlert(
      'Kategori Berhasil Ditambahkan!',
      `Kategori magang "${newKategori.name}" telah tersimpan di bawah bidang ${newKategori.bidang}.`
    );
  };

  // Submit Edit Kategori
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedKategori || !formName.trim()) {
      showToast('error', 'Nama kategori magang tidak boleh kosong.');
      return;
    }

    setKategoriList((prev) =>
      prev.map((k) =>
        k.id === selectedKategori.id
          ? {
              ...k,
              name: formName.trim(),
              bidang: formBidang,
              status: formStatus,
              description: formDescription.trim(),
              requirements: formRequirements.trim(),
            }
          : k
      )
    );

    setShowEditModal(false);
    resetForm();

    showSuccessAlert('Pembaruan Berhasil!', `Data kategori magang "${formName}" telah diperbarui.`);
  };

  // Delete Kategori
  const handleDeleteKategori = async (item: KategoriItem) => {
    const confirm = await showConfirmAlert(
      'Hapus Kategori Magang?',
      `Apakah Anda yakin ingin menghapus kategori "${item.name}"? Data pendaftar yang memilih kategori ini akan tetap tersimpan.`
    );

    if (confirm.isConfirmed) {
      setKategoriList((prev) => prev.filter((k) => k.id !== item.id));
      showSuccessAlert('Kategori Dihapus', `Kategori "${item.name}" telah dihapus dari sistem.`);
    }
  };

  // Toggle Status
  const handleToggleStatus = (id: number) => {
    setKategoriList((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const nextStatus = k.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
          showToast('info', `Status kategori "${k.name}" diubah menjadi ${nextStatus}.`);
          return { ...k, status: nextStatus };
        }
        return k;
      })
    );
  };

  // Filtered List
  const filteredKategori = kategoriList.filter((k) => {
    const matchesSearch =
      k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.bidang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBidang = selectedBidangFilter === 'Semua' || k.bidang === selectedBidangFilter;
    return matchesSearch && matchesBidang;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      {/* PAGE HEADER & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Master Data Kategori Magang
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Atur jenis/kategori magang di DISKOMINFOSAN Kota Yogyakarta. (Pengaturan kuota lowongan berada di menu Periode Magang).
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
          <span>+ Tambah Kategori Baru</span>
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Total Kategori Magang</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">{kategoriList.length} Kategori</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1f877c] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">category</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Kategori Aktif</span>
            <span className="text-2xl font-black text-emerald-600 mt-0.5 block">
              {kategoriList.filter((k) => k.status === 'Aktif').length} Aktif
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Total Pendaftar Masuk</span>
            <span className="text-2xl font-black text-blue-600 mt-0.5 block">
              {kategoriList.reduce((acc, curr) => acc + curr.totalApplied, 0)} Berkas
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">assignment_turned_in</span>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
        
        {/* SEARCH BAR & FILTER DROPDOWN */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kategori magang..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1f877c]"
              />
            </div>

            <select
              value={selectedBidangFilter}
              onChange={(e) => setSelectedBidangFilter(e.target.value)}
              className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="Semua">Semua Bidang Naungan</option>
              {bidangOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-400 font-bold self-end sm:self-center">
            Menampilkan {filteredKategori.length} Kategori
          </span>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama Kategori Magang</th>
                <th className="py-3.5 px-4">Bidang Naungan</th>
                <th className="py-3.5 px-4 text-center">Pendaftar Masuk</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKategori.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    Tidak ada kategori magang yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredKategori.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                      {item.requirements && (
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                          Kualifikasi: {item.requirements}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {item.bidang}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-[#1f877c] text-sm">
                      {item.totalApplied} <span className="text-[10px] text-slate-400 font-medium">Pendaftar</span>
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
                        title="Klik untuk ubah status"
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
                          title="Edit Kategori"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleDeleteKategori(item)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-600 transition-colors cursor-pointer"
                          title="Hapus Kategori"
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

      {/* MODAL TAMBAH KATEGORI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">add_category</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Tambah Kategori Magang</h3>
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
                <label className="block font-bold text-slate-700 mb-1">Nama Kategori Magang *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Pengembangan Perangkat Lunak & UI/UX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#1f877c]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bidang Naungan *</label>
                <select
                  value={formBidang}
                  onChange={(e) => setFormBidang(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {bidangOptions.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Kategori</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kualifikasi / Jurusan yang Diutamakan</label>
                <input
                  type="text"
                  value={formRequirements}
                  onChange={(e) => setFormRequirements(e.target.value)}
                  placeholder="Contoh: S1/D4 Teknik Informatika, Sistem Informasi, DKV"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Ruang Lingkup Kategori</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Penjelasan umum mengenai kategori ini..."
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
                  Simpan Kategori
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT KATEGORI */}
      {showEditModal && selectedKategori && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Edit Kategori Magang</h3>
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
                <label className="block font-bold text-slate-700 mb-1">Nama Kategori Magang *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#1f877c]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bidang Naungan *</label>
                <select
                  value={formBidang}
                  onChange={(e) => setFormBidang(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {bidangOptions.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Kategori</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kualifikasi Jurusan</label>
                <input
                  type="text"
                  value={formRequirements}
                  onChange={(e) => setFormRequirements(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Ruang Lingkup</label>
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
