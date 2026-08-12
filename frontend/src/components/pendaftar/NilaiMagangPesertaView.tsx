import React, { useState } from 'react';
import { showToast } from '../../utils/swal';
import { User } from '../../types/auth';

interface NilaiMagangPesertaViewProps {
  user?: User;
}

export interface AspectScore {
  no: number;
  aspek: string;
  skor: number; // 0 - 10
  kategori: string;
}

export const NilaiMagangPesertaView: React.FC<NilaiMagangPesertaViewProps> = ({ user }) => {
  // State to simulate if grade is published by mentor or pending
  const [isGradePublished, setIsGradePublished] = useState<boolean>(true);

  // Student details
  const studentInfo = {
    nama: user?.name || 'Leona Strive',
    email: user?.email || 'leona@gmail.com',
    nim: '2200018123',
    instansi: 'Universitas Ahmad Dahlan',
    kategori: 'Perencanaan dan Implementasi Sistem Informasi',
    judulProject: 'Design Web Aplikasi Magang DISKOMINFOSAN',
    periode: '20 Mei 2026 - 20 November 2026',
    mentorNama: 'Dra. Endang Sulastri, M.Kom.',
    mentorNip: '19750812 199903 2 001',
  };

  // Sample scores matching mentor evaluation aspects (0-10 scale)
  const scores: AspectScore[] = [
    { no: 1, aspek: 'Kehadiran', skor: 9.0, kategori: 'Sangat Baik' },
    { no: 2, aspek: 'Kemampuan Kerja', skor: 9.0, kategori: 'Sangat Baik' },
    { no: 3, aspek: 'Kualitas Kerja', skor: 8.5, kategori: 'Sangat Baik' },
    { no: 4, aspek: 'Kerjasama', skor: 9.0, kategori: 'Sangat Baik' },
    { no: 5, aspek: 'Inisiatif & Kreativitas', skor: 8.5, kategori: 'Sangat Baik' },
    { no: 6, aspek: 'Disiplin', skor: 9.0, kategori: 'Sangat Baik' },
  ];

  // Calculate average
  const totalScore = scores.reduce((acc, curr) => acc + curr.skor, 0);
  const averageScore = Number((totalScore / scores.length).toFixed(1));

  const getPredikat = (score: number) => {
    if (score >= 8.5) return 'Sangat Baik (A)';
    if (score >= 7.0) return 'Baik (B)';
    if (score >= 5.5) return 'Cukup (C)';
    return 'Belum Lulus (D)';
  };

  const predikat = getPredikat(averageScore);

  // Handler to Print/Download PDF Document
  const handlePrintPDF = () => {
    showToast('info', 'Membuka dokumen sertifikat & transkrip nilai untuk dicetak PDF...');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('error', 'Gagal membuka jendela cetak. Izinkan pop-up di browser Anda.');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Transkrip Nilai Magang - ${studentInfo.nama}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #111;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
          }
          .header {
            display: flex;
            align-items: center;
            border-bottom: 3px double #000;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .header-text {
            text-align: center;
            flex: 1;
          }
          .header-text h3 {
            margin: 0;
            font-size: 14pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .header-text h2 {
            margin: 2px 0;
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
          }
          .header-text p {
            margin: 0;
            font-size: 9pt;
            font-style: italic;
          }
          .doc-title {
            text-align: center;
            margin: 20px 0;
          }
          .doc-title h4 {
            margin: 0;
            font-size: 14pt;
            text-decoration: underline;
            text-transform: uppercase;
          }
          .doc-title p {
            margin: 2px 0 0 0;
            font-size: 10pt;
          }
          .student-info {
            width: 100%;
            margin-bottom: 20px;
            font-size: 11pt;
            border-collapse: collapse;
          }
          .student-info td {
            padding: 4px 6px;
            vertical-align: top;
          }
          .grades-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11pt;
          }
          .grades-table th, .grades-table td {
            border: 1px solid #000;
            padding: 8px 10px;
          }
          .grades-table th {
            background-color: #f2f2f2;
            text-align: center;
            font-weight: bold;
          }
          .summary-box {
            border: 2px solid #000;
            padding: 12px 16px;
            margin-bottom: 25px;
            font-size: 11pt;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fafafa;
          }
          .signatures {
            margin-top: 40px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 11pt;
          }
          .sig-box {
            text-align: center;
            width: 45%;
          }
          .sig-space {
            height: 75px;
          }
          .no-print {
            text-align: center;
            margin-bottom: 20px;
          }
          .btn-print {
            background-color: #1f877c;
            color: white;
            border: none;
            padding: 10px 24px;
            font-size: 12pt;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
          }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>

        <div class="no-print">
          <button class="btn-print" onclick="window.print()">Cetak Dokumen / Simpan PDF</button>
        </div>

        <!-- KOP SURAT RESMI -->
        <div class="header">
          <div style="width: 70px; text-align: center; font-size: 28pt; font-weight: bold;">
            🏛️
          </div>
          <div class="header-text">
            <h3>Pemerintah Kota Yogyakarta</h3>
            <h2>Dinas Komunikasi Informatika dan Persandian</h2>
            <p>Jl. Kenari No.56, Muja Muju, Kec. Umbulharjo, Kota Yogyakarta, D.I. Yogyakarta 55165</p>
            <p>Website: kominfo.jogjakota.go.id | Email: kominfosan@jogjakota.go.id</p>
          </div>
        </div>

        <!-- JUDUL DOKUMEN -->
        <div class="doc-title">
          <h4>TRANSKRIP NILAI MAGANG / PRAKTIK KERJA LAPANGAN</h4>
          <p>Nomor: 800.1 / DISKOMINFOSAN / EVAL / ${new Date().getFullYear()}</p>
        </div>

        <!-- INFORMASI PESERTA -->
        <table class="student-info">
          <tr>
            <td width="22%"><strong>Nama Peserta</strong></td>
            <td width="3%">:</td>
            <td width="75%">${studentInfo.nama}</td>
          </tr>
          <tr>
            <td><strong>NIM / ID</strong></td>
            <td>:</td>
            <td>${studentInfo.nim}</td>
          </tr>
          <tr>
            <td><strong>Instansi / Kampus</strong></td>
            <td>:</td>
            <td>${studentInfo.instansi}</td>
          </tr>
          <tr>
            <td><strong>Kategori Magang</strong></td>
            <td>:</td>
            <td>${studentInfo.kategori}</td>
          </tr>
          <tr>
            <td><strong>Judul Project</strong></td>
            <td>:</td>
            <td>${studentInfo.judulProject}</td>
          </tr>
          <tr>
            <td><strong>Periode Magang</strong></td>
            <td>:</td>
            <td>${studentInfo.periode}</td>
          </tr>
        </table>

        <!-- TABEL PENILAIAN -->
        <table class="grades-table">
          <thead>
            <tr>
              <th width="8%">No</th>
              <th width="52%">Aspek Penilaian Mentor</th>
              <th width="20%">Skor (0 - 10)</th>
              <th width="20%">Kategori</th>
            </tr>
          </thead>
          <tbody>
            ${scores
              .map(
                (s) => `
              <tr>
                <td style="text-align: center;">${s.no}</td>
                <td>${s.aspek}</td>
                <td style="text-align: center; font-weight: bold;">${s.skor.toFixed(1)}</td>
                <td style="text-align: center;">${s.kategori}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <!-- SUMMARY BOX -->
        <div class="summary-box">
          <div>
            <strong>RATA-RATA SKOR AKHIR:</strong> <span style="font-size: 14pt; font-weight: bold; color: #1f877c;">${averageScore} / 10.0</span><br>
            <strong>PREDIKAT KELULUSAN:</strong> <span style="font-size: 12pt; font-weight: bold;">${predikat}</span>
          </div>
          <div style="text-align: right;">
            <strong>STATUS:</strong> <span style="font-size: 13pt; font-weight: bold; color: green; border: 1px solid green; padding: 4px 10px;">LULUS MAGANG</span>
          </div>
        </div>

        <!-- TANDA TANGAN -->
        <div class="signatures">
          <div class="sig-box">
            <p>Mengetahui,<br><strong>Kepala Dinas DISKOMINFOSAN</strong></p>
            <div class="sig-space"></div>
            <p><strong><u>Tri Hastono, S.Sos., M.Si.</u></strong><br>NIP. 19690415 199303 1 004</p>
          </div>
          <div class="sig-box">
            <p>Yogyakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br><strong>Mentor Lapangan</strong></p>
            <div class="sig-space"></div>
            <p><strong><u>${studentInfo.mentorNama}</u></strong><br>NIP. ${studentInfo.mentorNip}</p>
          </div>
        </div>

      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      {/* SIMULATOR BAR */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-sm">tune</span>
          <span className="font-bold">Simulasi Status Penilaian Mentor:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsGradePublished(true)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              isGradePublished
                ? 'bg-[#1f877c] text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Nilai Sudah Diberikan
          </button>
          <button
            type="button"
            onClick={() => setIsGradePublished(false)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              !isGradePublished
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Nilai Belum Ada
          </button>
        </div>
      </div>

      {/* CONDITION 1: GRADE NOT PUBLISHED YET */}
      {!isGradePublished && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
            <span className="material-symbols-outlined text-3xl">pending_actions</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Nilai Magang Belum Tersedia</h3>
            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              Mentor lapangan belum menyelesaikan evaluasi atau belum input nilai magang Anda.
              Silakan hubungi mentor Anda atau cek kembali setelah laporan magang disetujui.
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Status: Menunggu Evaluasi Mentor
          </span>
        </div>
      )}

      {/* CONDITION 2: GRADE PUBLISHED & READY TO PRINT */}
      {isGradePublished && (
        <div className="space-y-6">
          
          {/* BANNER KETERANGAN RESMI */}
          <div className="p-4 px-6 rounded-2xl bg-[#1f877c] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-base shrink-0">
                <span className="material-symbols-outlined text-lg">verified</span>
              </span>
              <div>
                <h3 className="font-bold text-sm">Nilai Magang Telah Diterbitkan</h3>
                <p className="text-xs text-emerald-100 font-medium">
                  Evaluasi resmi dari Mentor DISKOMINFOSAN Kota Yogyakarta.
                </p>
              </div>
            </div>

            {/* CETAK PDF BUTTON */}
            <button
              type="button"
              onClick={handlePrintPDF}
              className="px-5 py-2.5 rounded-xl bg-white text-[#1f877c] hover:bg-emerald-50 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-lg">print</span>
              <span>Cetak PDF Nilai Magang</span>
            </button>
          </div>

          {/* OVERALL SUMMARY CARD & PROFILE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: STUDENT & PROJECT PROFILE (5 COLS) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Informasi Peserta Magang
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Nama Peserta</span>
                  <p className="font-bold text-slate-900 text-sm">{studentInfo.nama}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 font-medium block">NIM / ID</span>
                    <p className="font-semibold text-slate-800">{studentInfo.nim}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Instansi</span>
                    <p className="font-semibold text-slate-800">{studentInfo.instansi}</p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Kategori Magang</span>
                  <p className="font-semibold text-slate-800">{studentInfo.kategori}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Judul Project</span>
                  <p className="font-semibold text-[#1f877c]">{studentInfo.judulProject}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Mentor Lapangan</span>
                  <p className="font-bold text-slate-900">{studentInfo.mentorNama}</p>
                  <p className="text-[11px] text-slate-400 font-medium">NIP. {studentInfo.mentorNip}</p>
                </div>
              </div>
            </div>

            {/* RIGHT: RATA-RATA & PREDIKAT BADGE (7 COLS) */}
            <div className="lg:col-span-7 bg-[#E6F7F3] rounded-2xl border border-[#C6EFE7] p-6 flex flex-col justify-between space-y-6">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#1f877c] uppercase tracking-wider block">
                    Hasil Akhir Evaluasi Magang
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {predikat}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    Status: <strong className="text-emerald-700">Dinyatakan LULUS Magang</strong>
                  </p>
                </div>

                <div className="text-right bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Rata-Rata Skor</span>
                  <span className="text-3xl font-black text-[#1f877c] block leading-none mt-1">
                    {averageScore}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">/ 10.0</span>
                </div>
              </div>

              {/* CATATAN MENTOR */}
              <div className="p-4 bg-white/80 rounded-xl border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#1f877c]">rate_review</span>
                  <span>Catatan &amp; Evaluasi Mentor:</span>
                </span>
                <p className="text-slate-600 font-medium italic leading-relaxed">
                  &ldquo;Peserta memiliki performa kerja yang sangat baik, mampu menyelesaikan wireframe &amp; prototype UI/UX sistem informasi dengan rapi, serta memiliki sikap disiplin dan kerjasama tim yang tinggi.&rdquo;
                </p>
              </div>

            </div>

          </div>

          {/* TABLE BREAKDOWN 6 ASPEK PENILAIAN MENTOR */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <h4 className="text-base font-bold text-slate-900">
              Rincian 6 Aspek Penilaian Mentor
            </h4>

            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-900 font-bold bg-slate-50/60">
                    <th className="py-4 px-6 text-center w-16">No</th>
                    <th className="py-4 px-6">Aspek Penilaian</th>
                    <th className="py-4 px-6 text-center w-40">Nilai Mentor (0-10)</th>
                    <th className="py-4 px-6 text-center w-40">Kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scores.map((item) => (
                    <tr key={item.no} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 text-center font-bold text-slate-400">
                        {item.no}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {item.aspek}
                      </td>
                      <td className="py-4 px-6 text-center font-black text-[#1f877c] text-sm">
                        {item.skor.toFixed(1)} / 10
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {item.kategori}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SURAT KETERANGAN MAGANG FILE DOWNLOAD CARD */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#E6F7F3] border border-[#C6EFE7] flex items-center justify-center text-[#1f877c] shrink-0">
                <span className="material-symbols-outlined text-2xl">workspace_premium</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Surat Keterangan &amp; Sertifikat Kelulusan Magang</h4>
                <p className="text-xs text-slate-500 font-medium">
                  Berkas resmi bertanda tangan digital Dinas Komunikasi Informatika dan Persandian Kota Yogyakarta.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('info', 'Mengunduh Surat Keterangan Magang Resmi (PDF)...')}
              className="px-5 py-2.5 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Download Surat Keterangan (PDF)</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
