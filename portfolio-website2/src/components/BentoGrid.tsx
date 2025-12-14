import HeroFamilyTree from './HeroFamilyTree';
import SpotifyCard from './SpotifyCard.jsx';
import RoadmapCard from './RoadmapCard.jsx';
import AppCard from './AppCard.jsx';
import { AiFillAndroid, AiFillApple } from 'react-icons/ai';
import TechStack from './TechStack.jsx';

const BentoGrid = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(180px,auto)] gap-6 max-w-7xl mx-auto p-8">

                {/* Card A (Hero): Spans 2 columns and 2 rows */}
                <div className="col-span-1 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl">
                    <HeroFamilyTree />
                </div>

                {/* Card for Roadmap */}
                <div className="col-span-1 md:col-span-1 md:row-span-2 bg-neutral-900 rounded-3xl p-6">
                    <RoadmapCard />
                </div>

                {/* Middle Left (1x1): Live App (Google Play) */}
                <AppCard
                    title="Secure Note"
                    description="Encrypted local storage."
                    status="live"
                    icon={AiFillAndroid}
                    link="https://play.google.com/store/apps/details?id=com.example.securenote"
                />

                {/* Middle Center (1x1): Beta App (TestFlight) */}
                <AppCard
                    title="Task Flow"
                    description="AI-powered productivity."
                    status="beta"
                    icon={AiFillApple}
                    link="https://testflight.apple.com/join/example"
                />

                {/* Middle Right (1x1): Current Status / Spotify */}
                <div className="col-span-1 md:col-span-1 bg-neutral-900 rounded-3xl p-6">
                    <SpotifyCard />
                </div>

                {/* Bottom (3x1 - Full Width): The Interactive Tech Stack */}
                <div className="col-span-1 md:col-span-3">
                    <TechStack />
                </div>

            </div>
        </div>
    );
};

export default BentoGrid;
