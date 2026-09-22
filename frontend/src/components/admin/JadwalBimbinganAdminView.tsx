import React, { useState } from 'react';
import { useJadwalBimbinganAdmin } from './hooks/useJadwalBimbinganAdmin';
import { useJadwalCalendar } from './hooks/useJadwalCalendar';
import type { JadwalFormValues, ScheduleEvent } from '../../types/jadwalBimbingan';
import { JadwalGoogleCalendarCard } from './jadwalBimbingan/JadwalGoogleCalendarCard';
import { JadwalErrorBanner } from './jadwalBimbingan/JadwalErrorBanner';
import { JadwalActionBar } from './jadwalBimbingan/JadwalActionBar';
import { JadwalCalendar } from './jadwalBimbingan/JadwalCalendar';
import { JadwalDayAgenda } from './jadwalBimbingan/JadwalDayAgenda';
import { JadwalMonthList } from './jadwalBimbingan/JadwalMonthList';
import { JadwalFormModal } from './jadwalBimbingan/JadwalFormModal';

// Tipe dipindah ke types/jadwalBimbingan; re-export supaya import lama tetap jalan.
export type { ScheduleEvent };

export const JadwalBimbinganAdminView: React.FC = () => {
  const {
    events,
    students,
    mentors,
    loading,
    syncing,
    error,
    refetch,
    syncFromGoogle,
    createJadwal,
    deleteJadwal,
  } = useJadwalBimbinganAdmin({ withOptions: true });

  const calendar = useJadwalCalendar(events);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreate = async (values: JadwalFormValues): Promise<boolean> => {
    const success = await createJadwal(values);
    // Pindahkan kalender ke bulan & tanggal jadwal yang baru dibuat
    if (success) calendar.jumpToDate(values.date);
    return success;
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      {/* PAGE TITLE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Jadwal Bimbingan Mahasiswa
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Kelola agenda bimbingan magang dan pertemuan mentor.
          </p>
        </div>

        <JadwalGoogleCalendarCard events={events} loading={loading} />
      </div>

      {error && <JadwalErrorBanner message={error} onRetry={refetch} />}

      <JadwalActionBar
        loading={loading}
        syncing={syncing}
        onRefresh={refetch}
        onSyncFromGoogle={syncFromGoogle}
      />

      <JadwalCalendar
        year={calendar.currentYear}
        monthIndex={calendar.currentMonthIndex}
        cells={calendar.calendarCells}
        eventsByDate={calendar.eventsByDate}
        selectedDate={calendar.selectedDate}
        todayStr={calendar.todayStr}
        onSelectDate={calendar.setSelectedDate}
        onPrevMonth={calendar.goToPrevMonth}
        onNextMonth={calendar.goToNextMonth}
        onAdd={() => setShowAddModal(true)}
      />

      {/* AGENDA HARI TERPILIH & DAFTAR BULAN INI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <JadwalDayAgenda
          className="lg:col-span-7"
          selectedDate={calendar.selectedDate}
          events={calendar.selectedDayEvents}
          initialLoading={loading && events.length === 0}
          onAdd={() => setShowAddModal(true)}
          onDelete={deleteJadwal}
        />

        <JadwalMonthList
          className="lg:col-span-5"
          events={calendar.monthEvents}
          year={calendar.currentYear}
          monthIndex={calendar.currentMonthIndex}
          selectedDate={calendar.selectedDate}
          onSelectDate={calendar.setSelectedDate}
        />
      </div>

      {/* MODAL TAMBAH JADWAL BIMBINGAN */}
      <JadwalFormModal
        open={showAddModal}
        initialDate={calendar.selectedDate}
        students={students}
        mentors={mentors}
        loading={loading}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};