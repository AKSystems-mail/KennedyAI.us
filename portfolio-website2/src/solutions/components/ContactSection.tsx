import { motion } from 'framer-motion';

const ContactSection = () => {
  return (
    <section className="relative py-24 md:py-20 bg-[#0A0A0A]">
      {/* Background blob */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-left">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-['JetBrains_Mono',monospace] text-[10px] md:text-xs text-cyan-400 uppercase tracking-[0.4em] block mb-4"
        >
          Get in Touch
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-['Inter',sans-serif] text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight mb-6"
        >
          Ready to <span className="text-cyan-400">Build?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-['Inter',sans-serif] text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed mb-12"
        >
          Tell me about your project. I&apos;ll respond within 24 hours with a
          scope estimate, timeline, and next steps.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-start justify-start gap-4"
        >
          <a
            href="mailto:akil@kennedyai.us"
            className="group inline-flex items-center gap-3 bg-cyan-400 hover:bg-white text-black px-10 py-4 font-['Inter',sans-serif] font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_30px_rgba(0,242,255,0.3)] hover:shadow-[0_0_50px_rgba(0,242,255,0.5)] hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Send a Message</span>
          </a>

          <a
            href="https://calendly.com/kennedyai/discovery-call"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white px-8 py-4 font-['JetBrains_Mono',monospace] text-xs uppercase tracking-widest transition-all duration-300 border border-white/10 hover:border-cyan-400/50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Book a Call</span>
          </a>
        </motion.div>

        {/* Availability */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center justify-start gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-['JetBrains_Mono',monospace] text-[10px] text-green-400 uppercase tracking-[0.3em]">
            Currently accepting new projects
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
