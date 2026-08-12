import React, { useState } from 'react';
import { showSuccessAlert, showToast, showConfirmAlert } from '../../utils/swal';

export interface PeriodeInfo {
  id: number;
  startDate: string;
  endDate: string;
  announcementDate: string;
}

export interface LowonganItem {
  id: number;
  kategori: string;
  bidang: string;
  project: string;
  definisi: string;
  detailKebutuhan: string; // e.g. "PHP", "React & UI/UX"
  kuota: number;
}

export const PeriodeAdminView: React.FC = () => {
  // 1. State for Periode Information
  const [periodeData, setPeriodeData] = useState<PeriodeInfo>({
    id: 1,
    startDate: '05 Mei 2026',
    endDate: '11 Mei 2026',
    announcementDate: '14 Mei 2026',
  });

  const [showEditPeriodeModal, setShowEditPeriodeModal] = useState<boolean>(false);
  const [editStartDate, setEditStartDate] = useState<string>(periodeData.startDate);
  const [editEndDate, setEditEndDate] = useState<string>(periodeData.endDate);
  const [editAnnouncementDate, setEditAnnouncementDate] = useState<string>(periodeData.announcementDate);

  // 2. State for Lowongan Magang List
  const [lowonganList, setLowonganList] = useState<LowonganItem[]>([
    {
      id: 1,
      kategori: 'Pengembangan Perangkat Lunak',
      bidang: 'Sistem Informasi dan Statistik',
      project: 'SIM CUTI',
      definisi: 'Perencanaan dan Implementasi Sistem Informasi',
      detailKebutuhan: 'PHP',
      kuota: 3,
    },
    {
      id: 2,
      kategori: 'UI/UX & Frontend Development',
      bidang: 'Infrastruktur dan Sistem Informasi',
      project: 'PORTAL JOGJA SMART CITY',
      definisi: 'Desain Antarmuka & Pengembangan React',
      detailKebutuhan: 'React, Figma, Tailwind',
      kuota: 5,
    },
  ]);

  // View state: 'list' | 'add_lowongan' | 'edit_lowongan'
  const [viewState, setViewState] = useState<'list' | 'add_lowongan' | 'edit_lowongan'>('list');
  const [editingLowongan, setEditingLowongan] = useState<LowonganItem | null>(null);

  // Form state for Lowongan
  const [formKategori, setFormKategori] = useState<string>('');
  const [formBidang, setFormBidang] = useState<string>('');
  const [formProject, setFormProject] = useState<string>('');
  const [formDeskripsi, setFormDeskripsi] = useState<string>('');
  const [formDetailKebutuhan, setFormDetailKebutuhan] = useState<string>('');
  const [formKuota, setFormKuota] = useState<string>('');

  // Search & Pagination States
  const [searchPeriode, setSearchPeriode] = useState<string>('');
  const [itemsPerPagePeriode, setItemsPerPagePeriode] = useState<number>(10);
  const [itemsPerPageLowongan, setItemsPerPageLowongan] = useState<number>(10);

  // Category Options for Lowongan
  const categoryOptions = [
    { name: 'Pengembangan Perangkat Lunak', defaultBidang: 'Sistem Informasi dan Statistik' },
    { name: 'UI/UX & Frontend Development', defaultBidang: 'Infrastruktur dan Sistem Informasi' },
    { name: 'Perencanaan dan Implementasi Sistem Informasi', defaultBidang: 'Infrastruktur dan Sistem Informasi' },
    { name: 'Pengelolaan Media Sosial & Informasi Publik', defaultBidang: 'Komunikasi dan Informasi Publik' },
    { name: 'Keamanan Siber & Jaringan Komputer', defaultBidang: 'Keamanan Informasi dan Persandian' },
    { name: 'Pengolahan Data Statistik Sektoral', defaultBidang: 'Layanan Statistik & Data Terpadu' },
  ];

  // Open Form Add Lowongan
  const handleOpenAddLowongan = () => {
    setFormKategori('');
    setFormBidang('');
    setFormProject('');
    setFormDeskripsi('');
    setFormDetailKebutuhan('');
    setFormKuota('');
    setEditingLowongan(null);
    setViewState('add_lowongan');
  };

  // Handle Category Select change to autofill Bidang
  const handleCategorySelect = (selectedKat: string) => {
    setFormKategori(selectedKat);
    const found = categoryOptions.find((c) => c.name === selectedKat);
    if (found) {
      setFormBidang(found.defaultBidang);
    }
  };

  // Open Edit Lowongan
  const handleOpenEditLowongan = (item: LowonganItem) => {
    setEditingLowongan(item);
    setFormKategori(item.kategori);
    setFormBidang(item.bidang);
    setFormProject(item.project);
    setFormDeskripsi(item.definisi);
    setFormDetailKebutuhan(item.detailKebutuhan);
    setFormKuota(item.kuota.toString());
    setViewState('edit_lowongan');
  };

  // Save Lowongan (Add or Edit)
  const handleSaveLowongan = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formKategori) {
      showToast('error', 'Silakan pilih kategori magang.');
      return;
    }
    if (!formKuota || parseInt(formKuota, 10) <= 0) {
      showToast('error', 'Masukkan kuota magang yang valid.');
      return;
    }

    const kuotaNum = parseInt(formKuota, 10);

    if (viewState === 'add_lowongan') {
      const newId = lowonganList.length > 0 ? Math.max(...lowonganList.map((l) => l.id)) + 1 : 1;
      const newLowongan: LowonganItem = {
        id: newId,
        kategori: formKategori,
        bidang: formBidang || 'Infrastruktur dan Sistem Informasi',
        project: formProject || 'Project DISKOMINFOSAN',
        definisi: formDeskripsi || formKategori,
        detailKebutuhan: formDetailKebutuhan || 'Sesuai Kualifikasi',
        kuota: kuotaNum,
      };

      setLowonganList((prev) => [...prev, newLowongan]);
      showSuccessAlert('Lowongan Berhasil Ditambahkan!', `Lowongan untuk project "${newLowongan.project}" dengan kuota ${kuotaNum} telah disimpan.`);
    } else if (viewState === 'edit_lowongan' && editingLowongan) {
      setLowonganList((prev) =>
        prev.map((item) =>
          item.id === editingLowongan.id
            ? {
                ...item,
                kategori: formKategori,
                bidang: formBidang,
                project: formProject,
                definisi: formDeskripsi,
                detailKebutuhan: formDetailKebutuhan,
                kuota: kuotaNum,
              }
            : item
        )
      );
      showSuccessAlert('Pembaruan Berhasil!', `Data lowongan magang "${formProject}" telah diperbarui.`);
    }

    setViewState('list');
  };

  // Delete Lowongan
  const handleDeleteLowongan = async (item: LowonganItem) => {
    const confirm = await showConfirmAlert(
      'Hapus Lowongan Magang?',
      `Apakah Anda yakin ingin menghapus lowongan project "${item.project}" (${item.kategori})?`
    );

    if (confirm.isConfirmed) {
      setLowonganList((prev) => prev.filter((l) => l.id !== item.id));
      showSuccessAlert('Lowongan Dihapus', `Lowongan project "${item.project}" telah dihapus.`);
    }
  };

  // Save Periode Edit
  const handleSavePeriode = (e: React.FormEvent) => {
    e.preventDefault();
    setPeriodeData({
      ...periodeData,
      startDate: editStartDate,
      endDate: editEndDate,
      announcementDate: editAnnouncementDate,
    });
    setShowEditPeriodeModal(false);
    showSuccessAlert('Periode Diperbarui!', 'Jadwal periode magang berhasil diperbarui.');
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 animate-fade-in">
      
      {/* ------------------ VIEW 1: FORM TAMBAH / EDIT LOWONGAN ------------------ */}
      {(viewState === 'add_lowongan' || viewState === 'edit_lowongan') ? (
        <div className="space-y-6">
          
          {/* HEADER & BREADCRUMB */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {viewState === 'add_lowongan' ? 'Tambah Lowongan Magang' : 'Edit Lowongan Magang'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-medium">
              <span className="hover:text-slate-600 cursor-pointer" onClick={() => setViewState('list')}>
                Informasi Lowongan Magang
              </span>
              <span>&gt;</span>
              <span className="text-[#1f877c] font-bold">
                {viewState === 'add_lowongan' ? 'Tambah Lowongan Magang' : 'Edit Lowongan Magang'}
              </span>
            </div>
          </div>

          {/* FORM CONTAINER CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-8">
            <form onSubmit={handleSaveLowongan} className="space-y-6 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* KATEGORI */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formKategori}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-[#1f877c] focus:outline-hidden"
                  >
                    <option value="">Pilih Kategori</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BIDANG */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    Bidang <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formBidang}
                    onChange={(e) => setFormBidang(e.target.value)}
                    placeholder="Nama Bidang"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-[#1f877c] focus:outline-hidden"
                  />
                </div>

                {/* PROJECT */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    Project <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formProject}
                    onChange={(e) => setFormProject(e.target.value)}
                    placeholder="Contoh: SIM CUTI"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-[#1f877c] focus:outline-hidden"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* DESKRIPSI */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Deskripsi</label>
                  <textarea
                    rows={4}
                    value={formDeskripsi}
                    onChange={(e) => setFormDeskripsi(e.target.value)}
                    placeholder="Masukkan deskripsi magang"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-[#1f877c] focus:outline-hidden resize-none"
                  />
                </div>

                {/* DETAIL KEBUTUHAN */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Detail Kebutuhan</label>
                  <textarea
                    rows={4}
                    value={formDetailKebutuhan}
                    onChange={(e) => setFormDetailKebutuhan(e.target.value)}
                    placeholder="Masukkan detail kebutuhan (skill), contoh: PHP, React"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-[#1f877c] focus:outline-hidden resize-none"
                  />
                </div>

                {/* KUOTA */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    Kuota <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formKuota}
                    onChange={(e) => setFormKuota(e.target.value)}
                    placeholder="Masukkan jumlah kuota yang dibutuhkan"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-[#1f877c] focus:outline-hidden"
                  />
                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewState('list')}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-600 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Simpan
                </button>
              </div>

            </form>
          </div>

        </div>
      ) : (
        /* ------------------ VIEW 2: LIST PERIODE & LOWONGAN ------------------ */
        <div className="space-y-8">
          
          {/* MAIN PAGE TITLE */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Pengaturan Periode Magang
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Kelola tanggal pembukaan pendaftaran serta kuota lowongan project magang DISKOMINFOSAN.
            </p>
          </div>

          {/* MAIN WRAPPER CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-8 space-y-10">
            
            {/* ================= SECTION 1: INFORMASI PERIODE MAGANG ================= */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">Informasi Periode Magang</h2>

              {/* CONTROLS BAR: TAMPILKAN ENTRI & CARI */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span>Tampilkan</span>
                  <select
                    value={itemsPerPagePeriode}
                    onChange={(e) => setItemsPerPagePeriode(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-800"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>data per halaman</span>
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchPeriode}
                    onChange={(e) => setSearchPeriode(e.target.value)}
                    placeholder="Cari ..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1f877c]"
                  />
                </div>
              </div>

              {/* TABLE PERIODE */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-white text-slate-800 font-bold">
                      <th className="py-3.5 px-4 text-center w-12">No</th>
                      <th className="py-3.5 px-4">Tanggal Pembukaan Pendaftaran</th>
                      <th className="py-3.5 px-4">Tanggal Penutupan Pendaftaran</th>
                      <th className="py-3.5 px-4">Tanggal Pengumuman</th>
                      <th className="py-3.5 px-4 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4 text-center font-bold text-slate-600">1</td>
                      <td className="py-4 px-4 font-medium text-slate-800">{periodeData.startDate}</td>
                      <td className="py-4 px-4 font-medium text-slate-800">{periodeData.endDate}</td>
                      <td className="py-4 px-4 font-medium text-slate-800">{periodeData.announcementDate}</td>
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setShowEditPeriodeModal(true)}
                          className="p-2 rounded-xl border border-cyan-300 bg-cyan-50/50 hover:bg-cyan-100 text-cyan-600 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="Edit Periode"
                        >
                          <span className="material-symbols-outlined text-lg">edit_note</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* PAGINATION INFO */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1">
                <span>Menampilkan 1 dari 1 entri.</span>
                <div className="flex items-center gap-1">
                  <button disabled className="w-7 h-7 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed">
                    &lt;
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-[#1f877c] text-white font-bold flex items-center justify-center">
                    1
                  </button>
                  <button disabled className="w-7 h-7 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed">
                    &gt;
                  </button>
                </div>
              </div>

            </div>

            <hr className="border-slate-100" />

            {/* ================= SECTION 2: INFORMASI LOWONGAN MAGANG ================= */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">Informasi Lowongan Magang</h2>

              {/* CONTROLS BAR: TAMPILKAN ENTRI & BUTTON TAMBAH LOWONGAN */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span>Tampilkan</span>
                  <select
                    value={itemsPerPageLowongan}
                    onChange={(e) => setItemsPerPageLowongan(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-800"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>data per halaman</span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddLowongan}
                  className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <span>Tambah Lowongan</span>
                  <span className="text-lg font-bold">+</span>
                </button>
              </div>

              {/* TABLE LOWONGAN MAGANG */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-white text-slate-800 font-bold">
                      <th className="py-3.5 px-4 text-center w-12">No</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Bidang</th>
                      <th className="py-3.5 px-4">Project</th>
                      <th className="py-3.5 px-4">Definisi</th>
                      <th className="py-3.5 px-4 text-center">Detail Kebutuhan</th>
                      <th className="py-3.5 px-4 text-center">Kuota</th>
                      <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lowonganList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                          Belum ada lowongan magang.
                        </td>
                      </tr>
                    ) : (
                      lowonganList.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-4 text-center font-bold text-slate-600">{idx + 1}</td>
                          <td className="py-4 px-4 font-semibold text-slate-800 max-w-[160px] leading-tight">
                            {item.kategori}
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-medium max-w-[150px] leading-tight">
                            {item.bidang}
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-900">{item.project}</td>
                          <td className="py-4 px-4 text-slate-600 max-w-[180px] leading-tight">
                            {item.definisi}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-block px-3 py-1 rounded-full border border-teal-300 bg-emerald-50 text-[#1f877c] font-bold text-[11px]">
                              {item.detailKebutuhan}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-slate-900 text-sm">
                            {item.kuota}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {/* EDIT BUTTON */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditLowongan(item)}
                                className="p-1.5 rounded-lg border border-cyan-300 bg-cyan-50/50 hover:bg-cyan-100 text-cyan-600 transition-colors cursor-pointer"
                                title="Edit Lowongan"
                              >
                                <span className="material-symbols-outlined text-base">edit_note</span>
                              </button>

                              {/* DELETE BUTTON */}
                              <button
                                type="button"
                                onClick={() => handleDeleteLowongan(item)}
                                className="p-1.5 rounded-lg border border-rose-300 bg-rose-50/50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                title="Hapus Lowongan"
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

              {/* PAGINATION LOWONGAN */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1">
                <span>Menampilkan {lowonganList.length} dari {lowonganList.length} entri.</span>
                <div className="flex items-center gap-1">
                  <button disabled className="w-7 h-7 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed">
                    &lt;
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-[#1f877c] text-white font-bold flex items-center justify-center">
                    1
                  </button>
                  <button disabled className="w-7 h-7 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed">
                    &gt;
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* MODAL EDIT PERIODE */}
      {showEditPeriodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Periode Magang</h3>
              <button
                type="button"
                onClick={() => setShowEditPeriodeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePeriode} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Pembukaan Pendaftaran</label>
                <input
                  type="text"
                  required
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  placeholder="Contoh: 05 Mei 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Penutupan Pendaftaran</label>
                <input
                  type="text"
                  required
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  placeholder="Contoh: 11 Mei 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Pengumuman</label>
                <input
                  type="text"
                  required
                  value={editAnnouncementDate}
                  onChange={(e) => setEditAnnouncementDate(e.target.value)}
                  placeholder="Contoh: 14 Mei 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditPeriodeModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
