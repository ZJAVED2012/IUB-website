
import React from 'react';
import { ChevronRight, PlayCircle } from 'lucide-react';
import { Page } from '../App';

interface HeroProps {
  navigate: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ navigate }) => {
  return (
    <div className="relative hero-gradient h-[700px] flex items-center text-white overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-md border border-yellow-400/30 px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-yellow-400 font-black text-xs uppercase tracking-[0.2em]">Ranked #1 in Southern Punjab</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl">
            Empowering <br/><span className="text-yellow-400">Generations</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 mb-12 leading-relaxed max-w-2xl font-medium drop-shadow-md">
            A century of academic excellence, research, and cultural heritage. Building leaders for a brighter tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => navigate('admissions')}
              className="bg-yellow-400 text-[#004d2c] px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,204,0,0.3)] flex items-center justify-center gap-3"
            >
              Apply Online <ChevronRight size={24} />
            </button>
            <button 
              onClick={() => navigate('academics')}
              className="bg-white/10 backdrop-blur-md border-2 border-white/40 px-10 py-5 rounded-2xl font-black text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 shadow-2xl"
            >
              <PlayCircle size={24} /> Discover Research
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute bottom-20 right-10 hidden xl:block bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[32px] max-w-md shadow-2xl animate-bounce-slow">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-red-500 w-3 h-3 rounded-full animate-ping"></div>
          <span className="text-xs font-black uppercase tracking-widest text-white">Live Enrollment Alert</span>
        </div>
        <h4 className="font-black text-white mb-2 text-2xl tracking-tight leading-tight">M.Phil & PhD Admissions Open</h4>
        <p className="text-sm text-slate-200 font-medium leading-relaxed mb-6">Submit your research proposal before the deadline on Nov 30th. Multiple scholarships available.</p>
        <button className="w-full bg-white text-[#004d2c] py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl">Details</button>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;
