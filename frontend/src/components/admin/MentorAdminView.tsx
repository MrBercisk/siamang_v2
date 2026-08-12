import React, { useState } from 'react';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../utils/swal';

export interface MentorItem {
  id: number;
  name: string;
  nip: string;
  email: string;
  phone: string;
  position: string;
  categoriesManaged: string[]; // List of categories mentor handles
  totalMhs: number;
  status: 'Aktif' | 'Nonaktif';
}

export const MentorAdminView: React.FC = () => {
  // Available categories in DISKOMINFOSAN Kota Yogyakarta
  const availableCategories = [
    'Perencanaan dan Implementasi Sistem Informasi',
    'Pengembangan Perangkat Lunak & UI/UX',
    'Pengelolaan Media Sosial & Informasi Publik',
    'Keamanan Siber & Jaringan Komputer',
    'Pengolahan Data Statistik Sektoral & Open Data',
    'Sertifikasi & Layanan E-Government',
  ];

  // Initial Mentor List with Assigned Categories
  const [mentorList, setMentorList] = useState<MentorItem[]>([
    {
      id: 1,
      name: 'Bpk. Hendra Wijaya, S.T.',
      nip: '19820412 200801 1 005',
      email: 'hendra.wijaya@jogjakota.go.id',
      phone: '081234567890',
      position: 'Pranata Komputer Ahli Muda',
      categoriesManaged: [
        'Perencanaan dan Implementasi Sistem Informasi',
        'Pengembangan Perangkat Lunak & UI/UX',
      ],
      totalMhs: 6,
      status: 'Aktif',
    },
    {
      id: 2,
      name: 'Ibu Retno Wulandari, M.T.',
      nip: '19850918 201012 2 003',
      email: 'retno.wulandari@jogjakota.go.id',
      phone: '081809876543',
      position: 'Pranata Humas Ahli Muda',
      categoriesManaged: ['Pengelolaan Media Sosial & Informasi Publik'],
      totalMhs: 4,
      status: 'Aktif',
    },
    {
      id: 3,
      name: 'Bpk. Ahmad Fauzi, S.Kom.',
      nip: '19881105 201402 1 002',
      email: 'ahmad.fauzi@jogjakota.go.id',
      phone: '085712341234',
      position: 'Analis Sistem Informasi',
      categoriesManaged: [
        'Keamanan Siber & Jaringan Komputer',
        'Sertifikasi & Layanan E-Government',
      ],
      totalMhs: 5,
      status: 'Aktif',
    },
    {
      id: 4,
      name: 'Dra. Endang Sulastri, M.Kom.',
      nip: '19790220 200501 2 008',
      email: 'endang.sulastri@jogjakota.go.id',
      phone: '081398761234',
      position: 'Manggala Informatika Ahli Madya',
      categoriesManaged: [
        'Pengembangan Perangkat Lunak & UI/UX',
        'Keamanan Siber & Jaringan Komputer',
      ],
      totalMhs: 3,
      status: 'Aktif',
    },
    {
      id: 5,
      name: 'Bpk. Supriyanto, S.Si.',
      nip: '19810714 200903 1 004',
      email: 'supriyanto@jogjakota.go.id',
      phone: '082134569870',
      position: 'Statistisi Ahli Muda',
      categoriesManaged: ['Pengolahan Data Statistik Sektoral & Open Data'],
      totalMhs: 3,
      status: 'Aktif',
    },
  ]);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorItem | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formNip, setFormNip] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formPosition, setFormPosition] = useState<string>('');
  const [formCategories, setFormCategories] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  // Reset Form
  const resetForm = () => {
    setFormName('');
    setFormNip('');
    setFormEmail('');
    setFormPhone('');
    setFormPosition('');
    setFormCategories([]);
    setFormStatus('Aktif');
    setSelectedMentor(null);
  };

  // Toggle category checkbox in modal form
  const handleToggleCategoryCheck = (catName: string) => {
    setFormCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MentorItem) => {
    setSelectedMentor(item);
    setFormName(item.name);
    setFormNip(item.nip);
    setFormEmail(item.email);
    setFormPhone(item.phone || '');
    setFormPosition(item.position || '');
    setFormCategories(item.categoriesManaged || []);
    setFormStatus(item.status);
    setShowEditModal(true);
  };

  // Submit Add Mentor
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formEmail.trim()) {
      showToast('error', 'Nama mentor dan email wajib diisi.');
      return;
    }

    if (formCategories.length === 0) {
      showToast('warning', 'Pilih minimal 1 kategori magang yang dikelola mentor.');
      return;
    }

    const newId = mentorList.length > 0 ? Math.max(...mentorList.map((m) => m.id)) + 1 : 1;

    const newMentor: MentorItem = {
      id: newId,
      name: formName.trim(),
      nip: formNip.trim() || `-`,
      email: formEmail.trim(),
      phone: formPhone.trim() || '-',
      position: formPosition.trim() || 'Pembimbing Lapangan DISKOMINFOSAN',
      categoriesManaged: formCategories,
      totalMhs: 0,
      status: formStatus,
    };

    setMentorList((prev) => [newMentor, ...prev]);
    setShowAddModal(false);
    resetForm();

    showSuccessAlert(
      'Mentor Berhasil Ditambahkan!',
      `Bpk/Ibu "${newMentor.name}" telah terdaftar sebagai mentor untuk kategori ${newMentor.categoriesManaged.join(', ')}.`
    );
  };

  // Submit Edit Mentor
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMentor || !formName.trim() || !formEmail.trim()) {
      showToast('error', 'Nama mentor dan email wajib diisi.');
      return;
    }

    if (formCategories.length === 0) {
      showToast('warning', 'Pilih minimal 1 kategori magang yang dikelola mentor.');
      return;
    }

    setMentorList((prev) =>
      prev.map((m) =>
        m.id === selectedMentor.id
          ? {
              ...m,
              name: formName.trim(),
              nip: formNip.trim() || m.nip,
              email: formEmail.trim(),
              phone: formPhone.trim(),
              position: formPosition.trim(),
              categoriesManaged: formCategories,
              status: formStatus,
            }
          : m
      )
    );

    setShowEditModal(false);
    resetForm();

    showSuccessAlert('Pembaruan Berhasil!', `Data mentor "${formName}" telah diperbarui.`);
  };

  // Delete Mentor
  const handleDeleteMentor = async (item: MentorItem) => {
    const confirm = await showConfirmAlert(
      'Hapus Mentor ini?',
      `Apakah Anda yakin ingin menghapus mentor "${item.name}"? Mahasiswa bimbingan mentor ini perlu dialokasikan ulang ke mentor lain.`
    );

    if (confirm.isConfirmed) {
      setMentorList((prev) => prev.filter((m) => m.id !== item.id));
      showSuccessAlert('Mentor Dihapus', `Data mentor "${item.name}" telah dihapus.`);
    }
  };

  // Toggle Status
  const handleToggleStatus = (id: number) => {
    setMentorList((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
          showToast('info', `Status mentor "${m.name}" diubah menjadi ${nextStatus}.`);
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  // Filtered Mentors List
  const filteredMentors = mentorList.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'Semua' || m.categoriesManaged.includes(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      {/* PAGE HEADER & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Pembimbing Lapangan (Mentor)
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Kelola data mentor DISKOMINFOSAN dan alokasi kategori magang yang dibimbing/dikelola masing-masing mentor.
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
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>+ Tambah Mentor Baru</span>
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Total Mentor Pembimbing</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">{mentorList.length} Mentor</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1f877c] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">supervisor_account</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Mentor Aktif</span>
            <span className="text-2xl font-black text-emerald-600 mt-0.5 block">
              {mentorList.filter((m) => m.status === 'Aktif').length} Orang
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Total Mahasiswa Dibimbing</span>
            <span className="text-2xl font-black text-blue-600 mt-0.5 block">
              {mentorList.reduce((acc, curr) => acc + curr.totalMhs, 0)} Mahasiswa
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
        
        {/* SEARCH BAR & CATEGORY FILTER */}
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
                placeholder="Cari nama mentor, NIP, atau email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1f877c]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="Semua">Filter Kategori Magang yang Dikelola</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-400 font-bold self-end sm:self-center">
            Menampilkan {filteredMentors.length} Mentor
          </span>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama Mentor &amp; NIP</th>
                <th className="py-3.5 px-4">Kontak / Email</th>
                <th className="py-3.5 px-4">Kategori Magang yang Dikelola</th>
                <th className="py-3.5 px-4 text-center">Mhs Bimbingan</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMentors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    Tidak ada data mentor yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredMentors.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* NAMA & NIP */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        NIP: {item.nip}
                      </p>
                      {item.position && (
                        <p className="text-[10px] text-[#1f877c] font-semibold mt-0.5">
                          {item.position}
                        </p>
                      )}
                    </td>

                    {/* KONTAK & EMAIL */}
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-700 text-xs">{item.email}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.phone}</p>
                    </td>

                    {/* KATEGORI MAGANG YANG DIKELOLA */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {item.categoriesManaged && item.categoriesManaged.length > 0 ? (
                          item.categoriesManaged.map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#E6F7F3] text-[#135952] border border-[#a1dfd7]"
                            >
                              {cat}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Belum diatur</span>
                        )}
                      </div>
                    </td>

                    {/* MHS BIMBINGAN */}
                    <td className="py-4 px-4 text-center font-bold text-[#1f877c] text-sm">
                      {item.totalMhs}{' '}
                      <span className="text-[10px] text-slate-400 font-medium">Orang</span>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          item.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                        }`}
                        title="Klik untuk ubah status mentor"
                      >
                        {item.status}
                      </button>
                    </td>

                    {/* AKSI */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* EDIT BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-600 transition-colors cursor-pointer"
                          title="Edit Mentor & Alokasi Kategori"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleDeleteMentor(item)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-600 transition-colors cursor-pointer"
                          title="Hapus Mentor"
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

      {/* MODAL TAMBAH MENTOR */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E6F7F3] text-[#1f877c] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">person_add</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Tambah Mentor Pembimbing Baru</h3>
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
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap &amp; Gelar *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Dra. Endang Sulastri, M.Kom."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#1f877c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    value={formNip}
                    onChange={(e) => setFormNip(e.target.value)}
                    placeholder="Contoh: 19820412 200801 1 005"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Pembimbing</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Resmi / Instansi *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="nama@jogjakota.go.id"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan / Pangkat Fungsional</label>
                <input
                  type="text"
                  value={formPosition}
                  onChange={(e) => setFormPosition(e.target.value)}
                  placeholder="Contoh: Pranata Komputer Ahli Muda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              {/* CHECKBOX SELECTION: KATEGORI MAGANG YANG DIKELOLA */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-900">
                  Pilih Kategori Magang yang Dikelola Mentor *
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Mahasiswa pendaftar di kategori berikut akan secara otomatis/dapat dialokasikan bimbingannya ke mentor ini.
                </p>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {availableCategories.map((cat) => {
                    const isChecked = formCategories.includes(cat);
                    return (
                      <label
                        key={cat}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#E6F7F3] border-[#1f877c] text-slate-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCategoryCheck(cat)}
                          className="mt-0.5 rounded text-[#1f877c] focus:ring-[#1f877c]"
                        />
                        <span className="text-xs">{cat}</span>
                      </label>
                    );
                  })}
                </div>
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
                  Simpan Mentor Baru
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT MENTOR */}
      {showEditModal && selectedMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Edit Data &amp; Pengelolaan Mentor</h3>
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
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap &amp; Gelar *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">NIP</label>
                  <input
                    type="text"
                    value={formNip}
                    onChange={(e) => setFormNip(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Pembimbing</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Resmi *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan / Pangkat Fungsional</label>
                <input
                  type="text"
                  value={formPosition}
                  onChange={(e) => setFormPosition(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              {/* CHECKBOX SELECTION: KATEGORI MAGANG YANG DIKELOLA */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-900">
                  Kategori Magang yang Dikelola oleh Mentor *
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Tandai kategori magang yang menjadi tanggung jawab bimbingan mentor ini.
                </p>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {availableCategories.map((cat) => {
                    const isChecked = formCategories.includes(cat);
                    return (
                      <label
                        key={cat}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#E6F7F3] border-[#1f877c] text-slate-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCategoryCheck(cat)}
                          className="mt-0.5 rounded text-[#1f877c] focus:ring-[#1f877c]"
                        />
                        <span className="text-xs">{cat}</span>
                      </label>
                    );
                  })}
                </div>
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
