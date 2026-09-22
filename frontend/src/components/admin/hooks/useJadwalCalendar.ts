import { useMemo, useState } from 'react';
import type { ScheduleEvent } from '../../../types/jadwalBimbingan';
import { buildCalendarCells, groupByDate, pad, toDateStr } from '../../../utils/calendar';

export function useJadwalCalendar(events: ScheduleEvent[]) {
  // Kalender mulai dari bulan & tanggal hari ini
  const today = useMemo(() => new Date(), []);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // --- Turunan data ---------------------------------------------------------
  const eventsByDate = useMemo(() => groupByDate(events), [events]);

  const monthPrefix = `${currentYear}-${pad(currentMonthIndex + 1)}-`;
  const monthEvents = useMemo(
    () => events.filter((event) => event.date.startsWith(monthPrefix)),
    [events, monthPrefix]
  );

  const calendarCells = useMemo(
    () => buildCalendarCells(currentYear, currentMonthIndex),
    [currentYear, currentMonthIndex]
  );

  const selectedDayEvents = eventsByDate[selectedDate] ?? [];

  // --- Navigasi -------------------------------------------------------------
  const goToMonth = (year: number, monthIndex: number) => {
    setCurrentYear(year);
    setCurrentMonthIndex(monthIndex);
    setSelectedDate(toDateStr(year, monthIndex, 1));
  };

  const goToPrevMonth = () => {
    if (currentMonthIndex === 0) goToMonth(currentYear - 1, 11);
    else goToMonth(currentYear, currentMonthIndex - 1);
  };

  const goToNextMonth = () => {
    if (currentMonthIndex === 11) goToMonth(currentYear + 1, 0);
    else goToMonth(currentYear, currentMonthIndex + 1);
  };

  /** Pindahkan kalender ke bulan & tanggal tertentu (format YYYY-MM-DD). */
  const jumpToDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-').map(Number);
    setCurrentYear(year);
    setCurrentMonthIndex(month - 1);
    setSelectedDate(dateStr);
  };

  return {
    todayStr,
    currentYear,
    currentMonthIndex,
    selectedDate,
    setSelectedDate,
    eventsByDate,
    monthEvents,
    calendarCells,
    selectedDayEvents,
    goToPrevMonth,
    goToNextMonth,
    jumpToDate,
  };
}