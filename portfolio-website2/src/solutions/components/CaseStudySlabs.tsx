import { motion } from 'framer-motion';
import { CASE_STUDIES } from '../constants/solutions-data';

const CaseStudySlabs = () => {
  return (
    <section id="case-studies" className="relative py-24 md:py-20 bg-[#0A0A0A]">
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
            Case Studies
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-['Inter',sans-serif] text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Shipped <span className="text-cyan-400">Projects</span>
          </motion.h2>
        </div>

        {/* Project slabs */}
        <div className="space-y-8 md:space-y-12">
          {CASE_STUDIES.map((study, i) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
              className="group relative bg-[#0E0E0E] border border-[#222] hover:border-cyan-500/20 rounded-2xl overflow-hidden transition-all duration-500"
            >
              {/* Gradient edge */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r ${study.gradient}`}
              />

              <div className="relative z-10 p-8 md:p-10">
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="font-['JetBrains_Mono',monospace] text-[10px] text-cyan-400 uppercase tracking-[0.3em]">
                        Production
                      </span>
                    </div>
                    <h3 className="font-['Inter',sans-serif] text-2xl md:text-4xl font-black text-white tracking-tight">
                      {study.title}
                    </h3>
                    <p className="font-['JetBrains_Mono',monospace] text-sm text-gray-500 mt-1">
                      {study.tagline}
                    </p>
                  </div>

                  {/* Store links */}
                  {study.storeLinks && (
                    <div className="flex gap-3 shrink-0">
                      {study.storeLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-cyan-400 hover:text-black border border-white/10 hover:border-cyan-400 rounded-full font-['JetBrains_Mono',monospace] text-[10px] uppercase tracking-widest transition-all duration-300 text-gray-400"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Three-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8">
                  {/* Problem */}
                  <div>
                    <span className="font-['JetBrains_Mono',monospace] text-[10px] text-red-400 uppercase tracking-[0.3em] block mb-2">
                      Problem
                    </span>
                    <p className="font-['Inter',sans-serif] text-sm text-gray-400 leading-relaxed">
                      {study.problem}
                    </p>
                  </div>

                  {/* Solution */}
                  <div>
                    <span className="font-['JetBrains_Mono',monospace] text-[10px] text-cyan-400 uppercase tracking-[0.3em] block mb-2">
                      Solution
                    </span>
                    <p className="font-['Inter',sans-serif] text-sm text-gray-400 leading-relaxed">
                      {study.solution}
                    </p>
                  </div>

                  {/* Outcome */}
                  <div>
                    <span className="font-['JetBrains_Mono',monospace] text-[10px] text-green-400 uppercase tracking-[0.3em] block mb-2">
                      Outcome
                    </span>
                    <p className="font-['Inter',sans-serif] text-sm text-gray-400 leading-relaxed">
                      {study.outcome}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/5">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-['JetBrains_Mono',monospace] text-[10px] text-gray-600 px-3 py-1.5 border border-white/5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudySlabs;
