import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HERO } from '../constants/solutions-data';

interface TypewriterProps {
  suffixes: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

const Typewriter = ({
  suffixes,
  typingSpeed = 60,
  deletingSpeed = 35,
  pauseDuration = 2000,
}: TypewriterProps) => {
  const [text, setText] = useState('');
  const [suffixIndex, setSuffixIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentSuffix = suffixes[suffixIndex];
    if (!isDeleting) {
      if (text.length < currentSuffix.length) {
        setText(currentSuffix.slice(0, text.length + 1));
        return;
      }
      setTimeout(() => setIsDeleting(true), pauseDuration);
      return;
    }
    if (text.length > 0) {
      setText(text.slice(0, -1));
      return;
    }
    setIsDeleting(false);
    setSuffixIndex((i) => (i + 1) % suffixes.length);
  }, [text, suffixIndex, isDeleting, suffixes, pauseDuration]);

  useEffect(() => {
    const timer = setTimeout(
      tick,
      isDeleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(timer);
  }, [tick, isDeleting, deletingSpeed, typingSpeed]);

  const displayText = text.replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span>
      {displayText}
      <span className="inline-block w-[2px] h-[0.85em] bg-cyan-400 ml-1 animate-pulse align-middle" />
    </span>
  );
};

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-24 flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-cyan-400/5 blur-[120px] rounded-full" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6"
        >
          <span className="font-['JetBrains_Mono',monospace] text-[10px] md:text-xs text-cyan-400 uppercase tracking-[0.4em]">
            Full-Stack Developer / Available for Hire
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="font-['Inter',sans-serif] text-3xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight h-[120px] sm:h-[140px] md:h-[260px] flex flex-col items-center"
          style={{ marginBottom: '32px' }}
        >
          <span className="shrink-0 leading-none">I Build</span>
          <span className="text-cyan-400 leading-none">
            <Typewriter suffixes={HERO.headlineSuffixes} />
          </span>
        </motion.h1>

        {/* Subheadline - static */}
        <p className="text-gray-400 font-['Inter',sans-serif] text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12">
          {HERO.subheadline}
        </p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={HERO.ctaPrimary.href}
            className="group relative inline-flex items-center gap-3 bg-cyan-400 hover:bg-white text-black px-10 py-4 font-['Inter',sans-serif] font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_30px_rgba(0,242,255,0.3)] hover:shadow-[0_0_50px_rgba(0,242,255,0.5)] hover:scale-105"
          >
            {/* Corner brackets */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-300 group-hover:border-black transition-colors duration-300" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-300 group-hover:border-black transition-colors duration-300" />
            <span>{HERO.ctaPrimary.label}</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </a>

          <a
            href={HERO.ctaSecondary.href}
            className="relative inline-flex items-center gap-2 text-gray-400 hover:text-white px-8 py-4 font-['JetBrains_Mono',monospace] text-xs uppercase tracking-widest transition-all duration-300 border border-white/10 hover:border-cyan-400/50"
          >
            {/* Underline accent */}
            <span className="absolute bottom-0 left-0 h-[2px] bg-cyan-400 w-0 group-hover:w-full transition-all duration-500 ease-out" />
            <span>{HERO.ctaSecondary.label}</span>
            <svg className="w-3 h-3 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </motion.div>

        {/* Availability indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-['JetBrains_Mono',monospace] text-[10px] text-green-400 uppercase tracking-[0.3em]">
            Available for Q3-Q4 2026 Projects
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
