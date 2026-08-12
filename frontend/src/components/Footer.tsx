import { useState } from 'react';
import { FooterModal, FooterModalType } from './FooterModal';
import { JogjaEmblemLogo } from './JogjaEmblemLogo';

interface FooterProps {
  onNavigate: (page: 'home' | 'info' | 'register' | 'login' | 'dashboard') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [activeModal, setActiveModal] = useState<FooterModalType>(null);

  return (
    <>
      <footer className="bg-[#1f877c] text-white w-full font-sans border-t border-[#1b8077] pt-12 pb-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
            {/* Column 1: Brand & Logo (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3.5">
                <JogjaEmblemLogo className="w-14 h-16 shrink-0 filter drop-shadow-md" />
                <div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight leading-none">
                    SI AMANG
                  </h3>
                  <p className="text-[11px] font-medium text-white/90 leading-snug mt-1 max-w-xs">
                    Sistem Informasi Aplikasi Magang Dinas Komunikasi Informatika dan Persandian Kota Yogyakarta
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/90 leading-relaxed font-normal pt-1">
                Platform resmi untuk informasi, pendaftaran, dan pengelolaan kegiatan magang mahasiswa secara terintegrasi di lingkungan DISKOMINFOSAN Kota Yogyakarta.
              </p>

              {/* Social Media Links */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-medium text-white">Ikuti kami di</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://youtube.com/@diskominfojogjakota"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                    aria-label="YouTube DISKOMINFOSAN Kota Yogyakarta"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FF0000">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com/kominfosandi_jogja"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                    aria-label="Instagram DISKOMINFOSAN Kota Yogyakarta"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="url(#ig-grad)">
                      <defs>
                        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#fdf497" />
                          <stop offset="5%" stopColor="#fdf497" />
                          <stop offset="45%" stopColor="#fd5949" />
                          <stop offset="60%" stopColor="#d6249f" />
                          <stop offset="100%" stopColor="#285AEB" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Navigasi (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-bold text-base text-white mb-2">Navigasi</h4>
              <ul className="space-y-2 text-xs font-normal text-white/90">
                <li>
                  <button
                    onClick={() => onNavigate('home')}
                    className="hover:underline hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('info')}
                    className="hover:underline hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Info Magang
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('pedoman')}
                    className="hover:underline hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Pedoman
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('panduan-magang')}
                    className="hover:underline hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Panduan Magang
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Kontak Kami (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-bold text-base text-white mb-2">Kontak Kami</h4>
              <div className="space-y-3">
                {/* Alamat */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base text-white">location_on</span>
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-white">Alamat</span>
                    <span className="text-[11px] text-white/90 leading-tight block">
                      Jl. Kenari, Muja Muju, Kec. Umbulharjo, Kota Yogyakarta, DIY 55165
                    </span>
                  </div>
                </div>

                {/* Telepon */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base text-white">call</span>
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-white">Telepon</span>
                    <span className="text-[11px] text-white/90 block">(0274) 515865</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base text-white">mail</span>
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-white">Email</span>
                    <span className="text-[11px] text-white/90 block truncate max-w-[200px]">
                      kominfosandi@jogjakota.go.id
                    </span>
                  </div>
                </div>

                {/* Jam Operasional */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base text-white">schedule</span>
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-white">Jam Operasional</span>
                    <span className="text-[11px] text-white/90 block leading-tight">
                      Senin - Jumat<br />08.00 - 16.00 WIB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Bantuan dan Informasi (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-bold text-base text-white mb-2">Bantuan dan Informasi</h4>
              <div className="space-y-2 text-xs text-white/90">
                <button
                  onClick={() => setActiveModal('faq')}
                  className="flex items-center gap-2.5 w-full text-left hover:text-white group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <span className="material-symbols-outlined text-sm text-white">help_outline</span>
                  </div>
                  <span className="group-hover:underline">FAQ</span>
                </button>

                <button
                  onClick={() => setActiveModal('panduan-pendaftaran')}
                  className="flex items-center gap-2.5 w-full text-left hover:text-white group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <span className="material-symbols-outlined text-sm text-white">assignment</span>
                  </div>
                  <span className="group-hover:underline">Panduan Pendaftaran</span>
                </button>

                <button
                  onClick={() => setActiveModal('cek-status')}
                  className="flex items-center gap-2.5 w-full text-left hover:text-white group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <span className="material-symbols-outlined text-sm text-white">published_with_changes</span>
                  </div>
                  <span className="group-hover:underline">Cek Status Pendaftaran</span>
                </button>

                <button
                  onClick={() => setActiveModal('hubungi-admin')}
                  className="flex items-center gap-2.5 w-full text-left hover:text-white group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <span className="material-symbols-outlined text-sm text-white">chat</span>
                  </div>
                  <span className="group-hover:underline">Hubungi Admin</span>
                </button>

                <button
                  onClick={() => setActiveModal('kebijakan-privasi')}
                  className="flex items-center gap-2.5 w-full text-left hover:text-white group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <span className="material-symbols-outlined text-sm text-white">security</span>
                  </div>
                  <span className="group-hover:underline">Kebijakan Privasi</span>
                </button>

                <button
                  onClick={() => setActiveModal('syarat-ketentuan')}
                  className="flex items-center gap-2.5 w-full text-left hover:text-white group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <span className="material-symbols-outlined text-sm text-white">gavel</span>
                  </div>
                  <span className="group-hover:underline">Syarat & Ketentuan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar Separator & Footer Links */}
          <div className="border-t border-white/20 pt-5 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            {/* Left: Dikelola Oleh */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm text-white">cancel</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-white/80 block leading-tight">Dikelola oleh</span>
                <span className="text-xs font-bold text-white block leading-tight">
                  DISKOMINFOSAN Kota Yogyakarta
                </span>
              </div>
            </div>

            {/* Center: Copyright */}
            <div className="text-center">
              <span className="text-xs font-bold text-white block">
                © 2026 SI AMANG - DISKOMINFOSAN Kota Yogyakarta.
              </span>
              <span className="text-[10px] text-white/80 block mt-0.5">
                All Right Reserved.
              </span>
            </div>

            {/* Right: Official Portal Info */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm text-white">verified_user</span>
              </div>
              <div className="text-left md:text-right">
                <span className="text-[10px] text-white/80 block leading-tight">
                  Website resmi Pemerintah Kota Yogyakarta
                </span>
                <span className="text-xs font-semibold text-white block leading-tight">
                  Terpercaya. Informatif. Melayani.
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Modal */}
      <FooterModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
        onNavigate={onNavigate}
      />
    </>
  );
}
