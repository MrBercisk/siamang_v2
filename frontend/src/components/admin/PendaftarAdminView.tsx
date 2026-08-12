import React, { useState } from 'react';
import { PendaftarData } from '../mentor/DetailDataModal';
import { DetailPendaftarView } from '../mentor/DetailPendaftarView';
import { showSuccessAlert, showConfirmAlert, showToast } from '../../utils/swal';

export const PendaftarAdminView: React.FC = () => {
  // Available categories for filtering
  const categoryOptions = [
    'Perencanaan dan Implementasi Sistem Informasi',
    'Pengembangan Perangkat Lunak & UI/UX',
    'Pengelolaan Media Sosial & Informasi Publik',
    'Keamanan Siber & Jaringan Komputer',
    'Pengolahan Data Statistik Sektoral & Open Data',
  ];

  // Initial Applicants Data (Filled by Applicants directly)
  const [applicantList, setApplicantList] = useState<PendaftarData[]>([
    {
      id: 1,
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      nama: 'Leona Strive',
      email: 'leonastrive@gmail.com',
      phone: '081235689',
      instansi: 'Universitas Gadjah Mada',
      nim: '21/478912/SV/19231',
      kategori: 'Pengembangan Perangkat Lunak & UI/UX',
      tanggalDaftar: '20 Juni 2026',
      status: 'Verifikasi',
      tipeDaftar: 'Kelompok',
      alamat: 'Yogyakarta',
      jurusan: 'Teknologi Informasi',
      semester: 'Semester 6',
      ipk: '3.82',
      keahlian: 'React, TypeScript, Figma UI/UX Design',
      berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
    },
    {
      id: 2,
      fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      nama: 'Rian Pratama Putra',
      email: 'rian.pratama@mail.ugm.ac.id',
      phone: '081234567891',
      instansi: 'Universitas Gadjah Mada',
      nim: '2100018123',
      kategori: 'Pengembangan Perangkat Lunak & UI/UX',
      tanggalDaftar: '06 Mei 2026',
      status: 'Verifikasi',
      tipeDaftar: 'Individu',
      alamat: 'Sleman, D.I. Yogyakarta',
      jurusan: 'Teknik Informatika',
      semester: 'Semester 6',
      ipk: '3.75',
      keahlian: 'Fullstack Web Developer, Node.js',
      berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
    },
    {
      id: 3,
      fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      nama: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@students.amikom.ac.id',
      phone: '081809876541',
      instansi: 'Universitas AMIKOM Yogyakarta',
      nim: '19.11.2345',
      kategori: 'Perencanaan dan Implementasi Sistem Informasi',
      tanggalDaftar: '06 Mei 2026',
      status: 'Diterima',
      tipeDaftar: 'Kelompok',
      alamat: 'Bantul, D.I. Yogyakarta',
      jurusan: 'Sistem Informasi',
      semester: 'Semester 8',
      ipk: '3.68',
      keahlian: 'System Analyst & Database Administrator',
      berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
    },
    {
      id: 4,
      fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      nama: 'Budi Santoso',
      email: 'budi.santoso@umy.ac.id',
      phone: '085712341231',
      instansi: 'Universitas Muhammadiyah Yogyakarta',
      nim: '20210140012',
      kategori: 'Pengelolaan Media Sosial & Informasi Publik',
      tanggalDaftar: '07 Mei 2026',
      status: 'Diterima',
      tipeDaftar: 'Individu',
      alamat: 'Kota Yogyakarta',
      jurusan: 'Ilmu Komunikasi',
      semester: 'Semester 6',
      ipk: '3.50',
      keahlian: 'Content Creator, Video Editing, Social Media',
      berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
    },
    {
      id: 5,
      fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
      nama: 'Fajar Nugroho',
      email: 'fajar.nugroho@usd.ac.id',
      phone: '082134569871',
      instansi: 'Universitas Sanata Dharma',
      nim: '185314099',
      kategori: 'Pengolahan Data Statistik Sektoral & Open Data',
      tanggalDaftar: '09 Mei 2026',
      status: 'Ditolak',
      tipeDaftar: 'Individu',
      alamat: 'Sleman, D.I. Yogyakarta',
      jurusan: 'Informatika',
      semester: 'Semester 8',
      ipk: '3.10',
      alasanPenolakan: 'Kuota divisi pengolahan data statistik telah terpenuhi untuk periode ini.',
      berkas: { pasFoto: true, suratPermohonan: true, proposal: true, nda: true },
    },
  ]);

  // Selected Applicant for Detail View
  const [selectedApplicant, setSelectedApplicant] = useState<PendaftarData | null>(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');

  // Rejection Modal States for Table Action
  const [rejectModalItem, setRejectModalItem] = useState<PendaftarData | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Handle Update Status
  const handleUpdateStatus = (id: number, newStatus: 'Diterima' | 'Ditolak' | 'Verifikasi', reason?: string) => {
    setApplicantList((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            status: newStatus,
            alasanPenolakan: newStatus === 'Ditolak' ? reason || app.alasanPenolakan : undefined,
          };
        }
        return app;
      })
    );

    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              alasanPenolakan: newStatus === 'Ditolak' ? reason || prev.alasanPenolakan : undefined,
            }
          : null
      );
    }
  };

  // Quick Action Terima
  const handleTerimaClick = async (item: PendaftarData) => {
    const confirmed = await showConfirmAlert({
      title: 'Terima Pendaftaran?',
      text: `Apakah Anda yakin ingin MENERIMA pendaftaran dari ${item.nama}?`,
      confirmButtonText: 'Ya, Terima Pendaftar',
      icon: 'question',
    });

    if (confirmed) {
      handleUpdateStatus(item.id, 'Diterima');
      showSuccessAlert(
        'Pendaftaran Diterima!',
        `Status pendaftaran ${item.nama} berhasil diubah menjadi DITERIMA.`
      );
    }
  };

  // Quick Action Tolak
  const handleTolakClick = (item: PendaftarData) => {
    setRejectModalItem(item);
    setRejectReason('');
  };

  const handleConfirmTolakSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;
    if (!rejectReason.trim()) {
      showToast('error', 'Mohon berikan alasan penolakan.');
      return;
    }

    handleUpdateStatus(rejectModalItem.id, 'Ditolak', rejectReason.trim());
    setRejectModalItem(null);
    setRejectReason('');
    showToast('info', `Pendaftaran ${rejectModalItem.nama} telah DITOLAK.`);
  };

  // Filtered Applicants List
  const filteredApplicants = applicantList.filter((app) => {
    const matchesSearch =
      app.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.kategori.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'Semua' ||
      (statusFilter === 'Verifikasi' && app.status === 'Verifikasi') ||
      (statusFilter === 'Diterima' && app.status === 'Diterima') ||
      (statusFilter === 'Ditolak' && app.status === 'Ditolak');

    const matchesCategory = categoryFilter === 'Semua' || app.kategori === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // IF AN APPLICANT IS SELECTED, SHOW DETAIL VIEW
  if (selectedApplicant) {
    return (
      <DetailPendaftarView
        pendaftar={selectedApplicant}
        onBack={() => setSelectedApplicant(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Data Pendaftar Magang
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Peninjauan dan verifikasi berkas pendaftar DISKOMINFOSAN Kota Yogyakarta. Seluruh data diisi secara mandiri oleh pendaftar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-[#1f877c] font-bold text-xs flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">info</span>
            <span>Data Mandiri Pendaftar</span>
          </span>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Total Pendaftar</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">{applicantList.length} Orang</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Menunggu Verifikasi</span>
            <span className="text-2xl font-black text-amber-600 mt-0.5 block">
              {applicantList.filter((a) => a.status === 'Verifikasi').length} Berkas
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Diterima Magang</span>
            <span className="text-2xl font-black text-emerald-600 mt-0.5 block">
              {applicantList.filter((a) => a.status === 'Diterima').length} Peserta
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold block">Berkas Ditolak</span>
            <span className="text-2xl font-black text-rose-600 mt-0.5 block">
              {applicantList.filter((a) => a.status === 'Ditolak').length} Berkas
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">cancel</span>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
        
        {/* SEARCH & FILTERS */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, kampus, NIM..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1f877c]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="Semua">Semua Status</option>
              <option value="Verifikasi">Menunggu Verifikasi</option>
              <option value="Diterima">Diterima</option>
              <option value="Ditolak">Ditolak</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-56 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="Semua">Semua Kategori Magang</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

          </div>

          <span className="text-xs text-slate-400 font-bold self-end lg:self-center">
            Menampilkan {filteredApplicants.length} Pendaftar
          </span>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Pendaftar</th>
                <th className="py-3.5 px-4">Instansi / Jurusan</th>
                <th className="py-3.5 px-4">Kategori Pilihan</th>
                <th className="py-3.5 px-4 text-center">Tipe</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    Tidak ada pendaftar yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app, index) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                      {index + 1}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.fotoUrl}
                          alt={app.nama}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <button
                            type="button"
                            onClick={() => setSelectedApplicant(app)}
                            className="font-bold text-slate-900 text-xs hover:text-[#1f877c] text-left cursor-pointer transition-colors"
                          >
                            {app.nama}
                          </button>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {app.email} • {app.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-800 text-xs">{app.instansi}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{app.jurusan || app.nim}</p>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-700 max-w-[180px] leading-tight">
                      {app.kategori}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {app.tipeDaftar || 'Kelompok'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                          app.status === 'Diterima'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : app.status === 'Ditolak'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {app.status === 'Verifikasi' ? 'Verifikasi' : app.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* DETAIL BUTTON */}
                        <button
                          type="button"
                          onClick={() => setSelectedApplicant(app)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Lihat Detail Pendaftar"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>Detail</span>
                        </button>

                        {/* QUICK APPROVE / REJECT BUTTONS */}
                        {app.status !== 'Diterima' && (
                          <button
                            type="button"
                            onClick={() => handleTerimaClick(app)}
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                            title="Terima Pendaftaran"
                          >
                            <span className="material-symbols-outlined text-base">check</span>
                          </button>
                        )}

                        {app.status !== 'Ditolak' && (
                          <button
                            type="button"
                            onClick={() => handleTolakClick(app)}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Tolak Pendaftaran"
                          >
                            <span className="material-symbols-outlined text-base">close</span>
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* REJECTION REASON MODAL FOR TABLE QUICK ACTION */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <span className="material-symbols-outlined">cancel</span>
                <span>Alasan Penolakan Pendaftaran</span>
              </div>
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Mohon masukkan alasan penolakan pendaftaran peserta <strong className="text-slate-900">{rejectModalItem.nama}</strong>:
            </p>

            <form onSubmit={handleConfirmTolakSubmit} className="space-y-4 text-xs">
              <div>
                <textarea
                  rows={4}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Berkas persyaratan tidak lengkap, kuota divisi telah terpenuhi, atau kualifikasi jurusan belum sesuai."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium text-slate-800 resize-none"
                />
              </div>

              {/* TEMPLATE SUGGESTION CHIPS */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Pilih Alasan Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Berkas persyaratan tidak lengkap',
                    'Kuota divisi magang sudah penuh',
                    'Kualifikasi jurusan belum sesuai',
                    'Surat pengantar kampus belum terlampir',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setRejectReason(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-[10px] font-medium text-slate-600 transition-all cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
