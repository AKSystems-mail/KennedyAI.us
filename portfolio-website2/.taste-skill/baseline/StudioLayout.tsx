import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import HeroCard from './HeroCard.jsx';
import FamilyTree from './FamilyTree';
import AppSlab from './AppSlab';
import ActiveRnD from './ActiveRnD';
import TechStack from './TechStack.jsx';

const StudioLayout = () => {
    const [isSharedView, setIsSharedView] = useState(false);
    const treeSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkHash = () => {
            setIsSharedView(window.location.hash.startsWith('#tree='));
        };

        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, []);

    if (isSharedView) {
        return (
            <div className="h-screen w-full bg-brand-black">
                <FamilyTree />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-black text-white selection:bg-brand-accent selection:text-brand-black overflow-x-clip">
            
            {/* 1. HERO SECTION */}
            <section className="w-full relative flex items-start md:items-center justify-center overflow-hidden pt-24 md:pt-0 md:h-screen mb-8 md:mb-0">
                <div className="absolute inset-0 z-0 opacity-40">
                   <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/20 blur-[120px] rounded-full" />
                   <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/10 blur-[120px] rounded-full" />
                </div>
                <div className="w-full max-w-7xl z-10">
                    <HeroCard />
                </div>
            </section>

            {/* 2. TREE JUMP LINK */}
            <div className="flex justify-center py-10 md:py-16 px-4">
                <a
                    href="#tree-sanctuary"
                    className="group inline-flex items-center gap-3 border border-white/20 hover:border-brand-accent bg-white/[0.02] hover:bg-white/[0.05] text-white font-bold text-xs md:text-sm uppercase tracking-widest px-6 py-3 rounded-lg transition-all"
                >
                    Jump to 3D Family Tree Maker
                    <span className="inline-block transition-transform group-hover:translate-y-1 text-brand-accent">↓</span>
                </a>
            </div>

            {/* 3. APP PRODUCTION SECTION */}
            <section id="work-section" className="py-16 md:py-40 px-4 md:px-8">
                <div className="max-w-7xl mx-auto mb-12 md:mb-24">
                   <h2 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter uppercase italic">Products I've <span className="text-brand-accent">Built</span></h2>
                </div>
                
                <AppSlab 
                    title="ArcWriter"
                    description="AI-powered screenplay and script development platform. Structured story building for working screenwriters."
                    imageSrc="/arcwriter.png"
                    iosUrl=""
                    androidUrl=""
                    webUrl="https://arcwriter.us"
                />

                <AppSlab 
                    title="JokeBook Go"
                    description="Your jokes, set lists, and recordings in one place. Designed for the stage, built for the road."
                    imageSrc="/jokebook.png"
                    iosUrl="https://apps.apple.com/us/app/jokebook-go/id6746818787"
                    androidUrl="https://play.google.com/store/apps/details?id=com.jokebook.app&pcampaignid"
                    learnMoreUrl="/jokebook"
                />

                <AppSlab 
                    title="Booked Mic"
                    description="Streamlining open mic list management. Real-time performer rotations and automated sign-ups."
                    imageSrc="/bookedmic.png"
                    iosUrl="https://apps.apple.com/us/app/booked-mic/id6747945654"
                    androidUrl=""
                    learnMoreUrl="/bookedmic"
                />
            </section>

            {/* 3. ACTIVE R&D */}
            <ActiveRnD />

            {/* 4. TREE SANCTUARY SECTION — SCROLL REVEAL */}
            <motion.section
                id="tree-sanctuary"
                ref={treeSectionRef}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-[80vh] md:h-[90vh] w-full relative bg-black group"
            >
                {/* Reveal overlay that fades out */}
                <motion.div
                    initial={{ opacity: 1 }}
                    whileInView={{ opacity: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-b from-transparent via-black/80 to-black"
                />

                <FamilyTree />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="absolute bottom-4 md:bottom-12 right-2 md:right-12 z-20 pointer-events-none text-right"
                >
                    <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Login to save your family tree</p>
                </motion.div>
            </motion.section>

            {/* 5. TECH STACK FOOTER */}
            <footer className="py-16 md:py-32 bg-brand-surface border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <TechStack />
                    <div className="mt-12 md:mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl md:text-4xl font-display font-black tracking-tighter italic">KENNEDYAI</span>
                        </div>
                        <div className="flex gap-6 md:gap-8">
                            <a href="mailto:akil@kennedyai.us" className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-brand-accent transition-colors">Contact</a>
                            <a href="/Akil_Bjorn_developer.pdf" className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-brand-accent transition-colors">Resume</a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default StudioLayout;
