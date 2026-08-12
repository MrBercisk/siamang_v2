import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          title="Kembali ke atas"
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#1f877c] hover:bg-[#196e65] active:scale-90 text-white rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all flex items-center justify-center cursor-pointer group"
        >
          <span className="material-symbols-outlined text-2xl group-hover:-translate-y-1 transition-transform">
            keyboard_arrow_up
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
