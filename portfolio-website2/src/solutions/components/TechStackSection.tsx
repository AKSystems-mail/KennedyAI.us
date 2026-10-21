import { motion } from 'framer-motion';
import { TECH_CATEGORIES } from '../constants/solutions-data';

const TechStackSection = () => {
  return (
    <section className="relative py-24 md:py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-16 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-['JetBrains_Mono',monospace] text-[10px] md:text-xs text-cyan-400 uppercase tracking-[0.4em] block mb-4"
          >
            Toolchain
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-['Inter',sans-serif] text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Full-Stack <span className="text-cyan-400">Toolchain</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TECH_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
              className="group bg-[#0E0E0E] border border-[#222] hover:border-cyan-500/20 rounded-xl p-5 transition-all duration-400"
            >
              <span className="font-['JetBrains_Mono',monospace] text-[10px] text-cyan-400 uppercase tracking-[0.3em] block mb-4">
                {cat.category}
              </span>

              <div className="space-y-2">
                {cat.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 group/item"
                  >
                    {/* Bullet */}
                    <div className="w-1 h-1 rounded-full bg-gray-600 group-hover/item:bg-cyan-400 transition-colors" />
                    <span className="font-['Inter',sans-serif] text-sm text-gray-400 group-hover/item:text-gray-200 transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
