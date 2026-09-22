import React from 'react';

interface JadwalErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export const JadwalErrorBanner: React.FC<JadwalErrorBannerProps> = ({ message, onRetry }) => (
  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <span className="font-bold">{message}</span>
    <button
      type="button"
      onClick={onRetry}
      className="self-start px-3 py-1.5 font-bold bg-white border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer"
    >
      Coba lagi
    </button>
  </div>
);