import React, { useState, useEffect, useCallback } from 'react';
import Hero from '../components/Hero';
import { STATS, NEWS, DEPARTMENTS } from '../constants';
import { Users, GraduationCap, BookOpen, Building2, Calendar, ArrowRight, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { generateDepartmentImage } from '../geminiService';
import { Page } from '../App';

interface HomeProps {
  navigate: (page: Page, params?: { id: string }) => void;
  departmentImages: { [key: string]: string };
  setDepartmentImages: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const Home: React.FC<HomeProps> = ({ navigate, departmentImages, setDepartmentImages }) => {
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
  const [autoGenerating, setAutoGenerating] = useState(false);

  const handleGenerateImage = useCallback(async (deptId: string, deptName: string) => {
    if (loadingImages[deptId] || departmentImages[deptId]) return;
    
    setLoadingImages(prev => ({ ...prev, [deptId]: true }));
    try {
      const imageUrl = await generateDepartmentImage(deptName);
      if (imageUrl) {
        setDepartmentImages(prev => ({ ...prev, [deptId]: imageUrl }));
      }
    } catch (error) {
      console.error(`Failed to generate image for ${deptName}:`, error);
    } finally {
      setLoadingImages(prev => ({ ...prev, [deptId]: false }));
    }
  }, [loadingImages, departmentImages, setDepartmentImages]);

  // Automatically trigger generation for departments without AI images on mount
  useEffect(() => {
    const missingDepts = DEPARTMENTS.filter(dept => !departmentImages[dept.id]);
    if (missingDepts.length > 0 && !autoGenerating) {
      setAutoGenerating(true);
      
      // Process generation with a slight delay between each to avoid potential rate issues
      // and provide a better visual "staggered" loading effect
      missingDepts.forEach((dept, index) => {
        setTimeout(() => {
          handleGenerateImage(dept.id, dept.name);
        }, index * 800);
      });
    }
  }, []); // Only run once on mount

  const StatIcon = ({ icon }: { icon: string }) => {
    switch (icon) {
      case 'Users': return <Users size={32} className="text-[#ffcc00]" />;
      case 'GraduationCap': return <GraduationCap size={32} className="text-[#ffcc00]" />;
      case 'BookOpen': return <BookOpen size={32} className="text-[#ffcc00]" />;
      case 'Building2': return <Building2 size={32} className="text-[#ffcc00]" />;
      default: return null;
    }
  };

  return (
    <>
      <Hero navigate={navigate} />

      <section className="bg-[#004d2c] py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center text-white">
              <div className="flex justify-center mb-4"><StatIcon icon={stat.icon} /></div>
              <div className="text-4xl font-bold mb-2 tracking-tight">{stat.value}</div>
              <div className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h3 className="text-[#004d2c] font-bold text-sm uppercase tracking-widest mb-3 border-l-4 border-yellow-400 pl-4">University News</h3>
              <h2 className="text-4xl font-black text-slate-900 leading-tight">Announcements & Press</h2>
            </div>
            <button className="flex items-center gap-2 text-[#004d2c] font-bold bg-[#004d2c]/5 px-6 py-3 rounded-full hover:bg-[#004d2c] hover:text-white transition-all">
              View All News <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {NEWS.map((item) => (
              <div key={item.id} className="group bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#004d2c]/5 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    item.category === 'Notice' ? 'bg-blue-100 text-blue-700' : 
                    item.category === 'Event' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Calendar size={14} /> {item.date}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#004d2c] transition-colors leading-snug">{item.title}</h4>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">{item.excerpt}</p>
                <button className="text-sm font-bold flex items-center gap-2 text-[#004d2c] group-hover:gap-3 transition-all">
                  Read Article <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h3 className="text-[#004d2c] font-bold text-sm uppercase tracking-widest mb-4">Academic Excellence</h3>
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Faculties & Research</h2>
            <p className="text-lg text-slate-600 font-medium">Empowering students through cutting-edge technology and a century-old tradition of academic brilliance.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DEPARTMENTS.map((dept) => (
              <div 
                key={dept.id} 
                className="relative overflow-hidden rounded-3xl group cursor-pointer shadow-xl aspect-[3/4] bg-slate-200 border-4 border-white"
                onClick={() => navigate('department-detail', { id: dept.id })}
              >
                <img 
                  src={departmentImages[dept.id] || dept.image} 
                  alt={dept.name} 
                  className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 ease-out ${loadingImages[dept.id] ? 'blur-sm scale-110' : ''}`} 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#004d2c] via-black/20 to-transparent opacity-90 flex flex-col justify-end p-8">
                  <span className="text-xs text-yellow-400 font-black uppercase tracking-widest mb-2 drop-shadow-md">{dept.faculty}</span>
                  <h4 className="text-white font-black text-2xl mb-4 leading-tight">{dept.name}</h4>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateImage(dept.id, dept.name);
                    }}
                    disabled={loadingImages[dept.id] || !!departmentImages[dept.id]}
                    className={`w-full flex items-center justify-center gap-3 backdrop-blur-xl border border-white/40 text-white text-[11px] font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all shadow-xl group/btn ${
                      departmentImages[dept.id] 
                        ? 'bg-[#004d2c]/60 border-[#004d2c]/20' 
                        : 'bg-white/10 hover:bg-white/30'
                    }`}
                  >
                    {loadingImages[dept.id] ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        AI Generating...
                      </>
                    ) : departmentImages[dept.id] ? (
                      <>
                        <CheckCircle size={16} className="text-yellow-400" />
                        AI Enhanced View
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} className="text-yellow-400 group-hover/btn:rotate-12 transition-transform" />
                        AI Campus View
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button 
              onClick={() => navigate('academics')}
              className="group bg-white border-2 border-[#004d2c] text-[#004d2c] px-12 py-4 rounded-full font-black text-lg hover:bg-[#004d2c] hover:text-white transition-all shadow-xl flex items-center gap-3 mx-auto"
            >
              Explore All Faculties <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#004d2c] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_30%_30%,_#fff_0%,_transparent_50%)]"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block bg-yellow-400 text-[#004d2c] px-6 py-2 rounded-full font-black text-sm uppercase tracking-[0.2em] mb-8 shadow-xl">Admissions 2024</div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">Your Future <br/>Begins Here</h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Join a legacy of excellence. Applications for Fall 2024 Semester are now being accepted for all departments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={() => navigate('admissions')}
              className="bg-yellow-400 text-[#004d2c] px-14 py-6 rounded-2xl font-black text-2xl shadow-[0_20px_50px_rgba(255,204,0,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              Apply Online
            </button>
            <button className="bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white px-14 py-6 rounded-2xl font-black text-2xl hover:bg-white/20 transition-all shadow-2xl">
              Prospectus
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;