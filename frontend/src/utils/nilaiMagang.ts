import { NILAI_ASPECTS } from '../types/bimbinganMentor';
import type { NilaiScores } from '../types/bimbinganMentor';

/** Lokasi file: src/utils/nilaiMagang.ts — hitungan nilai akhir magang. */

export const MIN_SCORE = 0;
export const MAX_SCORE = 10;

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return MIN_SCORE;
  return Math.min(MAX_SCORE, Math.max(MIN_SCORE, value));
}

export function calculateAverage(scores: NilaiScores): number {
  const total = NILAI_ASPECTS.reduce((sum, { key }) => sum + scores[key], 0);
  return Number((total / NILAI_ASPECTS.length).toFixed(1));
}

export function getPredikat(average: number): string {
  if (average >= 8.5) return 'Sangat Baik (A)';
  if (average >= 7.5) return 'Baik (B)';
  if (average >= 6.0) return 'Cukup (C)';
  if (average > 0) return 'Kurang (D)';
  return 'Belum Ada Predikat';
}