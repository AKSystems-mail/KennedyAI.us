import React from 'react';
import { motion } from 'framer-motion';
import { FaMicrophoneAlt, FaListUl, FaQrcode, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const BookedMicPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-400 selection:text-black overflow-x-clip">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 w-full py-8 px-8 flex justify-between items-center max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-400 text-black font-display font-black px-2 py-1 text-2xl -rotate-2 shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
            BM
          </div>
          <span className="font-display font-black text-2xl tracking-tighter uppercase italic text-white">BOOKED <span className="text-cyan-400">MIC</span></span>
        </div>
        <a href="/" className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all">
          <span className="w-8 h-[1px] bg-gray-800 group-hover:w-12 group-hover:bg-cyan-400 transition-all" />
          Back to Portfolio
        </a>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-40 flex flex-col items-center">
        
        <div className="flex flex-col md:flex-row items-center gap-20">
          {/* Text Content */}
          <div className="flex-1 space-y-10 text-center md:text-left relative z-20">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-9xl font-display font-black tracking-tighter leading-[0.85] uppercase"
            >
              Open mic, <br />
              <span className="text-cyan-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">streamlined.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-400 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium"
            >
              Real-time performer notifications and automated sign-ups for open mic nights.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center md:justify-start gap-6"
            >
              <div className="flex flex-col justify-center border-l-2 border-cyan-400 pl-6">
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">Status</span>
                <span className="text-sm font-bold text-white uppercase tracking-tight">Available on iOS</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 relative flex justify-center"
          >
              <div className="relative z-10 max-w-[80%] md:max-w-md shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 rounded-[3rem] overflow-hidden">
                  <img 
                      src="/bookedmic.png" 
                      alt="Booked Mic App Interface" 
                      className="w-full h-auto object-cover"
                  />
              </div>
              <div className="absolute top-0 right-10 w-64 h-64 bg-cyan-400/10 rounded-full filter blur-3xl animate-blob"></div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 bg-zinc-950 py-40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-32">
            
            <FeatureSection 
              title="Live Notifications"
              description="Performers sign up and get auto-notified. Hosts control the flow without paper lists."
              icon={<FaListUl />}
              align="left"
            />

            <FeatureSection 
              title="QR Check-In"
              description="Performers scan a QR code to join the list. No app download needed for guests."
              icon={<FaQrcode />}
              align="right"
            />

            <FeatureSection 
              title="Host Dashboard"
              description="Full control panel for hosts: reorder, skip, and manage the night from any device."
              icon={<FaMicrophoneAlt />}
              align="left"
            />

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-24">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white text-black font-display font-black px-2 py-1 text-xl -rotate-2">BM</div>
                <span className="font-display font-black text-3xl tracking-tighter italic uppercase">BOOKEDMIC</span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed font-medium">
                Making open mic nights run themselves. Built by AKSystems so hosts can focus on the stage, not the clipboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-20">
              <div className="flex flex-col gap-6">
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.3em] font-bold">Support</span>
                <a href="mailto:aksystems.mail@gmail.com" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <FaEnvelope className="text-xs" /> Email Support
                </a>
              </div>
              <div className="flex flex-col gap-6">
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.3em] font-bold">Legal</span>
                <a href="/bookedmic/privacy" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <FaShieldAlt className="text-xs" /> Privacy Policy
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">&copy; 2026 KennedyAI Lab // AKSystems. All Rights Reserved</span>
            <div className="flex gap-6">
               <span className="text-[10px] font-mono text-gray-800">ENCRYPTION: ENABLED</span>
               <span className="text-[10px] font-mono text-gray-800">SYSTEM_STATUS: STABLE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  align: 'left' | 'right';
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ title, description, icon, align }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    className={`flex flex-col ${align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24`}
  >
    <div className="flex-1 space-y-6">
      <h3 className="text-5xl md:text-7xl font-display font-black uppercase italic tracking-tighter">{title}</h3>
      <p className="text-xl text-gray-400 leading-relaxed font-medium max-w-xl">{description}</p>
    </div>
    <div className="w-full md:w-[400px] h-[400px] bg-zinc-900 border border-white/5 rounded-[3rem] flex items-center justify-center text-[120px] text-cyan-400/20 shadow-2xl relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent" />
      <motion.div 
        whileHover={{ scale: 1.2, rotate: 10, color: '#22d3ee' }}
        className="relative z-10 transition-colors duration-500"
      >
        {icon}
      </motion.div>
    </div>
  </motion.div>
);

export default BookedMicPage;
