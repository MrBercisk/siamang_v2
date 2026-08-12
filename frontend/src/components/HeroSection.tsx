import { motion } from 'motion/react';

interface HeroSectionProps {
  onActionClick: () => void;
}

export function HeroSection({ onActionClick }: HeroSectionProps) {
  return (
    <section className="bg-[#1f877c] text-white py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Column Text */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start space-y-4"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight"
          >
            SI AMANG
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-white/95">
              Sistem Informasi Aplikasi Magang DISKOMINFOSAN Kota Yogyakarta
            </h2>
            <p className="text-white/85 text-sm md:text-base max-w-lg leading-relaxed">
              Temukan informasi program magang, daftar sesuai bidang, pantau jadwal kegiatan, dan jalani proses magang dalam satu platform terintegrasi.
            </p>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={onActionClick}
            className="mt-6 border border-white text-white hover:bg-white hover:text-[#1f877c] font-semibold text-sm py-3 px-6 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 flex items-center space-x-2 group"
          >
            <span>Lihat Program Magang</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </motion.button>
        </motion.div>

        {/* Right Column Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-64 md:h-96 w-full flex justify-center items-center"
        >
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHonkZslQ04ZOqMD71l_fl8YJVmK5thc0hnREVB3ZHisTF-GdowoRJYyUTcR8hGHPDy3CbhEPCXwwtOJhCy07nHfzmzKGwWVNNsp0KrCVes-1PNWqdE9XY-9t1m5VZq4_5VNZcvoJEocjl80jzsncPCz1S76blu3yQy93B53eg6dvPeF5fr0UwDfu9joNe1cFLVaY4ggpBKf0BcE836ri8rnuo9JEzeleLIJYg1T4b3FWDQnRrSfC2lQ" 
            alt="SI AMANG Magang Illustration" 
            className="w-full h-full object-contain object-center z-10 drop-shadow-xl" 
          />
          {/* Subtle Ambient Backdrop Glow */}
          <div className="absolute inset-0 bg-[#005c55] rounded-full opacity-30 blur-3xl transform scale-75 -z-0"></div>
        </motion.div>
      </div>
    </section>
  );
}

