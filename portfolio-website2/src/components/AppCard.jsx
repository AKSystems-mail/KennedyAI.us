import React from 'react';
import { motion } from 'framer-motion';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
const AppCard = ({ title, description, imageSrc, iosUrl, androidUrl }) => {
  return (
    <motion.div
      className="group relative col-span-1 md:col-span-1 h-[300px] md:h-[380px] rounded-3xl overflow-hidden cursor-default bg-transparent"
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
        {/* Bottom Section: Text & Buttons - ADD px-4 HERE */}
        <div className="flex flex-col items-center text-center gap-3 mt-auto px-4 pb-4">
          <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-md">
            {title}
          </h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 drop-shadow-sm font-medium">
            {description}
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-2">
            {iosUrl && (
              <a
                href={iosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-all flex items-center gap-2 font-bold text-sm cursor-pointer group/link"
              >
                <FaApple className="w-5 h-5 group-hover/link:translate-y-[-1px] transition-transform" />
                iOS
              </a>
            )}
            {androidUrl && (
              <a
                href={androidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-all flex items-center gap-2 font-bold text-sm cursor-pointer group/link"
              >
                <FaGooglePlay className="w-4 h-4 group-hover/link:translate-y-[-1px] transition-transform" />
                Android
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default AppCard;