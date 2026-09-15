import { useState } from 'react';
import { DemoApplicationStatus } from '../../types/home';
import { StatusPendingPanel } from './status/StatusPendingPanel';
import { StatusAcceptedPanel } from './status/StatusAcceptedPanel';
import { StatusRejectedPanel } from './status/StatusRejectedPanel';

interface StatusTabProps {
  onContactWhatsApp: () => void;
  onGoToBidang: () => void;
}

const DEMO_STATUS_OPTIONS: {
  key: DemoApplicationStatus;
  label: string;
  activeClassName: string;
}[] = [
  {
    key: 'pending',
    label: 'Pending Administrasi',
    activeClassName: 'bg-amber-100 text-amber-800 border border-amber-300',
  },
  {
    key: 'accepted',
    label: 'Diterima',
    activeClassName: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  },
  {
    key: 'rejected',
    label: 'Tidak Diterima',
    activeClassName: 'bg-rose-100 text-rose-800 border border-rose-300',
  },
];

// Simulasi sederhana: keyword pada input menentukan status demo yang ditampilkan.
function resolveDemoStatusFromQuery(query: string): DemoApplicationStatus {
  const normalized = query.toLowerCase();
  if (normalized.includes('diterima') || normalized.includes('lolos')) return 'accepted';
  if (normalized.includes('tolak') || normalized.includes('gagal')) return 'rejected';
  return 'pending';
}

export function StatusTab({ onContactWhatsApp, onGoToBidang }: StatusTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDemoStatus, setSelectedDemoStatus] = useState<DemoApplicationStatus>('pending');

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-start gap-3">
        <div className="text-[#1f877c] mt-0.5">
          <span className="material-symbols-outlined text-2xl font-bold">account_box</span>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1e293b]">Cek Status Pendaftaran</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Masukkan nomor pendaftaran atau email terdaftar untuk melihat progress seleksi Anda.
          </p>
        </div>
      </div>

      {/* Search Card & Illustration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#1e293b] mb-2">
              Nomor Pendaftaran atau email
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Contoh: 5001234556 atau leona@gmail.com"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1f877c] focus:ring-2 focus:ring-[#1f877c]/20 text-xs sm:text-sm transition-colors text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setSelectedDemoStatus(resolveDemoStatusFromQuery(searchQuery))}
                className="bg-[#1f877c] hover:bg-[#196e65] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <span>Cek Status</span>
                <span className="material-symbols-outlined text-lg">search</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-[#ECFDF5] border border-emerald-100 rounded-xl flex items-center gap-2.5 text-xs text-slate-700">
            <span className="material-symbols-outlined text-lg text-[#1f877c] shrink-0">info</span>
            <span>Belum mendapatkan nomor pendaftaran? Cek email konfirmasi Anda.</span>
          </div>

          {/* Demo Status Switcher */}
          <div className="pt-2 flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Simulasi Status:
            </span>
            {DEMO_STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSelectedDemoStatus(opt.key)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedDemoStatus === opt.key
                    ? opt.activeClassName
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-xs flex items-center justify-center p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
            <img
              src="https://illustrations.popsy.co/emerald/checking-boxes.svg"
              alt="Check Status Illustration"
              className="w-full h-auto max-h-48 object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://illustrations.popsy.co/teal/work-from-home.svg';
              }}
            />
          </div>
        </div>
      </div>

      {selectedDemoStatus === 'pending' && (
        <StatusPendingPanel onContactWhatsApp={onContactWhatsApp} />
      )}
      {selectedDemoStatus === 'accepted' && <StatusAcceptedPanel />}
      {selectedDemoStatus === 'rejected' && (
        <StatusRejectedPanel onGoToBidang={onGoToBidang} />
      )}
    </div>
  );
}