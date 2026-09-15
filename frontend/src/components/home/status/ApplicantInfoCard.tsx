import { DetailRow } from '../../../types/home';

interface ApplicantInfoCardProps {
  name: string;
  badgeIcon: string;
  badgeLabel: string;
  badgeClassName: string;
  message?: string;
  messageClassName?: string;
  details: DetailRow[];
}

export function ApplicantInfoCard({
  name,
  badgeIcon,
  badgeLabel,
  badgeClassName,
  message,
  messageClassName,
  details,
}: ApplicantInfoCardProps) {
  return (
    <div className="lg:col-span-5 space-y-5">
      <div className="flex items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          alt={name}
          className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-2xs"
          loading="lazy"
          decoding="async"
        />
        <div>
          <h4 className="text-lg font-extrabold text-[#1e293b]">{name}</h4>
          <p className="text-xs text-slate-400">Nomor Pendaftaran</p>
          <div
            className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badgeClassName}`}
          >
            <span className="material-symbols-outlined text-sm">{badgeIcon}</span>
            <span>{badgeLabel}</span>
          </div>
        </div>
      </div>

      {message && (
        <p className={`text-xs font-bold leading-snug ${messageClassName ?? ''}`}>{message}</p>
      )}

      <div className={message ? 'pt-1' : 'pt-2'}>
        <h5 className="text-xs sm:text-sm font-bold text-[#1e293b] mb-3">Detail Pendaftaran</h5>
        <div className="space-y-3 text-xs sm:text-sm">
          {details.map((detail) => (
            <div key={detail.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="material-symbols-outlined text-base">{detail.icon}</span>
                <span>{detail.label}</span>
              </span>
              <span className="font-bold text-[#1e293b]">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}