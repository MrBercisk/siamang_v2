import { useState } from 'react';

export function AcceptedDashboardTab() {
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in">

      {/* TOP STATS ROW (3 CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Progress Magang */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <span className="text-xs font-bold text-slate-700 block">Progress Magang</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              20%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-7 p-1 overflow-hidden relative border border-slate-200/60">
            <div
              className="bg-[#1f877c] h-full rounded-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white"
              style={{ width: '20%' }}
            >
              20%
            </div>
          </div>
        </div>

        {/* Card 2: Sisa Hari Magang */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Sisa Hari Magang</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              21
            </span>
            <span className="text-xs font-medium text-slate-500">Hari lagi</span>
          </div>
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block">Periode magang berakhir</span>
            <span className="text-xs font-bold text-slate-800">1 Januari 2026</span>
          </div>
        </div>

        {/* Card 3: Total Bimbingan */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Total Bimbingan</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              8
            </span>
            <span className="text-xs font-medium text-slate-500">kali</span>
          </div>
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block">Bimbingan berikutnya</span>
            <span className="text-xs font-bold text-slate-800">03 Desember 2025</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: CALENDAR & AGENDA MENDATANG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left (8 Cols): June 2026 Interactive Calendar Card */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">

          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">June 2026</h3>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">

            {/* Days Header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-xs font-bold text-slate-500 py-1">
                {day}
              </div>
            ))}

            {/* Day 31 (Prev month) */}
            <div className="h-14 sm:h-16 rounded-xl border border-slate-200/60 p-1.5 text-left text-slate-300 text-xs font-bold">
              31
            </div>

            {/* June 1 */}
            <div className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
              1
            </div>

            {/* June 2 - Highlight Yellow Agenda */}
            <div
              onClick={() => setSelectedAgendaDate('2 Juni 2026: Sesi Bimbingan Mentor DISKOMINFOSAN')}
              className="h-14 sm:h-16 rounded-xl bg-[#FEF08A] border border-amber-300 p-1.5 text-left text-amber-900 text-xs font-bold cursor-pointer hover:shadow-md transition-all"
            >
              <span>2</span>
              <span className="block text-[9px] font-normal text-amber-800 mt-1 leading-none">
                detail agenda
              </span>
            </div>

            {/* June 3 - 6 */}
            {[3, 4, 5, 6].map((num) => (
              <div key={num} className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                {num}
              </div>
            ))}

            {/* June 7 - 13 */}
            {[7, 8, 9, 10, 11, 12, 13].map((num) => (
              <div key={num} className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                {num}
              </div>
            ))}

            {/* June 14 - 20 */}
            {[14, 15, 16, 17, 18, 19, 20].map((num) => (
              <div key={num} className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                {num}
              </div>
            ))}

            {/* June 21 - 24 */}
            {[21, 22, 23, 24].map((num) => (
              <div key={num} className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                {num}
              </div>
            ))}

            {/* June 25 - Selected Dark Navy Date */}
            <div className="h-14 sm:h-16 rounded-xl bg-[#1E293B] p-1.5 text-left text-white text-xs font-bold shadow-md">
              25
            </div>

            {/* June 26 - 29 */}
            {[26, 27, 28, 29].map((num) => (
              <div key={num} className="h-14 sm:h-16 rounded-xl bg-[#E6F7F3] p-1.5 text-left text-slate-800 text-xs font-bold">
                {num}
              </div>
            ))}

            {/* June 30 - Highlight Yellow Agenda */}
            <div
              onClick={() => setSelectedAgendaDate('30 Juni 2026: Batas Pengumpulan Laporan Bulanan')}
              className="h-14 sm:h-16 rounded-xl bg-[#FEF08A] border border-amber-300 p-1.5 text-left text-amber-900 text-xs font-bold cursor-pointer hover:shadow-md transition-all"
            >
              <span>30</span>
              <span className="block text-[9px] font-normal text-amber-800 mt-1 leading-none">
                detail agenda
              </span>
            </div>

            {/* Next Month July 1 - 4 */}
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="h-14 sm:h-16 rounded-xl border border-slate-200/60 p-1.5 text-left text-slate-300 text-xs font-bold">
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Right (4 Cols): Agenda Mendatang Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Agenda Mendatang</h3>

          <div className="space-y-4">
            {/* Item 1 */}
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1">
              <h4 className="text-xs font-bold text-slate-900">
                Bimbingan dengan Mentor
              </h4>
              <p className="text-[11px] text-slate-500">
                2 Juni 2026 - 09:00
              </p>
            </div>

            {/* Item 2 */}
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1">
              <h4 className="text-xs font-bold text-slate-900">
                Bimbingan dengan Mentor
              </h4>
              <p className="text-[11px] text-slate-500">
                2 Juni 2026 - 09:00
              </p>
            </div>

            {/* Item 3 */}
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1">
              <h4 className="text-xs font-bold text-slate-900">
                Review Modul SI AMANG
              </h4>
              <p className="text-[11px] text-slate-500">
                25 Juni 2026 - 13:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL AGENDA DETAIL */}
      {selectedAgendaDate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Detail Agenda Kalender</h3>
            <p className="text-xs text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium">
              {selectedAgendaDate}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAgendaDate(null)}
                className="px-4 py-2 bg-[#1f877c] text-white text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}