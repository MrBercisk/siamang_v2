import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../lib/api';
import { showConfirmAlert, showSuccessAlert, showToast } from '../../../utils/swal';
import { calculateAverage, getPredikat } from '../../../utils/nilaiMagang';
import type { BimbinganDetail, NilaiScores } from '../../../types/bimbinganMentor';
import {
  fetchBimbinganDetail,
  setLaporanStatus,
  submitNilai,
} from './bimbinganMentorApi';


export function useBimbinganMentorDetail(id: string) {
  const [detail, setDetail] = useState<BimbinganDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingNilai, setSavingNilai] = useState(false);
  const [updatingLaporanId, setUpdatingLaporanId] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDetail(await fetchBimbinganDetail(id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat detail bimbingan.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const saveNilai = async (scores: NilaiScores, suratFile: File | null): Promise<boolean> => {
    setSavingNilai(true);
    try {
      const updated = await submitNilai(id, scores, suratFile);
      setDetail(updated);

      const average = calculateAverage(scores);
      showSuccessAlert(
        'Penilaian Berhasil Disimpan!',
        `Nilai rata-rata ${average}/100 (${getPredikat(average)}) telah tersimpan untuk ${updated.nama}.`
      );
      return true;
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal menyimpan penilaian.');
      return false;
    } finally {
      setSavingNilai(false);
    }
  };

  const updateLaporanStatus = async (
    laporanId: string,
    status: 'diterima' | 'ditolak',
    catatan?: string
  ): Promise<void> => {
    const laporan = detail?.laporanList.find((item) => item.id === laporanId);
    if (!laporan) return;

    if (status === 'ditolak') {
      const confirmed = await showConfirmAlert({
        title: 'Tolak Laporan?',
        text: `Laporan "${laporan.judulLaporan}" akan ditandai ditolak dan mahasiswa diminta merevisi.`,
        confirmButtonText: 'Ya, Tolak',
      });
      if (!confirmed) return;
    }

    setUpdatingLaporanId(laporanId);
    try {
      await setLaporanStatus(id, laporanId, status, catatan);
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              laporanList: prev.laporanList.map((item) =>
                item.id === laporanId
                  ? { ...item, status, catatanReject: status === 'ditolak' ? catatan : undefined }
                  : item
              ),
            }
          : prev
      );
      showToast(
        status === 'diterima' ? 'success' : 'info',
        status === 'diterima' ? 'Laporan disetujui!' : 'Laporan ditolak / minta revisi.'
      );
    } catch (err) {
      showToast('error', err instanceof ApiError ? err.message : 'Gagal memperbarui status laporan.');
    } finally {
      setUpdatingLaporanId(null);
    }
  };

  return {
    detail,
    loading,
    error,
    refetch: fetchDetail,
    savingNilai,
    updatingLaporanId,
    saveNilai,
    updateLaporanStatus,
  };
}