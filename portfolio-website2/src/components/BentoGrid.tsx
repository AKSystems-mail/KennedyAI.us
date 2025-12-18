import HeroCard from './HeroCard.jsx';
import SpotifyCard from './SpotifyCard.jsx';
import RoadmapCard from './RoadmapCard.jsx';
import AppCard from './AppCard.jsx';

import TechStack from './TechStack.jsx';

const BentoGrid = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-4 sm:p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(180px,auto)] gap-6 max-w-7xl w-full">

                {/* Card A (Hero): Spans 2 columns and 2 rows */}
                <div className="col-span-1 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl">
                    <HeroCard />
                </div>

                {/* Card for Roadmap - Acts as anchor for "View My Work" */}
                <div id="work-section" className="col-span-1 md:col-span-1 md:row-span-2 bg-slate-900 rounded-3xl p-8">
                    <RoadmapCard />
                </div>

                {/* Middle Left (1x1): JokeBook Go */}
                <AppCard
                    title="JokeBook Go"
                    description="Your jokes, set lists, and recordings in one app instead of all over the place."
                    imageSrc="/jokebook.png"
                    iosUrl="https://apps.apple.com/us/app/jokebook-go/id6746818787"
                    androidUrl="https://play.google.com/store/apps/details?id=com.jokebook.app&pcampaignid"
                />

                {/* Middle Center (1x1): Booked Mic */}
                <AppCard
                    title="Booked Mic"
                    description="Streamlining open mic list management."
                    imageSrc="/bookedmic.png"
                    iosUrl="https://apps.apple.com/us/app/booked-mic/id6747945654"
                />

                {/* Middle Right (1x1): Current Status / Spotify */}
                <div className="col-span-1 md:col-span-1 bg-slate-900 rounded-3xl p-8">
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
