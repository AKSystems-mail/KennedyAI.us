import { motion } from 'framer-motion';
import { FaApple, FaGooglePlay, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface AppSlabProps {
  title: string;
  description: string;
  imageSrc: string;
  iosUrl: string;
  androidUrl: string;
  webUrl?: string;
  learnMoreUrl?: string;
}

const AppSlab = ({ title, description, imageSrc, iosUrl, androidUrl, webUrl, learnMoreUrl }: AppSlabProps) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="w-full max-w-6xl mx-auto mb-8 md:mb-24 bg-brand-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group"
    >
      
      <div 
        className={`relative z-10 flex flex-col md:flex-row h-full md:h-[420px] ${learnMoreUrl ? 'cursor-pointer' : ''}`}
        onClick={learnMoreUrl ? () => navigate(learnMoreUrl) : undefined}
        role={learnMoreUrl ? 'link' : undefined}
        tabIndex={learnMoreUrl ? 0 : undefined}
        onKeyDown={learnMoreUrl ? (e) => e.key === 'Enter' && navigate(learnMoreUrl) : undefined}
      >
        {/* Info Section */}
        <div className="flex-1 p-6 md:p-16 flex flex-col justify-center">
          <span className="font-mono text-[10px] md:text-xs text-brand-accent uppercase tracking-[0.3em] font-bold mb-4 md:mb-6">Shipped</span>
          
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-4 md:mb-6 tracking-tighter uppercase">
            {title}
          </h3>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

        {/* Visual / Icon Section */}
        <div className="hidden md:flex w-1/3 items-center justify-center p-12">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-56 h-56 object-contain"
          />
        </div>
      </div>

      {/* TACTILE ACTION BARS */}
      <div className="relative z-20 flex border-t border-white/10 h-16 md:h-24">
        {iosUrl && (
          <motion.a
            href={iosUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ backgroundColor: '#fff', color: '#000' }}
            className="flex-1 flex items-center justify-center gap-2 md:gap-4 text-white font-display font-black text-sm md:text-lg uppercase tracking-widest transition-all border-r border-white/10"
          >
            <FaApple className="w-6 h-6 md:w-8 md:h-8" />
            App Store
          </motion.a>
        )}
        {androidUrl && (
          <motion.a
            href={androidUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ backgroundColor: '#facc15', color: '#000' }}
            className="flex-1 flex items-center justify-center gap-2 md:gap-4 text-white font-display font-black text-sm md:text-lg uppercase tracking-widest transition-all"
          >
            <FaGooglePlay className="w-6 h-6 md:w-7 md:h-7" />
            Play Store
          </motion.a>
        )}
        {webUrl && (
          <motion.a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ backgroundColor: '#fff', color: '#000' }}
            className="flex-1 flex items-center justify-center gap-2 md:gap-4 text-white font-display font-black text-sm md:text-lg uppercase tracking-widest transition-all border-r border-white/10"
          >
            <FaGlobe className="w-6 h-6 md:w-7 md:h-7" />
            Try It Live
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

export default AppSlab;
