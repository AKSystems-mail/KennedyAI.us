import React from 'react';
import { motion } from 'framer-motion';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
const AppCard = ({ title, description, imageSrc, iosUrl, androidUrl }) => {
  return (
    <motion.div
      className="group relative col-span-1 md:col-span-1 h-[300px] md:h-auto rounded-3xl overflow-hidden cursor-default bg-slate-900"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image with Scale Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
          backgroundColor: !imageSrc ? '#171717' : undefined
        }}
      >
        {!imageSrc && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black" />
        )}
      </div>
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/90 group-hover:via-black/60 group-hover:to-black transition-colors duration-500" />
      {/* Content Container - UPDATED PADDING HERE */}
      <div className="relative z-10 h-full p-8 flex flex-col justify-between">
        
        {/* Top Spacer */}
        <div className="flex justify-end"></div>
        {/* Bottom Section: Text & Buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-md">
            {title}
          </h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 drop-shadow-sm font-medium">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {iosUrl && (
              <a
                href={iosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] py-2.5 px-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group/btn"
              >
                <FaApple className="w-5 h-5 mb-0.5" />
                <div className="flex flex-col leading-none text-left">
                  <span className="text-[0.6rem] opacity-80 uppercase tracking-wider font-semibold">Download on</span>
                  <span className="text-xs font-bold">App Store</span>
                </div>
              </a>
            )}
            {androidUrl && (
              <a
                href={androidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] py-2.5 px-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group/btn"
              >
                <FaGooglePlay className="w-4 h-4" />
                <div className="flex flex-col leading-none text-left">
                  <span className="text-[0.6rem] opacity-80 uppercase tracking-wider font-semibold">Get it on</span>
                  <span className="text-xs font-bold">Google Play</span>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default AppCard;