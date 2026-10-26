import React from 'react';
import { motion } from 'framer-motion';

const HeroCard = () => {
    const scrollToWork = () => {
        document.getElementById('work-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full grid md:grid-cols-[1.1fr_0.9fr] items-center gap-10 md:gap-16">
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="text-[clamp(3.2rem,8vw,8rem)] font-display font-black text-white leading-[0.9] tracking-normal uppercase"
                >
                    Akil Bjorn
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
                    className="mt-6 text-2xl md:text-4xl font-bold text-white/90"
                >
                    Android &amp; iOS Developer
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="mt-3 text-base md:text-lg text-white/70 max-w-md"
                >
                    Atlanta-based solo developer building Flutter/Firebase apps.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={scrollToWork}
                    className="mt-8 inline-flex items-center gap-3 bg-brand-accent hover:bg-white text-black font-bold text-base md:text-lg px-8 py-3 rounded-lg cursor-pointer"
                >
                    View My Work
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.button>
            </div>

            {/* One dominant picture: the flagship product's own artwork, cropped wide. */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:block"
            >
                <img
                    src="/arcwriter.png"
                    alt="ArcWriter, the screenplay development platform built at KennedyAI"
                    className="w-full h-[420px] object-cover rounded-2xl"
                />
            </motion.div>
        </div>
    );
};

export default HeroCard;
