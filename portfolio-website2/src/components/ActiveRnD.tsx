import { motion } from 'framer-motion';

interface RnDProject {
  id: string;
  title: string;
  pitch: string;
  status: 'IN_PROGRESS' | 'DESIGN' | 'TESTING' | 'DONE' | 'PAUSED';
  nextUp: string;
  url?: string;
}

const projects: RnDProject[] = [
  {
    id: 'scoutboard',
    title: 'ScoutBoard',
    pitch: 'Job search match tracking. Finds roles that fit your resume and tracks every application from listing to offer.',
    status: 'IN_PROGRESS',
    nextUp: 'Match quality tuning & recruiter outreach',
    url: 'https://scoutboard-io.web.app',
  },
  {
    id: 'run-outside',
    title: 'Run Outside',
    pitch: 'Social fitness platform. Connecting runners through real-world routes, challenges, and community leaderboards.',
    status: 'IN_PROGRESS',
    nextUp: 'Core feed UI & social interactions',
  },
  {
    id: 'new-dope-wars',
    title: 'New Dope Wars',
    pitch: 'Strategy & resource management game. Modern reimagining of the classic drug wars with blockchain fundamentals.',
    status: 'IN_PROGRESS',
    nextUp: 'Core gameplay loop prototype',
  },
];

const statusConfig: Record<RnDProject['status'], { label: string; color: string; dotColor: string }> = {
  IN_PROGRESS: { label: 'IN PROGRESS', color: 'text-brand-accent border-brand-accent/40', dotColor: 'bg-brand-accent' },
  DESIGN: { label: 'DESIGN', color: 'text-blue-400 border-blue-400/40', dotColor: 'bg-blue-400' },
  TESTING: { label: 'TESTING', color: 'text-orange-400 border-orange-400/40', dotColor: 'bg-orange-400' },
  DONE: { label: 'DONE', color: 'text-green-400 border-green-400/40', dotColor: 'bg-green-400' },
  PAUSED: { label: 'PAUSED', color: 'text-gray-500 border-gray-500/40', dotColor: 'bg-gray-500' },
};

const ActiveRnD = () => {
  return (
    <div className="w-full bg-[#081b33] py-20 md:py-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6 md:gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-display font-black text-white tracking-tighter uppercase">
              In <span className="text-brand-accent italic">Progress</span>
            </h2>
          </div>
          <p className="text-gray-400 font-mono text-[10px] md:text-sm uppercase tracking-widest max-w-xs text-right leading-relaxed">
            What I'm building next.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const config = statusConfig[project.status];
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="w-full bg-black/40 border border-white/10 p-4 md:p-5 flex flex-col justify-between h-[260px] md:h-[360px] group hover:border-brand-accent/50 transition-colors"
              >
                <div>
                  {/* Top row: Status badge */}
                  <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div className={`flex items-center gap-2 border ${config.color} px-2.5 py-1 rounded-sm`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                      <span className={`font-mono text-[9px] font-bold uppercase tracking-wider ${config.color.split(' ')[0]}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-3xl font-display font-bold text-white mb-1 md:mb-2 uppercase tracking-tight group-hover:text-brand-accent transition-colors">
                    {project.title}
                  </h3>

                  {/* Pitch */}
                  <p className="text-gray-500 font-mono text-[10px] md:text-xs uppercase leading-relaxed">
                    {project.pitch}
                  </p>
                </div>

                {/* Bottom: NEXT UP + optional view link */}
                <div className="pt-2 md:pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-1 block">Next up</span>
                  <span className="text-xs md:text-sm font-mono text-gray-300">
                    {project.nextUp}
                  </span>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 border border-brand-accent/40 hover:bg-brand-accent hover:text-black text-brand-accent font-bold text-xs uppercase tracking-widest px-4 py-2 rounded transition-colors"
                    >
                      View site ↗
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActiveRnD;
