export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const pad = (value: number) => String(value).padStart(2, '0');

/** Format YYYY-MM-DD. `monthIndex` berbasis 0 (Januari = 0). */
export const toDateStr = (year: number, monthIndex: number, day: number) =>
  `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

export interface CalendarCell {
  day: number;
  /** false = sel pengisi dari bulan sebelum/sesudahnya. */
  inMonth: boolean;
}

/** Sel kalender satu bulan (minggu dimulai hari Minggu), lengkap dengan sel pengisi. */
export function buildCalendarCells(year: number, monthIndex: number): CalendarCell[] {
  const firstWeekday = new Date(year, monthIndex, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const prevMonthDays = new Date(year, monthIndex, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayOffset = index - firstWeekday + 1;
    if (dayOffset < 1) return { day: prevMonthDays + dayOffset, inMonth: false };
    if (dayOffset > daysInMonth) return { day: dayOffset - daysInMonth, inMonth: false };
    return { day: dayOffset, inMonth: true };
  });
}

/** Kelompokkan item berdasarkan properti `date` (YYYY-MM-DD). */
export function groupByDate<T extends { date: string }>(items: T[]): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};
  items.forEach((item) => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item);
  });
  return grouped;
}