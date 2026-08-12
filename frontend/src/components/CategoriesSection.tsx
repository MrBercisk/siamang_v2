import { motion } from 'motion/react';
import { InternshipCategory } from '../types/internship';

interface CategoriesSectionProps {
  categories: InternshipCategory[];
  onSelectCategory?: (category: InternshipCategory) => void;
}

export function CategoriesSection({ categories, onSelectCategory }: CategoriesSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-[#f7f9fb] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-[#005c55] mb-2">
          Bidang dan Kategori
        </h2>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Terdapat beberapa bidang dan kategori yang sesuai dengan keahlian<br className="hidden sm:inline" /> dan tools yang anda kuasai
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => (
          <motion.div 
            key={cat.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
            onClick={() => onSelectCategory && onSelectCategory(cat)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-start space-x-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            {/* Avatar / Icon */}
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-[#005c55]/30 transition-colors">
              {cat.avatarUrl ? (
                <img src={cat.avatarUrl} alt={cat.title} className="w-8 h-8 object-contain" />
              ) : (
                <span className="material-symbols-outlined text-[#005c55] text-2xl">
                  {cat.icon || 'work'}
                </span>
              )}
            </div>

            {/* Category Content */}
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-bold text-[#005c55] mb-2 group-hover:text-[#0f766e] transition-colors">
                {cat.title}
              </h3>
              <ul className="text-slate-600 text-xs md:text-sm space-y-2">
                {cat.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#10B981] text-base font-bold">
                      check_circle
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

