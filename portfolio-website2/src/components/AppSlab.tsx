import { motion } from 'framer-motion';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

interface AppSlabProps {
  title: string;
  description: string;
  imageSrc: string;
  iosUrl: string;
  androidUrl: string;
}

const AppSlab = ({ title, description, imageSrc, iosUrl, androidUrl }: AppSlabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="w-full max-w-6xl mx-auto mb-32 bg-brand-surface border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative group"
    >
      {/* Background Image / Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000"
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      
      <div className="relative z-10 flex flex-col md:flex-row h-full md:h-[500px]">
        {/* Info Section */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="font-mono text-xs text-brand-accent uppercase tracking-[0.3em] font-bold">Production_Module</span>
          </motion.div>
          
          <h3 className="text-4xl md:text-6xl font-display font-black text-white mb-6 tracking-tighter uppercase italic">
            {title}
          </h3>
          <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-12">
            {description}
          </p>
        </div>

        {/* Visual / Icon Section */}
        <div className="hidden md:flex w-1/3 items-center justify-center p-12">
           <div className="relative">
             <img 
               src={imageSrc} 
               alt={title} 
               className="w-64 h-64 object-contain drop-shadow-[0_0_50px_rgba(34,211,238,0.2)] transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700"
             />
             <div className="absolute inset-0 bg-brand-accent/10 blur-3xl rounded-full -z-10" />
           </div>
        </div>
      </div>

      {/* TACTILE ACTION BARS */}
      <div className="relative z-20 flex border-t border-white/10 h-24">
        {iosUrl && (
          <motion.a
            href={iosUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ backgroundColor: '#fff', color: '#000' }}
            className="flex-1 flex items-center justify-center gap-4 text-white font-display font-black text-lg uppercase tracking-widest transition-all border-r border-white/10"
          >
            <FaApple className="w-8 h-8" />
            App Store
          </motion.a>
        )}
        {androidUrl && (
          <motion.a
            href={androidUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ backgroundColor: '#22d3ee', color: '#000' }}
            className="flex-1 flex items-center justify-center gap-4 text-white font-display font-black text-lg uppercase tracking-widest transition-all"
          >
            <FaGooglePlay className="w-7 h-7" />
            Play Store
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

export default AppSlab;
