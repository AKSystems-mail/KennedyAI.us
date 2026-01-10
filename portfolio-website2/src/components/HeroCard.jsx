import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiDownload } from 'react-icons/fi';

const HeroCard = () => {
    const roles = ['Kotlin Developer', 'SwiftUI Enthusiast', 'Problem Solver'];
    const [roleIndex, setRoleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % roles.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const scrollToWork = () => {
        const element = document.getElementById('work-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div
            className="h-full w-full bg-transparent relative overflow-hidden flex flex-col justify-center rounded-3xl"
        >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 animate-gradient-xy opacity-90" />

            {/* Dot Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative z-10 max-w-3xl" style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight"
                >
                    KennedyAI - Building apps that turn <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 drop-shadow-lg">
                        friction into flow.
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-lg md:text-2xl text-gray-300 mb-10 h-8 flex flex-wrap items-center gap-2"
                >
                    <span className="font-medium text-white">Android & iOS Developer</span>
                    <span className="text-gray-600 hidden md:inline">|</span>
                    <span className="font-mono text-purple-400 min-w-[200px]">
                        <Typewriter text={roles[roleIndex]} />
                    </span>
                </motion.div>

                <div className="flex flex-wrap gap-8">
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={scrollToWork}
                        className="group text-white font-bold text-lg hover:text-white/80 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        View My Work
                        <svg className="w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.button>

                    <motion.a
                        href="mailto:akil@kennedyai.us"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group text-white font-bold text-lg hover:text-white/80 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <FiMail className="w-5 h-5" />
                        Contact Me
                    </motion.a>

                    <motion.a
                        href="/Akil_Bjorn_developer.pdf"
                        download="Akil_Bjorn_developer.pdf"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group text-white font-bold text-lg hover:text-white/80 transition-all flex items-center gap-2 cursor-pointer"
                        title="Download Resume"
                    >
                        <FiDownload className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                        <span>CV</span>
                    </motion.a>
                </div>
            </div>
        </div>
    );
};

const Typewriter = ({ text }) => {
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout;

        if (isDeleting) {
            if (displayText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayText(prev => prev.slice(0, -1));
                }, 50);
            } else {
                setIsDeleting(false);
            }
        } else {
            if (displayText.length < text.length) {
                timeout = setTimeout(() => {
                    setDisplayText(text.slice(0, displayText.length + 1));
                }, 100);
            } else {

            }
        }

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, text]);

    useEffect(() => {
        setIsDeleting(true);
    }, [text]);

    return (
        <span>
            {displayText}
            <span className="animate-pulse ml-1">_</span>
        </span>
    );
};

export default HeroCard;