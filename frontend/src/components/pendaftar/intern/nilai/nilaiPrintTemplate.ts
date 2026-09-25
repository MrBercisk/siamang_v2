import type { NilaiProfile, NilaiSummary } from '../../../../types/nilaiPeserta';

const KOP_SURAT = {
  instansi: 'Pemerintah Kota Yogyakarta',
  dinas: 'Dinas Komunikasi Informatika dan Persandian',
  alamat: 'Jl. Kenari No.56, Muja Muju, Kec. Umbulharjo, Kota Yogyakarta, D.I. Yogyakarta 55165',
  kontak: 'Website: kominfo.jogjakota.go.id | Email: kominfosan@jogjakota.go.id',
  kepalaDinasNama: 'Tri Hastono, S.Sos., M.Si.',
  kepalaDinasNip: '19690415 199303 1 004',
};

export function buildTranskripHtml(profile: NilaiProfile, nilai: NilaiSummary): string {
  const periode = profile.periodeStart && profile.periodeEnd
    ? `${profile.periodeStart} - ${profile.periodeEnd}`
    : '-';

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Transkrip Nilai Magang - ${profile.nama}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.4; margin: 0; padding: 20px; }
        .header { display: flex; align-items: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 20px; }
        .header-text { text-align: center; flex: 1; }
        .header-text h3 { margin: 0; font-size: 14pt; text-transform: uppercase; letter-spacing: 0.5px; }
        .header-text h2 { margin: 2px 0; font-size: 16pt; font-weight: bold; text-transform: uppercase; }
        .header-text p { margin: 0; font-size: 9pt; font-style: italic; }
        .doc-title { text-align: center; margin: 20px 0; }
        .doc-title h4 { margin: 0; font-size: 14pt; text-decoration: underline; text-transform: uppercase; }
        .doc-title p { margin: 2px 0 0 0; font-size: 10pt; }
        .student-info { width: 100%; margin-bottom: 20px; font-size: 11pt; border-collapse: collapse; }
        .student-info td { padding: 4px 6px; vertical-align: top; }
        .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11pt; }
        .grades-table th, .grades-table td { border: 1px solid #000; padding: 8px 10px; }
        .grades-table th { background-color: #f2f2f2; text-align: center; font-weight: bold; }
        .summary-box { border: 2px solid #000; padding: 12px 16px; margin-bottom: 25px; font-size: 11pt; display: flex; justify-content: space-between; align-items: center; background-color: #fafafa; }
        .signatures { margin-top: 40px; width: 100%; display: flex; justify-content: space-between; font-size: 11pt; }
        .sig-box { text-align: center; width: 45%; }
        .sig-space { height: 75px; }
        .no-print { text-align: center; margin-bottom: 20px; }
        .btn-print { background-color: #1f877c; color: white; border: none; padding: 10px 24px; font-size: 12pt; font-weight: bold; border-radius: 8px; cursor: pointer; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="no-print">
        <button class="btn-print" onclick="window.print()">Cetak Dokumen / Simpan PDF</button>
      </div>

      <div class="header">
        <div style="width: 70px; text-align: center; font-size: 28pt; font-weight: bold;">🏛️</div>
        <div class="header-text">
          <h3>${KOP_SURAT.instansi}</h3>
          <h2>${KOP_SURAT.dinas}</h2>
          <p>${KOP_SURAT.alamat}</p>
          <p>${KOP_SURAT.kontak}</p>
        </div>
      </div>

      <div class="doc-title">
        <h4>TRANSKRIP NILAI MAGANG / PRAKTIK KERJA LAPANGAN</h4>
        <p>Nomor: 800.1 / DISKOMINFOSAN / EVAL / ${new Date().getFullYear()}</p>
      </div>

      <table class="student-info">
        <tr><td width="22%"><strong>Nama Peserta</strong></td><td width="3%">:</td><td width="75%">${profile.nama}</td></tr>
        <tr><td><strong>NIM / ID</strong></td><td>:</td><td>${profile.nim ?? '-'}</td></tr>
        <tr><td><strong>Instansi / Kampus</strong></td><td>:</td><td>${profile.instansi ?? '-'}</td></tr>
        <tr><td><strong>Kategori Magang</strong></td><td>:</td><td>${profile.kategori ?? '-'}</td></tr>
        <tr><td><strong>Judul Project</strong></td><td>:</td><td>${profile.judulProject ?? '-'}</td></tr>
        <tr><td><strong>Periode Magang</strong></td><td>:</td><td>${periode}</td></tr>
      </table>

      <table class="grades-table">
        <thead>
          <tr>
            <th width="8%">No</th>
            <th width="52%">Aspek Penilaian Mentor</th>
            <th width="20%">Skor (0 - 10)</th>
          </tr>
        </thead>
        <tbody>
          ${nilai.aspects
            .map(
              (s, i) => `
            <tr>
              <td style="text-align: center;">${i + 1}</td>
              <td>${s.label}</td>
              <td style="text-align: center; font-weight: bold;">${s.skor.toFixed(1)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="summary-box">
        <div>
          <strong>RATA-RATA SKOR AKHIR:</strong> <span style="font-size: 14pt; font-weight: bold; color: #1f877c;">${(nilai.rataRata ?? 0).toFixed(1)} / 10.0</span><br>
          <strong>PREDIKAT KELULUSAN:</strong> <span style="font-size: 12pt; font-weight: bold;">${nilai.predikat ?? '-'}</span>
        </div>
        <div style="text-align: right;">
          <strong>STATUS:</strong> <span style="font-size: 13pt; font-weight: bold; color: green; border: 1px solid green; padding: 4px 10px;">LULUS MAGANG</span>
        </div>
      </div>

      <div class="signatures">
        <div class="sig-box">
          <p>Mengetahui,<br><strong>Kepala Dinas DISKOMINFOSAN</strong></p>
          <div class="sig-space"></div>
          <p><strong><u>${KOP_SURAT.kepalaDinasNama}</u></strong><br>NIP. ${KOP_SURAT.kepalaDinasNip}</p>
        </div>
        <div class="sig-box">
        <p>Yogyakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br><strong>Mentor Lapangan</strong></p>
        <div class="sig-space"></div>
        <p><strong><u>${profile.mentorNama ?? '-'}</u></strong><br>${profile.mentorNip ? `NIP. ${profile.mentorNip}` : ''}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function printTranskrip(profile: NilaiProfile, nilai: NilaiSummary): boolean {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;

  printWindow.document.write(buildTranskripHtml(profile, nilai));
  printWindow.document.close();
  return true;
}