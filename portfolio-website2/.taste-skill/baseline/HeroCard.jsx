import React from 'react';
import { motion } from 'framer-motion';

const HeroCard = () => {
    const scrollToWork = () => {
        const element = document.getElementById('work-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div
            className="h-full w-full bg-transparent relative overflow-hidden flex flex-col justify-center rounded-2xl"
        >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 animate-gradient-xy opacity-90" />

            <div className="relative z-10 p-4 md:p-8 max-w-3xl">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-mono text-brand-accent text-xs md:text-sm uppercase tracking-[0.4em] font-bold"
                >
                    KennedyAI
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mt-2 mb-2 leading-tight tracking-tight"
                >
                    Akil Bjorn
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-xl md:text-2xl font-bold text-white/90 mb-3"
                >
                    Android & iOS Developer
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-gray-400 text-base md:text-lg mb-6 md:mb-8"
                >
                    Atlanta-based solo developer building Flutter/Firebase apps.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToWork}
                    className="group inline-flex items-center gap-2 bg-brand-accent hover:bg-white text-black font-bold text-sm md:text-lg px-6 py-3 rounded-lg transition-all cursor-pointer"
                >
                    View My Work
                    <svg className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
};

export default HeroCard;
