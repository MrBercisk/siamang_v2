import { useMemo, useState } from 'react';
import { formatDate } from '../../../utils/formatters';
import { isActiveBimbingan, useBimbinganAdmin } from '../hooks/useBimbinganAdmin';
import { getScheduleStatus, useJadwalBimbinganAdmin } from '../hooks/useJadwalBimbinganAdmin';

/**
 * Lokasi file: src/components/admin/tabs/BimbinganSettingsTab.tsx
 *
 * Dua sumber data:
 * - Bimbingan (GET /admin/bimbingans)        -> monitoring per peserta: mentor, status, progress.
 * - JadwalBimbingan (/admin/jadwal-bimbingans) -> daftar sesi terdekat di bagian bawah.
 */

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

function statusBadge(status: string): string {
  const value = status.toLowerCase();
  if (isActiveBimbingan(value)) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (['selesai', 'completed', 'done', 'lulus'].includes(value)) {
    return 'bg-slate-100 text-slate-600 border-slate-200';
  }
  if (['dibatalkan', 'batal', 'ditolak', 'nonaktif', 'dihentikan'].includes(value)) {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  }
  return 'bg-sky-50 text-sky-700 border-sky-200';
}

export function BimbinganSettingsTab() {
  const bimbingan = useBimbinganAdmin();
  const jadwal = useJadwalBimbinganAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { items, loading, error } = bimbingan;

  // Ringkasan status dibuat dari data, bukan daftar tetap.
  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => counts.set(item.status, (counts.get(item.status) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const activeItems = useMemo(() => items.filter((item) => isActiveBimbingan(item.status)), [items]);

  const averageProgress = useMemo(() => {
    if (activeItems.length === 0) return null;
    const total = activeItems.reduce((sum, item) => sum + item.progressPercent, 0);
    return Math.round(total / activeItems.length);
  }, [activeItems]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (!keyword) return true;
      return [item.participantName, item.mentorName, item.projectTitle, item.institution, item.registrationNumber]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword));
    });
  }, [items, search, statusFilter]);

  const upcomingSchedules = useMemo(() => {
    const now = new Date();
    return jadwal.events.filter((event) => getScheduleStatus(event, now) !== 'selesai').slice(0, 5);
  }, [jadwal.events]);

  const handleRefresh = () => {
    bimbingan.refetch();
    jadwal.refetch();
  };

  const isActive = activeItems.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 capitalize">Pengaturan Bimbingan Magang</h2>
          <p className="text-xs text-slate-500">
            Monitoring aktivitas bimbingan peserta magang dengan pembimbing lapangan DISKOMINFOSAN
            Kota Yogyakarta.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="self-start px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? 'Memuat...' : 'Muat ulang'}
        </button>
      </div>

      {/* Status sistem */}
      {!error && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold ${
            isActive
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {loading
            ? 'Memeriksa status sistem bimbingan...'
            : isActive
              ? `Status Sistem Bimbingan: Aktif (${activeItems.length} Bimbingan Berjalan${
                  averageProgress !== null ? `, rata-rata progress ${averageProgress}%` : ''
                })`
              : `Status Sistem Bimbingan: Belum ada bimbingan yang berjalan (${items.length} tercatat)`}
        </div>
      )}

      {/* Ringkasan per status */}
      {!error && (loading || statusCounts.length > 0) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {loading
            ? [0, 1, 2].map((key) => <div key={key} className="h-[74px] rounded-xl bg-slate-100 animate-pulse" />)
            : statusCounts.map(([status, count]) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
                  className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    statusFilter === status
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{capitalize(status)}</p>
                </button>
              ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari peserta, mentor, project, atau nomor pendaftaran"
          className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <option value="all">Semua status</option>
          {statusCounts.map(([status]) => (
            <option key={status} value={status}>
              {capitalize(status)}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="font-bold">{error}</span>
          <button
            type="button"
            onClick={bimbingan.refetch}
            className="self-start px-3 py-1.5 font-bold bg-white border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Tabel bimbingan */}
      {!error && (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Peserta</th>
                <th className="px-4 py-3 font-semibold">Mentor lapangan</th>
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold min-w-[140px]">Progress</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Update terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="px-4 py-3">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    {items.length === 0
                      ? 'Belum ada bimbingan. Bimbingan dibuat otomatis saat pendaftaran diterima.'
                      : 'Tidak ada data yang cocok. Ubah kata kunci atau filter status.'}
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{item.participantName}</p>
                      {item.institution && <p className="text-slate-500">{item.institution}</p>}
                      <p className="text-[11px] text-slate-400">{item.registrationNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{item.mentorName}</td>
                    <td className="px-4 py-3 text-slate-700">
                      <p className="font-medium">{item.projectTitle}</p>
                      <p className="text-slate-500">
                        {[item.kategoriName, item.registrationType].filter(Boolean).join(' • ')}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1f877c] rounded-full"
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700 w-9 text-right">
                          {item.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full border font-bold ${statusBadge(item.status)}`}
                      >
                        {capitalize(item.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {item.lastUpdate ? formatDate(item.lastUpdate) : '-'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <p className="text-xs text-slate-500">
          Menampilkan {filtered.length} dari {items.length} bimbingan.
        </p>
      )}

      {/* Jadwal terdekat */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Jadwal bimbingan terdekat</h3>

        {jadwal.error ? (
          <p className="text-xs text-rose-700">{jadwal.error}</p>
        ) : jadwal.loading ? (
          <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
        ) : upcomingSchedules.length === 0 ? (
          <p className="text-xs text-slate-500">
            Tidak ada jadwal mendatang. Tambahkan dari menu Jadwal Bimbingan.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
            {upcomingSchedules.map((event) => (
              <li key={event.id} className="px-4 py-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <p className="font-semibold text-slate-900">{event.title}</p>
                  <p className="text-slate-500">
                    {event.studentName} dengan {event.mentorName}
                  </p>
                </div>
                <p className="text-slate-700 whitespace-nowrap">
                  {formatDate(event.date)} • {event.time} WIB
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}