import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroCard from './HeroCard.jsx';
import Hero from './Hero';
import AppSlab from './AppSlab';
import RoadmapDraftingTable from './RoadmapDraftingTable';
import TechStack from './TechStack.jsx';
import SpotifyCard from './SpotifyCard.jsx';
import { FiX } from 'react-icons/fi';
import { SiSpotify } from 'react-icons/si';

const StudioLayout = () => {
    const [isSharedView, setIsSharedView] = useState(false);
    const [showSpotify, setShowSpotify] = useState(false);

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
                <Hero />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-black text-white selection:bg-brand-accent selection:text-brand-black overflow-x-hidden">
            
            {/* 1. HERO SECTION */}
            <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40">
                   <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/20 blur-[120px] rounded-full" />
                   <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/10 blur-[120px] rounded-full" />
                </div>
                <div className="w-full max-w-7xl z-10">
                    <HeroCard />
                </div>
            </section>

            {/* 2. APP PRODUCTION SECTION */}
            <section id="work-section" className="py-32 px-4 md:px-8">
                <div className="max-w-7xl mx-auto mb-24">
                   <span className="font-mono text-xs text-brand-accent uppercase tracking-[0.5em] mb-4 block font-bold">Deployed_Units // 2024-2026</span>
                   <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter uppercase italic">Production <span className="text-brand-accent">Slabs</span></h2>
                </div>
                
                <AppSlab 
                    title="JokeBook Go"
                    description="Your jokes, set lists, and recordings in one place. Designed for the stage, built for the road."
                    imageSrc="/jokebook.png"
                    iosUrl="https://apps.apple.com/us/app/jokebook-go/id6746818787"
                    androidUrl="https://play.google.com/store/apps/details?id=com.jokebook.app&pcampaignid"
                />

                <AppSlab 
                    title="Booked Mic"
                    description="Streamlining open mic list management. Real-time performer rotations and automated sign-ups."
                    imageSrc="/bookedmic.png"
                    iosUrl="https://apps.apple.com/us/app/booked-mic/id6747945654"
                    androidUrl=""
                />
            </section>

            {/* 3. ROADMAP DRAFTING TABLE */}
            <RoadmapDraftingTable />

            {/* 4. TREE SANCTUARY SECTION */}
            <section className="h-[90vh] w-full relative bg-black group">
                <div className="absolute top-12 left-12 z-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-0">
                    <span className="font-mono text-[10px] text-brand-accent uppercase tracking-[0.4em] font-bold">Interactive_Environment // Sanctuary_Mode</span>
                    <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter mt-2">Family Tree <span className="text-brand-accent">Visualizer</span></h2>
                </div>
                <Hero />
                <div className="absolute bottom-12 right-12 z-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-0 text-right">
                    <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Login to save your architectural data</p>
                </div>
            </section>

            {/* 5. TECH STACK FOOTER */}
            <footer className="py-32 bg-brand-surface border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <TechStack />
                    <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-display font-black tracking-tighter italic">KENNEDYAI</span>
                            <span className="h-4 w-[1px] bg-white/20 hidden md:block" />
                            <span className="text-gray-600 font-mono text-[10px] uppercase tracking-widest">Built in the Flow Lab</span>
                        </div>
                        <div className="flex gap-8">
                            <a href="mailto:akil@kennedyai.us" className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-brand-accent transition-colors">Contact_Endpoint</a>
                            <a href="/Akil_Bjorn_developer.pdf" className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-brand-accent transition-colors">Resume_PDF</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* FLOATING SPOTIFY HUD */}
            <div className="fixed bottom-8 left-8 z-50">
                <AnimatePresence>
                    {showSpotify && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute bottom-16 left-0 w-[300px] h-[400px] bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-2 right-2 z-30">
                                <button 
                                    onClick={() => setShowSpotify(false)}
                                    className="p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors"
                                >
                                    <FiX />
                                </button>
                            </div>
                            <SpotifyCard />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <button
                    onClick={() => setShowSpotify(!showSpotify)}
                    className="w-14 h-14 bg-brand-primary/20 hover:bg-brand-primary/40 backdrop-blur-md text-white flex items-center justify-center rounded-full border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all hover:scale-110 group relative"
                >
                    <SiSpotify className="text-2xl opacity-60 group-hover:opacity-100 group-hover:text-[#1DB954] transition-all" />
                    {!showSpotify && (
                         <span className="absolute left-full ml-4 whitespace-nowrap bg-brand-surface border border-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Open_Studio_Mix
                         </span>
                    )}
                </button>
            </div>

        </div>
    );
};

export default StudioLayout;
