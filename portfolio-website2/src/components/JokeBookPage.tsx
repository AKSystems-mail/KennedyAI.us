import React from 'react';
import { motion } from 'framer-motion';
import { FaPenFancy, FaMicrophoneAlt, FaLayerGroup, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const JokeBookPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-50 text-gray-900 font-sans selection:bg-amber-300">
      {/* Navbar / Header */}
      <nav className="w-full py-6 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <span className="bg-amber-400 text-black px-1.5 py-0.5 rounded shadow-sm -rotate-2 text-lg">JB</span>
          <span>JOKE BOOK</span>
        </div>
        <a href="/" className="text-sm font-semibold hover:text-amber-600 transition-colors">
          Back to Portfolio
        </a>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-32 md:pt-20 md:pb-48 flex flex-col md:flex-row items-center gap-12">
        
        {/* Text Content */}
        <div className="flex-1 space-y-8 text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
          >
            Your comedy, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              organized.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed"
          >
            The personal notebook for writing, organizing, and recording your comedy material.
          </motion.p>
        </div>

        {/* Hero Image / Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 relative flex justify-center"
        >
            <div className="relative z-10 rotate-2 max-w-[70%] drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)]">
                <img 
                    src="/jokebook.png" 
                    alt="JokeBook App Interface" 
                    className="rounded-lg w-full h-auto object-cover"
                />
            </div>
            {/* Decorative blobs */}
            <div className="absolute top-0 right-10 w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-0 left-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </motion.div>

      </main>

      {/* Features Grid */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<FaPenFancy />} 
              title="Write Anywhere" 
              description="Capture ideas instantly. The clean interface lets you focus on the punchline."
            />
            <FeatureCard 
              icon={<FaLayerGroup />} 
              title="Organize Sets" 
              description="Group jokes into bits and sets. Drag and drop to perfect your flow."
            />
            <FeatureCard 
              icon={<FaMicrophoneAlt />} 
              title="Set Recording" 
              description="Record your sets and play them back to analyze your timing and delivery."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm">
            &copy; 2025 AKSystems. All rights reserved.
          </div>
          <div className="flex gap-8 text-lg font-semibold text-gray-700">
             <a href="mailto:aksystems.mail@gmail.com" className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                <FaEnvelope /> Contact Support
             </a>
             <a href="/jokebook/privacy" className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                <FaShieldAlt /> Privacy Policy
             </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl hover:bg-amber-50 transition-colors duration-300">
    <div className="text-4xl text-amber-500 mb-2">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">
      {description}
    </p>
  </div>
);

export default JokeBookPage;
