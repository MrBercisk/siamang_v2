import { useEffect, useMemo, useState } from 'react';
import { apiRequest, ApiError } from '../../../lib/api';
import { formatDate } from '../../../utils/formatters';


type AdminApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected';

interface ApiCollection<T> {
  data: T[];
}

interface BackendAdminApplication {
  id: string | number;
  applicantName: string;
  fieldName?: string | null;
  kategoriName?: string | null;
  status: AdminApplicationStatus;
  submittedAt?: string | null;
  mentor?: { id: number; fullName: string } | null;
}

interface BackendBidang {
  id: number;
  name: string;
  status?: string | null;
}

interface BackendKategori {
  id: number;
  name: string;
}

interface MonthlyBucket {
  month: string;
  accepted: number;
  rejected: number;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function AdminDashboardTab() {
  const [applications, setApplications] = useState<BackendAdminApplication[]>([]);
  const [bidangs, setBidangs] = useState<BackendBidang[]>([]);
  const [kategoris, setKategoris] = useState<BackendKategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [appsRes, bidangsRes, kategorisRes] = await Promise.all([
          apiRequest<ApiCollection<BackendAdminApplication>>('/admin/applications'),
          apiRequest<ApiCollection<BackendBidang>>('/bidangs'),
          apiRequest<ApiCollection<BackendKategori>>('/kategoris'),
        ]);

        if (cancelled) return;

        setApplications(appsRes.data ?? []);
        setBidangs(bidangsRes.data ?? []);
        setKategoris(kategorisRes.data ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Gagal memuat data dashboard.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPendaftar = applications.length;
  const totalDiterima = useMemo(
    () => applications.filter((app) => app.status === 'accepted').length,
    [applications]
  );
  const totalBidang = bidangs.length;
  const totalKategori = kategoris.length;

  const monthlyData: MonthlyBucket[] = useMemo(() => {
    return MONTH_LABELS.map((month, idx) => {
      const itemsInMonth = applications.filter((app) => {
        if (!app.submittedAt) return false;
        return new Date(app.submittedAt).getMonth() === idx;
      });
      return {
        month,
        accepted: itemsInMonth.filter((app) => app.status === 'accepted').length,
        rejected: itemsInMonth.filter((app) => app.status === 'rejected').length,
      };
    });
  }, [applications]);

  const chartMax = Math.max(8, ...monthlyData.flatMap((m) => [m.accepted, m.rejected]));

  const recentApplications = useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime())
        .slice(0, 3),
    [applications]
  );

  const assignedApplications = useMemo(
    () => applications.filter((app) => app.mentor).slice(0, 3),
    [applications]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm font-medium text-slate-500">
        Memuat data dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24 text-sm font-medium text-red-500">
        Gagal memuat data: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">

      {/* TOP 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Card 1: Total Pendaftar (Light Blue Tint) */}
        <div className="bg-[#E0F2FE] border border-sky-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-extrabold text-[#0284C7] block">
              {totalPendaftar}
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
              {totalDiterima}
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
              {totalBidang}
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
              {totalKategori}
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
            <div className="absolute inset-x-0 top-0 border-b border-slate-100 text-[10px] text-slate-400 pl-1">{chartMax}</div>
            <div className="absolute inset-x-0 top-1/4 border-b border-slate-100 text-[10px] text-slate-400 pl-1">{Math.round(chartMax * 0.75)}</div>
            <div className="absolute inset-x-0 top-2/4 border-b border-slate-100 text-[10px] text-slate-400 pl-1">{Math.round(chartMax * 0.5)}</div>
            <div className="absolute inset-x-0 top-3/4 border-b border-slate-100 text-[10px] text-slate-400 pl-1">{Math.round(chartMax * 0.25)}</div>
            <div className="absolute inset-x-0 bottom-0 text-[10px] text-slate-400 pl-1">0</div>

            {/* Bars Mapping */}
            {monthlyData.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1 z-10 h-full justify-end group">
                <div className="flex items-end gap-1 w-full justify-center h-full">
                  {/* Accepted Bar (Purple) */}
                  <div
                    className="bg-[#8B5CF6] rounded-t-xs w-2.5 sm:w-3.5 transition-all group-hover:brightness-110"
                    style={{ height: `${(item.accepted / chartMax) * 100}%` }}
                    title={`${item.month} Diterima: ${item.accepted}`}
                  />
                  {/* Rejected Bar (Pink/Coral) */}
                  <div
                    className="bg-[#F87171] rounded-t-xs w-2.5 sm:w-3.5 transition-all group-hover:brightness-110"
                    style={{ height: `${(item.rejected / chartMax) * 100}%` }}
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

        {/* Right Side Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Card 1: Pendaftar Terbaru (pengganti Agenda Mendatang, belum ada endpoint agenda) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Pendaftar Terbaru</h3>

            <div className="space-y-3">
              {recentApplications.length === 0 && (
                <p className="text-xs text-slate-400">Belum ada pendaftar.</p>
              )}
              {recentApplications.map((app) => (
                <div key={app.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">
                    {app.applicantName}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {app.submittedAt ? formatDate(app.submittedAt) : '-'}
                    {app.fieldName ? ` · ${app.fieldName}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Mentor Ditugaskan (pengganti Mahasiswa Bimbingan, tanpa progress % karena belum ada di API) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Mentor Ditugaskan</h3>

            <div className="space-y-3">
              {assignedApplications.length === 0 && (
                <p className="text-xs text-slate-400">Belum ada Mentor yang ditugaskan.</p>
              )}
              {assignedApplications.map((app) => (
                <div key={app.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500">
                    {app.applicantName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900">{app.applicantName}</h4>
                    <p className="text-[10px] text-slate-500">
                      Mentor: {app.mentor?.fullName || '-'}
                    </p>
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