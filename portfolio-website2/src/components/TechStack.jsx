import React from 'react';
import { SiKotlin, SiSwift, SiReact, SiFirebase, SiNodedotjs, SiGoogleplay } from 'react-icons/si';
import { motion } from 'framer-motion';

const techData = [
  {
    Icon: SiKotlin,
    name: 'Kotlin',
    label: 'Primary language for Android Apps',
    color: '#7F52FF', // Purple
  },
  {
    Icon: SiSwift,
    name: 'Swift',
    label: 'Native iOS Development',
    color: '#F05138', // Orange-Red
  },
  {
    Icon: SiReact,
    name: 'React',
    label: 'Web & Cross-platform UI',
    color: '#61DAFB', // Cyan
  },
  {
    Icon: SiFirebase,
    name: 'Firebase',
    label: 'Backend-as-a-Service & Analytics',
    color: '#FFCA28', // Amber/Yellow
  },
  {
    Icon: SiNodedotjs,
    name: 'Node.js',
    label: 'Server-side Logic & APIs',
    color: '#339933', // Green
  },
  {
    Icon: SiGoogleplay,
    name: 'Google Play',
    label: 'App Deployment & Management',
    color: '#00C06D', // Play Greenish
  },
];

// Duplicate data to create seamless loop
const marqueeData = [...techData, ...techData];

const TechStack = () => {
  return (
    <div
      className="col-span-1 md:col-span-3 bg-transparent p-8 flex items-center overflow-hidden relative group"
      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
    >

      {/* Marquee Track */}
      <motion.div
        className="flex gap-16 items-center px-8"
        animate={{ x: "-50%" }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }}
        // Pause on hover for easier interaction
        whileHover={{ animationPlayState: "paused" }}
      >
        {marqueeData.map((tech, index) => (
          <TechItem key={`${tech.name}-${index}`} {...tech} />
        ))}
      </motion.div>
    </div>
  );
};

const TechItem = ({ Icon, name, label, color }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 cursor-help relative min-w-[80px]"
      title={`${name}: ${label}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon
        className="w-14 h-14 transition-all duration-300"
        style={{
          color: isHovered ? color : '#525252', // neutral-600 for grayscale
          filter: isHovered ? 'drop-shadow(0 0 8px rgba(255,255,255,0.1))' : 'none',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}
      />
      <span
        className={`text-sm font-medium transition-colors duration-300 ${isHovered ? 'text-white' : 'text-neutral-500'}`}
      >
        {name}
      </span>
    </div>
  );
};

export default TechStack;
