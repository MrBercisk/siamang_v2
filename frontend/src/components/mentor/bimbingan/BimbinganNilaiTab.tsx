import React, { useState } from 'react';
import { NILAI_ASPECTS } from '../../../types/bimbinganMentor';
import type { NilaiData, NilaiKey, NilaiScores } from '../../../types/bimbinganMentor';
import { calculateAverage, clampScore, getPredikat } from '../../../utils/nilaiMagang';

interface BimbinganNilaiTabProps {
  nilai: NilaiData;
  saving: boolean;
  /** Kembalikan true bila berhasil disimpan. */
  onSave: (scores: NilaiScores, suratFile: File | null) => Promise<boolean>;
}

export const BimbinganNilaiTab: React.FC<BimbinganNilaiTabProps> = ({ nilai, saving, onSave }) => {
  const [scores, setScores] = useState<NilaiScores>(nilai.scores);
  const [suratFile, setSuratFile] = useState<File | null>(null);

  const average = calculateAverage(scores);
  const predikat = getPredikat(average);

  const handleScoreChange = (key: NilaiKey, value: number) =>
    setScores((prev) => ({ ...prev, [key]: clampScore(value) }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuratFile(e.target.files?.[0] ?? null);
  };

  const handleSave = async () => {
    const success = await onSave(scores, suratFile);
    // File sudah tersimpan di server; tampilkan nama dari server, bukan file lokal.
    if (success) setSuratFile(null);
  };

  const fileLabel = suratFile?.name ?? nilai.suratKeteranganName ?? 'Pilih surat keterangan magang';

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KIRI: TABEL ASPEK PENILAIAN */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/60 text-slate-900 font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4 text-center w-12">No</th>
                  <th className="py-3.5 px-4">Aspek Penilaian</th>
                  <th className="py-3.5 px-4 text-center w-36">Nilai Mentor (0-100)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {NILAI_ASPECTS.map(({ key, label }, index) => (
                  <tr key={key}>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{label}</td>
                    <td className="py-2 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scores[key]}
                        onChange={(e) => handleScoreChange(key, Number(e.target.value))}
                        className="w-16 text-center border border-slate-200 rounded-lg py-1 px-2 font-bold text-slate-900 focus:outline-hidden focus:border-[#1f877c]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* RINGKASAN NILAI AKHIR */}
            <div className="p-4 bg-[#E6F7F3]/70 border-t border-[#C6EFE7] flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Rata-Rata Nilai Akhir</span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Predikat:</span>
                  <span className="font-bold text-rose-600">{predikat}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-[#1f877c]">
                  {average} / 100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KANAN: UPLOAD SURAT KETERANGAN & SIMPAN */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Upload Surat Keterangan Magang</h4>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#1f877c] cursor-pointer transition-all shadow-2xs">
              <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                {fileLabel}
              </span>
              <span className="material-symbols-outlined text-slate-400 text-lg">file_upload</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {nilai.suratKeteranganUrl && !suratFile && (
              <a
                href={nilai.suratKeteranganUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-[#1f877c] hover:underline"
              >
                Lihat surat keterangan yang sudah diunggah
              </a>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#1f877c] hover:bg-[#196e65] text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Penilaian'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};