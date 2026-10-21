import React from 'react';
import { motion } from 'framer-motion';

const BookedMicPrivacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-400 selection:text-black overflow-x-clip p-8 md:p-16 relative">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        <header className="border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-cyan-400 text-black font-display font-black px-2 py-1 text-2xl -rotate-2 shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
              BM
            </div>
            <span className="font-display font-black text-2xl tracking-tighter uppercase italic text-white">BOOKED <span className="text-cyan-400">MIC</span></span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.4em] font-bold mb-4"
          >
            Protocol // Data_Protection
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic mb-4">Privacy <span className="text-cyan-400">Policy</span></h1>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Last Updated: July 21, 2026</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar / Table of Contents */}
          <div className="hidden md:block col-span-1 border-r border-white/5 pr-8 space-y-4">
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-8">Navigation</div>
            <nav className="flex flex-col gap-4 font-mono text-[10px] uppercase tracking-widest text-gray-500">
              <a href="#intro" className="hover:text-cyan-400 transition-colors">01_Introduction</a>
              <a href="#collection" className="hover:text-cyan-400 transition-colors">02_Data_Collection</a>
              <a href="#usage" className="hover:text-cyan-400 transition-colors">03_Usage_Protocol</a>
              <a href="#security" className="hover:text-cyan-400 transition-colors">04_Security_Matrix</a>
              <a href="#contact" className="hover:text-cyan-400 transition-colors">05_Terminal_Contact</a>
            </nav>
          </div>

          {/* Policy Content */}
          <div className="col-span-1 md:col-span-3 space-y-16">
            
            <section id="intro" className="space-y-6">
              <div className="flex items-center gap-4 opacity-50">
                <span className="font-mono text-[10px] text-cyan-400 font-bold">01</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>
              <h2 className="text-3xl font-display font-bold uppercase tracking-tight italic">Introduction</h2>
              <p className="leading-relaxed text-gray-400 font-medium text-lg">
                Welcome to Booked Mic ("we," "our," or "us"). We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.
              </p>
            </section>

            <section id="collection" className="space-y-6 text-gray-400">
              <div className="flex items-center gap-4 opacity-50">
                <span className="font-mono text-[10px] text-cyan-400 font-bold">02</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>
              <h2 className="text-3xl font-display font-bold uppercase tracking-tight italic text-white">Information We Collect</h2>
              <div className="space-y-8">
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <strong className="text-cyan-400 font-mono text-xs uppercase block mb-2 tracking-widest">Personal Data</strong>
                  <p>We may collect personal information such as your email address if you choose to create an account or contact support.</p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <strong className="text-cyan-400 font-mono text-xs uppercase block mb-2 tracking-widest">Event Data</strong>
                  <p>Open mic events, performer lists, and sign-up information are stored securely to provide the service. Hosts retain ownership of their event configurations.</p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <strong className="text-cyan-400 font-mono text-xs uppercase block mb-2 tracking-widest">Usage Data</strong>
                  <p>We may collect anonymous usage data to help us improve the app's performance and user experience.</p>
                </div>
              </div>
            </section>

            <section id="usage" className="space-y-6">
              <div className="flex items-center gap-4 opacity-50">
                <span className="font-mono text-[10px] text-cyan-400 font-bold">03</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>
              <h2 className="text-3xl font-display font-bold uppercase tracking-tight italic text-white">How We Use Your Information</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Provide and maintain the Booked Mic service",
                  "Manage your account and sync data",
                  "Provide technical customer support",
                  "Improve functionality and features"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-mono text-[10px] text-gray-500 uppercase tracking-widest bg-white/[0.02] p-4 border border-white/5 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="security" className="space-y-6">
              <div className="flex items-center gap-4 opacity-50">
                <span className="font-mono text-[10px] text-cyan-400 font-bold">04</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>
              <h2 className="text-3xl font-display font-bold uppercase tracking-tight italic text-white">Data Security</h2>
              <p className="leading-relaxed text-gray-400 font-medium">
                We implement appropriate technical and organizational security measures to protect your data. However, please be aware that no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section id="contact" className="space-y-6">
              <div className="flex items-center gap-4 opacity-50">
                <span className="font-mono text-[10px] text-cyan-400 font-bold">05</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>
              <h2 className="text-3xl font-display font-bold uppercase tracking-tight italic text-white">Contact Us</h2>
              <div className="p-8 bg-cyan-400/5 border border-cyan-400/20 rounded-3xl">
                <p className="leading-relaxed text-gray-400 font-medium mb-6">
                  If you have any questions about this Privacy Policy, please contact our support terminal:
                </p>
                <a href="mailto:aksystems.mail@gmail.com" className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black font-display font-black text-sm uppercase tracking-widest hover:bg-cyan-400 transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                  Initialize_Contact
                </a>
              </div>
            </section>

          </div>
        </div>

        <footer className="pt-12 border-t border-white/5 mt-24">
            <a href="/bookedmic" className="group flex items-center gap-3 font-mono text-[10px] text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-all">
                <span className="w-12 h-[1px] bg-gray-800 group-hover:w-16 group-hover:bg-cyan-400 transition-all" />
                Return_to_BookedMic
            </a>
        </footer>

      </div>
    </div>
  );
};

export default BookedMicPrivacy;
