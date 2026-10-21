import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants/solutions-data';

const SocialProof = () => {
  return (
    <section className="relative py-24 md:py-20 bg-[#0A0A0A] border-t border-[#222]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-['JetBrains_Mono',monospace] text-[10px] md:text-xs text-cyan-400 uppercase tracking-[0.4em] block mb-4"
          >
            What People Say
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-['Inter',sans-serif] text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            Trusted by <span className="text-cyan-400">Peers</span>
          </motion.h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
              className="bg-[#0E0E0E] border border-[#222] hover:border-cyan-500/20 rounded-2xl p-8 transition-all duration-500"
            >
              {/* Quote icon */}
              <svg
                className="w-8 h-8 text-cyan-400/30 mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v9.999h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v9.999h-9.983z" />
              </svg>

              <p className="font-['Inter',sans-serif] text-base text-gray-300 leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div>
                <p className="font-['Inter',sans-serif] text-sm font-bold text-white">{t.author}</p>
                <p className="font-['JetBrains_Mono',monospace] text-[10px] text-gray-500 uppercase tracking-widest">
                  {t.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
