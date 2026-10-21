import { motion } from 'framer-motion';
import { CAPABILITIES } from '../constants/solutions-data';

const CapabilitiesGrid = () => {
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
            Core Capabilities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-['Inter',sans-serif] text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            What I <span className="text-cyan-400">Deliver</span>
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
              className="group relative bg-[#0E0E0E] border border-[#222] hover:border-cyan-500/30 rounded-2xl p-8 transition-all duration-500"
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b ${cap.gradient}`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/5 transition-all duration-500">
                  <cap.icon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                </div>

                <h3 className="font-['Inter',sans-serif] text-xl font-bold text-white mb-3 group-hover:text-cyan-100 transition-colors">
                  {cap.title}
                </h3>
                <p className="text-gray-400 font-['Inter',sans-serif] text-sm leading-relaxed mb-6">
                  {cap.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2.5">
                  {cap.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-['JetBrains_Mono',monospace] text-[11px] text-gray-500 group-hover:text-gray-400 transition-colors">
                        {h}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesGrid;
