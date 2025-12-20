import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import HeroCard from './HeroCard.jsx';
import Hero from './Hero';
import SpotifyCard from './SpotifyCard.jsx';
import RoadmapCard from './RoadmapCard.jsx';
import AppCard from './AppCard.jsx';
import TechStack from './TechStack.jsx';

const BentoGrid = () => {
    const [isSharedView, setIsSharedView] = useState(false);

    useEffect(() => {
        // Initial check and listener for hash changes
        const checkHash = () => {
            setIsSharedView(window.location.hash.startsWith('#tree='));
        };

        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, []);
    // Animation variant for cards sliding out from "behind" the hero
    const slideOutVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            x: -100, // Move towards Hero (Top-Left)
            y: -100,
        },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            transition: {
                delay: 2 + (i * 0.1), // 2 seconds initial delay + stagger
                duration: 0.8,
                ease: "easeOut" as any,
            }
        })
    };

    if (isSharedView) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 sm:p-4">
                <div className="w-full max-w-7xl h-screen sm:h-[800px] relative z-10 overflow-hidden rounded-none sm:rounded-3xl border-none sm:border border-white/10 shadow-2xl">
                    <Hero />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-4 sm:p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(180px,auto)] gap-6 max-w-7xl w-full">

                {/* Card A (Hero): Spans 2 columns and 2 rows */}
                <div className="col-span-1 md:col-span-2 md:row-span-2 relative z-20">
                    <HeroCard />
                </div>

                {/* Card for Roadmap - Acts as anchor for "View My Work" */}
                {/* ... existing motion components with motion handle ... */}
                <motion.div
                    id="work-section"
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={slideOutVariants}
                    className="col-span-1 md:col-span-1 md:row-span-2 z-10"
                >
                    <RoadmapCard />
                </motion.div>

                {/* Middle Left (1x1): JokeBook Go */}
                <motion.div custom={2} initial="hidden" animate="visible" variants={slideOutVariants} className="z-10">
                    <AppCard
                        title="JokeBook Go"
                        description="Your jokes, set lists, and recordings in one app instead of all over the place."
                        imageSrc="/jokebook.png"
                        iosUrl="https://apps.apple.com/us/app/jokebook-go/id6746818787"
                        androidUrl="https://play.google.com/store/apps/details?id=com.jokebook.app&pcampaignid"
                    />
                </motion.div>

                {/* Middle Center (1x1): Booked Mic */}
                <motion.div custom={3} initial="hidden" animate="visible" variants={slideOutVariants} className="z-10">
                    <AppCard
                        title="Booked Mic"
                        description="Streamlining open mic list management."
                        imageSrc="/bookedmic.png"
                        iosUrl="https://apps.apple.com/us/app/booked-mic/id6747945654"
                    />
                </motion.div>

                {/* Middle Right (1x1): Current Status / Spotify */}
                <motion.div custom={4} initial="hidden" animate="visible" variants={slideOutVariants} className="z-10">
                    <SpotifyCard />
                </motion.div>

                {/* 3D Family Tree (Full Width) */}
                <motion.div
                    custom={5}
                    initial="hidden"
                    animate="visible"
                    variants={slideOutVariants}
                    className="col-span-1 md:col-span-3 h-[600px] relative z-10 overflow-hidden rounded-3xl border border-white/5 shadow-2xl"
                >
                    <Hero />
                </motion.div>

                {/* Bottom (3x1 - Full Width): The Interactive Tech Stack */}
                <motion.div
                    custom={6}
                    initial="hidden"
                    animate="visible"
                    variants={slideOutVariants}
                    className="col-span-1 md:col-span-3 z-10"
                >
                    <TechStack />
                </motion.div>

            </div>
        </div>
    );
};

export default BentoGrid;
