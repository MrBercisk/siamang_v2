import { monthlyData } from '../../../data/adminSampleData';

export function AdminDashboardTab() {
  return (
    <div className="space-y-6 animate-in fade-in">

      {/* TOP 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Card 1: Total Pendaftar (Light Blue Tint) */}
        <div className="bg-[#E0F2FE] border border-sky-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-extrabold text-[#0284C7] block">
              21
            </span>
            <span className="text-xs font-bold text-[#0369A1] mt-2 block">
              Total Pendaftar
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#0284C7] flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-2xl font-bold">groups</span>
          </div>
        </div>

        {/* Card 2: Pendaftar Diterima (Light Green Tint) */}
        <div className="bg-[#DCFCE7] border border-emerald-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-extrabold text-[#16A34A] block">
              21
            </span>
            <span className="text-xs font-bold text-[#15803D] mt-2 block">
              Pendaftar Diterima
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#16A34A] flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-2xl font-bold">how_to_reg</span>
          </div>
        </div>

        {/* Card 3: Total Bidang (Light Yellow/Amber Tint) */}
        <div className="bg-[#FEF3C7] border border-amber-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-extrabold text-[#D97706] block">
              21
            </span>
            <span className="text-xs font-bold text-[#B45309] mt-2 block">
              Total Bidang
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-2xl font-bold">dashboard_customize</span>
          </div>
        </div>

        {/* Card 4: Kategori Tersedia (Light Slate Tint) */}
        <div className="bg-[#E2E8F0] border border-slate-300 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-extrabold text-[#334155] block">
              21
            </span>
            <span className="text-xs font-bold text-[#1E293B] mt-2 block">
              Kategori Tersedia
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#334155] flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-2xl font-bold">category</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: GRAFIK PENDAFTAR & RIGHT CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left (8 Cols): Grafik Pendaftar (Monthly Bar Chart) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Grafik Pendaftar</h3>

            {/* Legend Indicator */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#8B5CF6]"></span>
                <span className="text-slate-600">Diterima</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#F87171]"></span>
                <span className="text-slate-600">Tidak Diterima</span>
              </div>
            </div>
          </div>

          {/* Custom CSS/SVG Bar Chart for Jan - Des */}
          <div className="h-64 flex items-end justify-between gap-1.5 pt-6 pb-2 px-2 border-b border-slate-200 relative">

            {/* Y-Axis Grid Lines */}
            <div className="absolute inset-x-0 top-0 border-b border-slate-100 text-[10px] text-slate-400 pl-1">8</div>
            <div className="absolute inset-x-0 top-1/4 border-b border-slate-100 text-[10px] text-slate-400 pl-1">6</div>
            <div className="absolute inset-x-0 top-2/4 border-b border-slate-100 text-[10px] text-slate-400 pl-1">4</div>
            <div className="absolute inset-x-0 top-3/4 border-b border-slate-100 text-[10px] text-slate-400 pl-1">2</div>
            <div className="absolute inset-x-0 bottom-0 text-[10px] text-slate-400 pl-1">0</div>

            {/* Bars Mapping */}
            {monthlyData.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1 z-10 h-full justify-end group">
                <div className="flex items-end gap-1 w-full justify-center h-full">
                  {/* Accepted Bar (Purple) */}
                  <div
                    className="bg-[#8B5CF6] rounded-t-xs w-2.5 sm:w-3.5 transition-all group-hover:brightness-110"
                    style={{ height: `${(item.accepted / 8) * 100}%` }}
                    title={`${item.month} Diterima: ${item.accepted}`}
                  />
                  {/* Rejected Bar (Pink/Coral) */}
                  <div
                    className="bg-[#F87171] rounded-t-xs w-2.5 sm:w-3.5 transition-all group-hover:brightness-110"
                    style={{ height: `${(item.rejected / 8) * 100}%` }}
                    title={`${item.month} Tidak Diterima: ${item.rejected}`}
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 mt-2">
                  {item.month}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Legend */}
          <div className="flex justify-center items-center gap-6 text-xs font-bold text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#8B5CF6]"></span>
              <span>Diterima</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#F87171]"></span>
              <span>Tidak Diterima</span>
            </div>
          </div>
        </div>

        {/* Right Side Cards (4 Cols): Agenda Mendatang & Mahasiswa Bimbingan */}
        <div className="lg:col-span-4 space-y-6">

          {/* Card 1: Agenda Mendatang */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Agenda Mendatang</h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1">
                <h4 className="text-xs font-bold text-slate-900">
                  Bimbingan dengan Mentor
                </h4>
                <p className="text-[11px] text-slate-500">
                  2 Juni 2026 - 09:00
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1">
                <h4 className="text-xs font-bold text-slate-900">
                  Bimbingan dengan Mentor
                </h4>
                <p className="text-[11px] text-slate-500">
                  2 Juni 2026 - 09:00
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Mahasiswa Bimbingan */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Mahasiswa Bimbingan</h3>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Leona Strive"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900">Leona Strive</h4>
                    <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 mt-1 border border-slate-200">
                      <div className="bg-[#1f877c] h-full rounded-full text-[9px] text-white font-bold flex items-center justify-center" style={{ width: '20%' }}>
                        20%
                      </div>
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