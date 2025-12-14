
import React from 'react';
import { SiFirebase, SiKotlin, SiSwift, SiPython, SiReact, SiGoogle } from 'react-icons/si';

const techData = [
  {
    Icon: SiReact,
    label: 'Frontend Framework',
    hoverColor: 'hover:text-blue-500',
    name: 'React',
  },
  {
    Icon: SiFirebase,
    label: 'Backend & DB',
    hoverColor: 'hover:text-yellow-500',
    name: 'Firebase',
  },
  {
    Icon: SiKotlin,
    label: 'Android Development',
    hoverColor: 'hover:text-purple-600',
    name: 'Kotlin',
  },
  {
    Icon: SiSwift,
    label: 'iOS Development',
    hoverColor: 'hover:text-orange-500',
    name: 'Swift',
  },
  {
    Icon: SiPython,
    label: 'Scripting & AI',
    hoverColor: 'hover:text-blue-400',
    name: 'Python',
  },
  {
    Icon: SiGoogle,
    label: 'AI Integration',
    hoverColor: 'hover:text-blue-500',
    name: 'Gemini',
  },
];

const TechStack = () => {
  return (
    <div className="bg-neutral-800 rounded-3xl p-6 w-full h-full flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400">
          {/* Placeholder Icon for Tech Stack */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-100">Interactive Tech Stack</h3>
      </div>
      <div className="flex justify-around items-center h-full">
        {techData.map(({ Icon, label, hoverColor, name }) => (
          <div key={name} className="group relative flex flex-col items-center">
            <Icon className={`w-12 h-12 text-gray-400 transition-colors duration-300 ${hoverColor}`} />
            <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
