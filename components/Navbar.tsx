
import React, { useState } from 'react';
import { Menu, X, Globe, User } from 'lucide-react';
import { NAVIGATION, COLORS } from '../constants';
import { Page } from '../App';

interface NavbarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (href: string) => {
    const page = href.replace('#/', '') as Page;
    navigate(page || 'home');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-[#004d2c]/10">
      {/* Top Bar */}
      <div className="hidden md:flex bg-[#004d2c] text-white text-[10px] py-1.5 px-8 justify-between items-center font-medium">
        <div className="flex gap-6 uppercase tracking-wider">
          <span className="opacity-80">Official Portal: portals.iub.edu.pk</span>
          <span className="opacity-80">Contact: +92 62 9250235</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 opacity-90"><Globe size={12}/> English</span>
          <button className="hover:text-yellow-400 transition">Alumni</button>
          <button onClick={() => navigate('portal')} className="bg-yellow-400 text-[#004d2c] px-3 py-0.5 rounded font-bold hover:bg-white transition">Faculty Login</button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer gap-4 group" 
            onClick={() => navigate('home')}
          >
            <img 
              src="https://www.iub.edu.pk/images/logo.png" 
              alt="IUB Logo" 
              className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                // Fallback to text if image fails
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#004d2c] tracking-tighter leading-none">IUB</span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-1">Islamia University Bahawalpur</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {NAVIGATION.map((item) => {
              const page = item.href.replace('#/', '') || 'home';
              const isActive = currentPage === page;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNav(item.href)}
                  className={`px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                    isActive 
                      ? 'text-[#004d2c] bg-[#004d2c]/5' 
                      : 'text-slate-600 hover:text-[#004d2c] hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <button 
              onClick={() => navigate('portal')}
              className="flex items-center gap-2 text-slate-700 hover:text-[#004d2c] font-bold text-sm px-4"
            >
              <User size={18} />
              Login
            </button>
            <button 
              onClick={() => navigate('admissions')}
              className="bg-[#004d2c] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#00331d] transition shadow-lg hover:shadow-xl active:scale-95"
            >
              Apply Now
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#004d2c]">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {NAVIGATION.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNav(item.href)}
                className="block w-full text-left text-slate-700 hover:text-[#004d2c] hover:bg-slate-50 px-3 py-4 text-lg font-bold border-b border-slate-50"
              >
                {item.name}
              </button>
            ))}
            <button 
              onClick={() => navigate('portal')}
              className="w-full mt-4 border-2 border-[#004d2c] text-[#004d2c] py-3 rounded-xl font-bold"
            >
              Student Portal
            </button>
            <button 
              onClick={() => navigate('admissions')}
              className="w-full mt-2 bg-[#004d2c] text-white py-4 rounded-xl font-bold shadow-lg"
            >
              Apply Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
