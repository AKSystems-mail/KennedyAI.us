import { motion, type Variants } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import HeroCard from './HeroCard.jsx';
import Hero from './Hero';
import SpotifyCard from './SpotifyCard.jsx';
import RoadmapCard from './RoadmapCard.jsx';
import AppCard from './AppCard.jsx';
import TechStack from './TechStack.jsx';

const BentoGrid = () => {
    const [isSharedView, setIsSharedView] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    useEffect(() => {
        const checkHash = () => {
            setIsSharedView(window.location.hash.startsWith('#tree='));
        };

        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const heroVariant = {
        hidden: { x: -100, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 50, damping: 14 }
        }
    };

    const sideVariant = {
        hidden: { x: 100, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 50, damping: 14 }
        }
    };

    const bottomVariant = {
        hidden: { y: 100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 50, damping: 14 }
        }
    };

    if (isSharedView) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-0 sm:p-4">
                <div className="w-full max-w-7xl h-screen sm:h-[800px] relative z-10 overflow-hidden rounded-none sm:rounded-3xl border-none sm:border border-white/10 shadow-2xl">
                    <Hero />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen bg-[#0a0a0c] text-white font-sans flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-hidden relative"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="max-w-7xl w-full relative group"
            >
                {/* 
                   UPDATED GRID DEFINITION:
                   md:grid-cols-[1.2fr_1.2fr_0.8fr]
                   This makes the first two columns wider and the last column (Roadmap/Spotify) narrower.
                */}
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_0.8fr] auto-rows-[minmax(180px,auto)] gap-6 relative">

                    {/* HERO */}
                    <GlowCard
                        className="col-span-1 md:col-span-2 md:row-span-2 relative z-20"
                        mousePos={mousePos}
                        variants={heroVariant}
                    >
                        <HeroCard />
                    </GlowCard>

                    {/* ROADMAP - Now narrower due to column def */}
                    <GlowCard
                        id="work-section"
                        className="col-span-1 md:col-span-1 md:row-span-2 z-20"
                        mousePos={mousePos}
                        variants={sideVariant}
                    >
                        <RoadmapCard />
                    </GlowCard>

                    {/* APP 1 */}
                    <GlowCard
                        className="col-span-1 z-20"
                        mousePos={mousePos}
                        variants={bottomVariant}
                    >
                        <AppCard
                            title="JokeBook Go"
                            description="Your jokes, set lists, and recordings in one app instead of all over the place."
                            imageSrc="/jokebook.png"
                            iosUrl="https://apps.apple.com/us/app/jokebook-go/id6746818787"
                            androidUrl="https://play.google.com/store/apps/details?id=com.jokebook.app&pcampaignid"
                        />
                    </GlowCard>

                    {/* APP 2 */}
                    <GlowCard
                        className="col-span-1 z-20"
                        mousePos={mousePos}
                        variants={bottomVariant}
                    >
                        <AppCard
                            title="Booked Mic"
                            description="Streamlining open mic list management."
                            imageSrc="/bookedmic.png"
                            iosUrl="https://apps.apple.com/us/app/booked-mic/id6747945654"
                        />
                    </GlowCard>

                    {/* SPOTIFY - Now narrower due to column def */}
                    <GlowCard
                        className="col-span-1 z-20 shadow-2xl"
                        mousePos={mousePos}
                        variants={bottomVariant}
                    >
                        <SpotifyCard />
                    </GlowCard>

                    {/* 3D FAMILY TREE */}
                    <GlowCard
                        className="col-span-1 md:col-span-3 h-[600px] relative z-10 overflow-hidden"
                        mousePos={mousePos}
                        variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" as const } }
                        }}
                    >
                        <Hero />
                    </GlowCard>

                    {/* TECH STACK */}
                    <GlowCard
                        className="col-span-1 md:col-span-3 z-10"
                        mousePos={mousePos}
                        variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 1.2 } }
                        }}
                    >
                        <TechStack />
                    </GlowCard>

                </div>
            </div>
        </motion.div>
    );
};

// --- GLOW CARD WRAPPER ---
interface GlowCardProps {
    children: React.ReactNode;
    className?: string;
    mousePos: { x: number; y: number };
    variants: Variants;
    id?: string;
}

const GlowCard = ({ children, className, mousePos, variants, id }: GlowCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            id={id}
            ref={cardRef}
            variants={variants}
            className={`relative rounded-3xl group/card ${className}`}
            style={{
                ...({
                    "--mouse-x": `${mousePos.x - (cardRef.current?.offsetLeft || 0)}px`,
                    "--mouse-y": `${mousePos.y - (cardRef.current?.offsetTop || 0)}px`
                } as any)
            }}
        >
            {/* 1. THE GLOW BORDER LAYER */}
            <div
                className="absolute inset-0 z-0 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.4), transparent 40%)`
                }}
            />

            {/* 2. THE CONTENT BACKGROUND - UPDATED VISIBILITY */}
            {/* Changed bg-slate-900 to bg-neutral-900 and added a subtle border so edges are visible */}
            <div className="absolute inset-[1px] bg-neutral-900 border border-white/10 rounded-[23px] z-10" />

            {/* 3. THE ACTUAL CHILDREN */}
            <div className="relative z-20 h-full">
                {children}
            </div>
        </motion.div>
    );
};

export default BentoGrid;