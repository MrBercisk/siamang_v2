export function DashboardTab() {
  return (
    <div className="space-y-6 animate-fade-in">

      {/* STATS CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

        {/* Card 1: Total Pendaftar */}
        <div className="p-6 rounded-2xl bg-[#EBF5FF] border border-sky-100 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-4xl sm:text-5xl font-extrabold text-[#0284c7] block">
              21
            </span>
            <span className="text-xs font-bold text-[#0284c7] block mt-2">
              Total Pendaftar
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/80 border border-sky-200/80 flex items-center justify-center p-2.5 shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-3xl text-[#0284c7]">
              groups
            </span>
          </div>
        </div>

        {/* Card 2: Pendaftar Diterima */}
        <div className="p-6 rounded-2xl bg-[#ECFDF5] border border-emerald-100 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-4xl sm:text-5xl font-extrabold text-[#10B981] block">
              21
            </span>
            <span className="text-xs font-bold text-[#10B981] block mt-2">
              Pendaftar Diterima
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/80 border border-emerald-200/80 flex items-center justify-center p-2.5 shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-3xl text-[#10B981]">
              verified
            </span>
          </div>
        </div>

        {/* Card 3: Pendaftar Ditolak */}
        <div className="p-6 rounded-2xl bg-[#FEF2F2] border border-rose-100 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-4xl sm:text-5xl font-extrabold text-[#E11D48] block">
              21
            </span>
            <span className="text-xs font-bold text-[#E11D48] block mt-2">
              Pendaftar Ditolak
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/80 border border-rose-200/80 flex items-center justify-center p-2.5 shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-4xl text-[#E11D48]">
              close
            </span>
          </div>
        </div>

      </div>

      {/* MIDDLE SECTION: CALENDAR & RIGHT STACK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* CALENDAR (June 2026) - 8 COLS */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">June 2026</h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>

          {/* CALENDAR GRID */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <span key={day} className="font-semibold text-slate-500 py-1">
                {day}
              </span>
            ))}

            {/* Day 31 prev month */}
            <div className="p-3 rounded-xl bg-slate-50 text-slate-300 font-medium">31</div>

            {/* Days 1 to 30 */}
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">1</div>

            {/* Day 2 (Yellow highlighted with detail agenda) */}
            <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-bold flex flex-col items-center justify-center min-h-[52px]">
              <span>2</span>
              <span className="text-[9px] font-medium leading-none mt-1">detail agenda</span>
            </div>

            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">3</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">4</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">5</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">6</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">7</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">8</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">9</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">10</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">11</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">12</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">13</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">14</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">15</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">16</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">17</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">18</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">19</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">20</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">21</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">22</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">23</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">24</div>

            {/* Day 25 (Dark navy highlighted) */}
            <div className="p-3 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center">
              25
            </div>

            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">26</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">27</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">28</div>
            <div className="p-3 rounded-xl bg-[#E6F7F3]/40 text-slate-800 font-bold">29</div>

            {/* Day 30 (Yellow highlighted with detail agenda) */}
            <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-bold flex flex-col items-center justify-center min-h-[52px]">
              <span>30</span>
              <span className="text-[9px] font-medium leading-none mt-1">detail agenda</span>
            </div>

            {/* Days next month */}
            <div className="p-3 rounded-xl bg-slate-50 text-slate-300 font-medium">1</div>
            <div className="p-3 rounded-xl bg-slate-50 text-slate-300 font-medium">2</div>
            <div className="p-3 rounded-xl bg-slate-50 text-slate-300 font-medium">3</div>
            <div className="p-3 rounded-xl bg-slate-50 text-slate-300 font-medium">4</div>
          </div>
        </div>

        {/* RIGHT STACK: AGENDA & MAHASISWA BIMBINGAN - 4 COLS */}
        <div className="lg:col-span-4 space-y-6">

          {/* Agenda Mendatang Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Agenda Mendatang</h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-xs font-bold text-slate-900">
                  Bimbingan dengan Mentor
                </span>
                <span className="block text-[11px] text-slate-500 mt-1">
                  2 Juni 2026 - 09:00
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-xs font-bold text-slate-900">
                  Bimbingan dengan Mentor
                </span>
                <span className="block text-[11px] text-slate-500 mt-1">
                  2 Juni 2026 - 09:00
                </span>
              </div>
            </div>
          </div>

          {/* Mahasiswa Bimbingan Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Mahasiswa Bimbingan</h3>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Leona Strive"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="block text-xs font-bold text-slate-900 truncate">
                      Leona Strive
                    </span>
                    <div className="w-full bg-[#E6F7F3] rounded-full h-3 overflow-hidden flex items-center px-1">
                      <span className="text-[9px] font-extrabold text-[#1f877c]">20%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}