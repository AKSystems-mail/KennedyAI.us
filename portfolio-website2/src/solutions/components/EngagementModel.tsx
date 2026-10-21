import { motion } from 'framer-motion';
import { ENGAGEMENT_PHASES } from '../constants/solutions-data';

const EngagementModel = () => {
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
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-['Inter',sans-serif] text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Engagement <span className="text-cyan-400">Model</span>
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-purple-500/20 to-transparent" />

          <div className="space-y-12 md:space-y-0">
            {ENGAGEMENT_PHASES.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: 'easeOut' }}
                className={`relative md:flex items-start gap-8 md:gap-16 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Spacer for the alternating layout */}
                <div className="hidden md:block w-1/2" />

                {/* Connector dot (desktop) */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 rounded-full bg-[#0E0E0E] border-2 border-cyan-500/30 items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>

                {/* Content card */}
                <div
                  className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}
                >
                  <div className="bg-[#0E0E0E] border border-[#222] hover:border-cyan-500/20 rounded-2xl p-8 transition-all duration-500 group">
                    {/* Phase badge + duration */}
                    <div className={`flex items-center gap-3 mb-4 ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <span className="font-['JetBrains_Mono',monospace] text-[10px] text-cyan-400 uppercase tracking-[0.3em]">
                        {phase.phase}
                      </span>
                      {phase.duration && (
                        <>
                          <span className="text-gray-700">/</span>
                          <span className="font-['JetBrains_Mono',monospace] text-[10px] text-gray-500">
                            ~{phase.duration}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Icon + Title */}
                    <div className={`flex items-center gap-3 mb-4 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <phase.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h3 className="font-['Inter',sans-serif] text-xl font-bold text-white">{phase.title}</h3>
                    </div>

                    <p className={`font-['Inter',sans-serif] text-sm text-gray-400 leading-relaxed mb-6 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                      {phase.description}
                    </p>

                    {/* Deliverables */}
                    <div className={`space-y-2 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                      {phase.deliverables.map((d) => (
                        <div
                          key={d}
                          className={`flex items-center gap-2 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                          <svg
                            className="w-3.5 h-3.5 text-cyan-400 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-['JetBrains_Mono',monospace] text-[11px] text-gray-500">
                            {d}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementModel;
