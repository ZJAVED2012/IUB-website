import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../App';
import { DEPARTMENTS } from '../constants';
import { FacultyMember, ChatMessage, Publication } from '../types';
import { getGeminiResponse, generateFacultyBio } from '../geminiService';
import { 
  ArrowLeft, Mail, Phone, Book, GraduationCap, Users, MapPin, 
  Search, ShieldCheck, Microscope, ListChecks, ArrowRight, 
  Linkedin, Globe, X, ExternalLink, FileText,
  Clock, CheckCircle, Send, Sparkles, Loader2, BookOpen, Quote,
  Presentation, FileDigit, CalendarDays, ScrollText, Award,
  Newspaper, Download, Info, Mic2
} from 'lucide-react';

interface DepartmentDetailProps {
  deptId: string | null;
  navigate: (page: Page) => void;
  departmentImages: { [key: string]: string };
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({ deptId, navigate, departmentImages }) => {
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [facultyChatMessages, setFacultyChatMessages] = useState<ChatMessage[]>([]);
  const [facultyChatInput, setFacultyChatInput] = useState('');
  const [isFacultyChatLoading, setIsFacultyChatLoading] = useState(false);
  const [isBioGenerating, setIsBioGenerating] = useState(false);
  const [generatedBios, setGeneratedBios] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState('overview');
  const facultyChatScrollRef = useRef<HTMLDivElement>(null);

  const department = DEPARTMENTS.find(d => d.id === deptId);

  useEffect(() => {
    if (selectedFaculty) {
      setFacultyChatMessages([
        { role: 'assistant', content: `Hello! I'm the research assistant for ${selectedFaculty.name}. Ask me anything about their academic background, research papers, or expertise!` }
      ]);

      if (!selectedFaculty.bio && !generatedBios[selectedFaculty.name]) {
        handleGenerateBio(selectedFaculty);
      }
    } else {
      setFacultyChatMessages([]);
      setFacultyChatInput('');
      setIsFacultyChatLoading(false);
    }
  }, [selectedFaculty]);

  const handleGenerateBio = async (faculty: FacultyMember) => {
    setIsBioGenerating(true);
    try {
      const bio = await generateFacultyBio(
        faculty.name,
        faculty.designation,
        faculty.qualification,
        faculty.researchInterests || [],
        faculty.publications || []
      );
      if (bio) {
        setGeneratedBios(prev => ({ ...prev, [faculty.name]: bio }));
      }
    } catch (error) {
      console.error("Failed to generate bio:", error);
    } finally {
      setIsBioGenerating(false);
    }
  };

  useEffect(() => {
    if (facultyChatScrollRef.current) {
      facultyChatScrollRef.current.scrollTop = facultyChatScrollRef.current.scrollHeight;
    }
  }, [facultyChatMessages, isFacultyChatLoading]);

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Department Not Found</h2>
          <p className="text-slate-500 mb-8 font-medium">The department you are looking for might have been moved or renamed.</p>
          <button 
            onClick={() => navigate('academics')}
            className="w-full bg-[#004d2c] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#00331d] transition-all"
          >
            <ArrowLeft size={20} /> Browse Academics
          </button>
        </div>
      </div>
    );
  }

  const getFacultyImage = (member: FacultyMember) => {
    if (member.image && member.image.trim() !== '') {
      return member.image;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=004d2c&color=ffffff&size=256&bold=true&font-size=0.33`;
  };

  const handleFacultyChatSend = async () => {
    if (!facultyChatInput.trim() || isFacultyChatLoading || !selectedFaculty) return;

    const userMsg = facultyChatInput.trim();
    setFacultyChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsFacultyChatLoading(true);

    const publicationsText = selectedFaculty.publications?.map(p => 
      typeof p === 'string' ? p : `${p.title}${p.journal ? ` in ${p.journal}` : ''}${p.year ? ` (${p.year})` : ''}`
    ).join('; ');

    const systemInstruction = `You are a research assistant for ${selectedFaculty.name} at IUB. 
    Information about them:
    Designation: ${selectedFaculty.designation}
    Qualification: ${selectedFaculty.qualification}
    Bio: ${selectedFaculty.bio || generatedBios[selectedFaculty.name] || "Academic background is distinguished."}
    Research Interests: ${selectedFaculty.researchInterests?.join(', ') || "Various topics in their field."}
    Selected Publications (Journal): ${publicationsText || "Multiple scholarly articles."}
    Research & Working Papers: ${selectedFaculty.researchPapers?.join('; ') || "Various ongoing research works."}
    Conference Presentations: ${selectedFaculty.conferences?.join('; ') || "Several international presentations."}
    
    Answer questions specifically about this person's work, background, and expertise at IUB. 
    Be professional and scholarly. If asked about things outside their expertise, politely steer the conversation back to their work.`;

    try {
      const response = await getGeminiResponse(userMsg, systemInstruction);
      setFacultyChatMessages(prev => [...prev, { role: 'assistant', content: response || "I'm sorry, I couldn't find specific information on that." }]);
    } catch (err) {
      setFacultyChatMessages(prev => [...prev, { role: 'assistant', content: "I encountered an error accessing the faculty records. Please try again." }]);
    } finally {
      setIsFacultyChatLoading(false);
    }
  };

  const setMessages = (setter: any) => {
    setFacultyChatMessages(setter);
  };

  const deptImage = departmentImages[department.id] || department.image;

  return (
    <div className="bg-slate-50 min-h-screen animate-in fade-in duration-500 pb-24 relative">
      {/* Dynamic Hero Section */}
      <div className="relative h-[500px] md:h-[650px] overflow-hidden">
        <img 
          src={deptImage} 
          alt={department.name} 
          className="w-full h-full object-cover scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#004d2c] via-[#004d2c]/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => navigate('academics')}
              className="text-white/70 hover:text-white flex items-center gap-2 mb-8 font-black uppercase text-xs tracking-[0.2em] transition-all group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Academics
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#004d2c] px-4 py-1.5 rounded-full mb-6 font-black text-xs uppercase tracking-widest shadow-xl">
                  <Info size={14} /> {department.faculty}
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl leading-[0.9]">
                  {department.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-white font-bold text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-2 bg-white/10 px-6 py-4 rounded-3xl backdrop-blur-2xl border border-white/20 shadow-2xl">
                    <Users size={20} className="text-yellow-400" /> 1,200+ Students
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 px-6 py-4 rounded-3xl backdrop-blur-2xl border border-white/20 shadow-2xl">
                    <GraduationCap size={20} className="text-yellow-400" /> 25+ PhD Scholars
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 px-6 py-4 rounded-3xl backdrop-blur-2xl border border-white/20 shadow-2xl">
                    <Award size={20} className="text-yellow-400" /> HEC Tier-1 Ranked
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => navigate('admissions')}
                  className="bg-yellow-400 text-[#004d2c] px-12 py-6 rounded-[2.5rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,204,0,0.3)] flex items-center gap-3"
                >
                  Join Department <ArrowRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-max gap-8 h-16">
            {['overview', 'programs', 'faculty', 'research', 'resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  document.getElementById(tab)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`text-[11px] font-black uppercase tracking-[0.2em] h-full border-b-4 transition-all ${
                  activeTab === tab 
                    ? 'text-[#004d2c] border-[#004d2c]' 
                    : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-12 gap-16">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-24">
          
          {/* Overview Section */}
          <section id="overview" className="scroll-mt-40">
            <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-full blur-3xl -mr-40 -mt-40"></div>
              <div className="flex items-center gap-6 mb-12 relative z-10">
                <div className="w-20 h-20 bg-[#004d2c]/10 rounded-3xl flex items-center justify-center text-[#004d2c] shadow-inner">
                  <Book size={40} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Academic Mission</h2>
                  <p className="text-xs text-[#004d2c] font-black uppercase tracking-[0.3em] mt-1">Foundational Excellence</p>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-3xl text-slate-800 leading-[1.3] font-bold mb-10 tracking-tight">
                  {department.description}
                </p>
                <div className="grid md:grid-cols-2 gap-12 text-slate-500 leading-relaxed font-medium">
                  <p>
                    Our pedagogical approach integrates traditional wisdom with modern scientific advancements. We foster an environment where students are not just learners, but thinkers and innovators capable of leading national and international initiatives.
                  </p>
                  <p>
                    From specialized labs to inter-departmental research clusters, we provide every resource necessary for scholarly growth. Our graduates are highly sought after in the professional market, representing IUB's legacy of brilliance.
                  </p>
                </div>
              </div>

              {/* Departmental Achievements */}
              <div className="mt-20 pt-16 border-t border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-8">
                {[
                  { label: 'Published Papers', value: '850+', color: 'text-blue-600' },
                  { label: 'Alumni Network', value: '12k+', color: 'text-emerald-600' },
                  { label: 'Research Grants', value: '$2.5M', color: 'text-purple-600' }
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <h5 className={`text-3xl font-black mb-1 ${item.color}`}>{item.value}</h5>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Academic Programs Section */}
          <section id="programs" className="scroll-mt-40">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 bg-yellow-400/10 rounded-3xl flex items-center justify-center text-yellow-600 shadow-inner">
                <ListChecks size={40} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Degree Programmes</h2>
                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Pathways to Success</p>
              </div>
            </div>
            <div className="grid gap-8">
              {department.programsOffered?.map((program, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group flex flex-col md:flex-row md:items-center gap-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex flex-shrink-0 items-center justify-center text-[#004d2c] border border-slate-100 group-hover:bg-[#004d2c] group-hover:text-white transition-all duration-500 shadow-sm">
                    <CheckCircle size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <h4 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{program.name}</h4>
                      <div className="flex items-center gap-2 bg-[#004d2c]/5 text-[#004d2c] px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap border border-[#004d2c]/10">
                        <Clock size={14} /> {program.duration}
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed mb-6">
                      {program.description}
                    </p>
                    <div className="flex gap-4">
                       <button onClick={() => navigate('admissions')} className="bg-[#004d2c] text-white px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#00331d] transition-all">Enroll Now</button>
                       <button className="text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-[#004d2c] transition-colors">Download Curriculum</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Academic Faculty section */}
          <section id="faculty" className="scroll-mt-40">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center text-purple-600 shadow-inner">
                  <Users size={40} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">World-Class Faculty</h2>
                  <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Visionary Mentors</p>
                </div>
              </div>
              <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#004d2c] transition-all shadow-xl">
                Faculty Directory
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              {department.facultyMembers?.map((member, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedFaculty(member)}
                  className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group hover:-translate-y-2 flex flex-col gap-8 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-[#004d2c]/5 transition-colors"></div>
                  <div className="flex items-center gap-6 relative z-10">
                    <img 
                      src={getFacultyImage(member)} 
                      alt={member.name} 
                      className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700" 
                    />
                    <div>
                      <h4 className="font-black text-2xl text-slate-900 mb-1 leading-tight">{member.name}</h4>
                      <p className="text-[#004d2c] text-[11px] font-black uppercase tracking-widest mb-3">{member.designation}</p>
                      
                      {/* Direct Professional Links */}
                      <div className="flex items-center gap-2 relative z-20">
                        {member.linkedin && (
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 bg-slate-100 hover:bg-[#0077b5] hover:text-white text-slate-500 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                          >
                            <Linkedin size={10} /> LinkedIn
                          </a>
                        )}
                        {member.website && (
                          <a 
                            href={member.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 bg-slate-100 hover:bg-[#004d2c] hover:text-white text-slate-500 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                          >
                            <Globe size={10} /> Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="h-px w-full bg-slate-100 mb-6"></div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed mb-8 line-clamp-2 italic">"{member.qualification}"</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                         <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-[#004d2c] transition-colors"><Mail size={16} /></div>
                         <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-[#004d2c] transition-colors"><FileText size={16} /></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">Full Academic CV <ArrowRight size={12} /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Research Areas section */}
          <section id="research" className="scroll-mt-40">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner">
                <Microscope size={40} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Research Ecosystem</h2>
                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Driving Innovation</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {department.researchAreas?.map((area, i) => (
                <div key={i} className="group bg-[#004d2c] p-12 rounded-[4rem] text-white relative overflow-hidden flex flex-col justify-between aspect-square md:aspect-auto md:h-72 shadow-2xl hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-yellow-400/20 transition-all duration-1000"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center mb-8 border border-white/20 shadow-xl backdrop-blur-md">
                      <ShieldCheck size={28} />
                    </div>
                    <h4 className="text-3xl font-black mb-4 tracking-tight leading-none">{area}</h4>
                    <p className="text-white/60 text-sm font-medium leading-relaxed">Developing theoretical frameworks and practical solutions for the {area.toLowerCase()} challenges of the future.</p>
                  </div>
                  <button className="mt-8 flex items-center gap-3 text-yellow-400 text-[11px] font-black uppercase tracking-[0.3em] hover:gap-6 transition-all w-fit">
                    Ongoing Projects <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Resources & Facilities section */}
          <section id="resources" className="scroll-mt-40">
             <div className="bg-slate-900 p-16 rounded-[4.5rem] text-white shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="flex items-center gap-6 mb-12 relative z-10">
                  <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-yellow-400 shadow-xl border border-white/10 backdrop-blur-md">
                    <Download size={40} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tight">Academic Resources</h2>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Student Support Hub</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                   {[
                     { title: 'Department Prospectus 2024', size: '12.4 MB', type: 'PDF' },
                     { title: 'Research Lab Guidelines', size: '2.1 MB', type: 'PDF' },
                     { title: 'Course Catalogs (BS/MS)', size: '8.5 MB', type: 'PDF' },
                     { title: 'Scholarship Application Form', size: '1.2 MB', type: 'DOCX' }
                   ].map((res, i) => (
                     <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white group-hover:text-yellow-400 transition-colors">
                           <FileText size={24} />
                        </div>
                        <div className="flex-1">
                           <h5 className="font-bold text-sm mb-1">{res.title}</h5>
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-slate-500 uppercase">{res.type}</span>
                              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                              <span className="text-[10px] font-black text-slate-500 uppercase">{res.size}</span>
                           </div>
                        </div>
                        <Download size={20} className="text-slate-500 group-hover:text-white transition-colors" />
                     </div>
                   ))}
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* HOD Profile Sidebar */}
          <div className="bg-[#004d2c] p-12 rounded-[5rem] text-white shadow-[0_40px_100px_rgba(0,77,44,0.3)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10"></div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow-400/20 rounded-full blur-[80px]"></div>
            
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] mb-12 text-yellow-400 text-center relative z-10">
              Departmental Head
            </h3>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-10">
                <div className="absolute -inset-6 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
                <img 
                  src="https://i.pravatar.cc/200?u=hod-iub" 
                  className="w-48 h-48 rounded-[4rem] object-cover border-8 border-white/20 relative z-10 shadow-2xl scale-100 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-[#004d2c] p-4 rounded-3xl shadow-2xl rotate-12 group-hover:rotate-0 transition-all duration-500">
                  <Award size={28} />
                </div>
              </div>
              <h4 className="text-4xl font-black mb-2 tracking-tighter text-center">{department.headOfDepartment}</h4>
              <p className="text-yellow-400 font-black text-[11px] mb-12 uppercase tracking-[0.3em] text-center bg-white/5 px-6 py-2 rounded-full border border-white/10">Professor & Chairperson</p>
              
              <div className="w-full space-y-4">
                <button className="w-full bg-white text-[#004d2c] py-6 rounded-[3rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-yellow-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">
                  Executive Message
                </button>
                <button className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white py-6 rounded-[3rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white/20 transition-all">
                  Request Appointment
                </button>
              </div>
            </div>
          </div>

          {/* Department News Section */}
          <div className="bg-white p-12 rounded-[5rem] border border-slate-200 shadow-2xl">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                   <Newspaper size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Updates</h3>
             </div>
             
             <div className="space-y-10">
                {[
                  { title: 'New Research Lab Inaugurated', date: 'Oct 24, 2023', type: 'Facility' },
                  { title: 'Annual Industry Workshop Series', date: 'Nov 02, 2023', type: 'Event' },
                  { title: 'PhD Thesis Defenses Scheduled', date: 'Nov 15, 2023', type: 'Academic' }
                ].map((news, i) => (
                  <div key={i} className="group cursor-pointer">
                    <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest block mb-2">{news.type} • {news.date}</span>
                    <h5 className="font-black text-slate-800 leading-tight group-hover:text-[#004d2c] transition-colors">{news.title}</h5>
                  </div>
                ))}
             </div>
             
             <button className="w-full mt-12 py-4 border-2 border-slate-100 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#004d2c] hover:border-[#004d2c] transition-all">
                Browse All Announcements
             </button>
          </div>

          {/* Contact Hub section */}
          <div className="bg-white p-12 rounded-[5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-14 w-16 h-16 bg-yellow-400 rounded-b-[2rem] flex items-center justify-center text-[#004d2c] shadow-xl border-t-0">
              <Phone size={28} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-12 tracking-tight">Direct Connect</h3>
            <div className="space-y-12">
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-[#004d2c] shadow-inner border border-slate-100">
                  <MapPin size={32} />
                </div>
                <div>
                  <h5 className="font-black text-slate-900 text-xs mb-1 uppercase tracking-wider">Office Location</h5>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    Main Academic Block,<br/> 
                    Building B-12, Ground Floor<br/>
                    IUB, Bahawalpur
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-[#004d2c] shadow-inner border border-slate-100">
                  <Mail size={32} />
                </div>
                <div>
                  <h5 className="font-black text-slate-900 text-xs mb-1 uppercase tracking-wider">Departmental Mail</h5>
                  <p className="text-sm text-[#004d2c] font-black tracking-tight underline decoration-dotted decoration-2 underline-offset-4">{department.contactEmail}</p>
                </div>
              </div>
            </div>
            <div className="h-px bg-slate-100 my-12"></div>
            <div className="space-y-4">
               <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-8 text-center">Interested in Applying?</h5>
               <button 
                onClick={() => navigate('admissions')}
                className="w-full bg-[#004d2c] text-white py-8 rounded-[3rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-[#00331d] shadow-2xl active:scale-95 transition-all"
              >
                Apply Online Now
              </button>
              <button className="w-full border-2 border-slate-100 text-slate-400 py-6 rounded-[3rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-50 hover:text-slate-600 transition-all">
                Digital Brochure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Detail Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-[#00331d]/90 backdrop-blur-3xl animate-in fade-in duration-300"
            onClick={() => setSelectedFaculty(null)}
          ></div>
          
          <div className="bg-white w-full max-w-6xl max-h-[92vh] rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row border border-white/20">
            
            {/* Left Content Column */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="p-10 md:p-14 bg-slate-50 border-b border-slate-100 flex justify-between items-start shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/80 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-[#004d2c] to-yellow-400 rounded-[3rem] opacity-20 animate-pulse"></div>
                    <img 
                      src={getFacultyImage(selectedFaculty)} 
                      alt={selectedFaculty.name} 
                      className="w-32 h-32 md:w-44 md:h-44 rounded-[3rem] object-cover border-8 border-white shadow-2xl relative z-10" 
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-none mb-2 tracking-tighter">{selectedFaculty.name}</h3>
                    <div className="flex flex-col items-center md:items-start gap-3">
                       <span className="text-[#004d2c] font-black text-[11px] uppercase tracking-[0.3em] bg-[#004d2c]/5 px-5 py-2 rounded-full border border-[#004d2c]/10">{selectedFaculty.designation}</span>
                       
                       {/* Prominent Profile Links in Modal */}
                       <div className="flex items-center gap-3">
                        {selectedFaculty.linkedin && (
                          <a href={selectedFaculty.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#0077b5] text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-105 transition-transform">
                            <Linkedin size={14} /> Profile
                          </a>
                        )}
                        {selectedFaculty.website && (
                          <a href={selectedFaculty.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#004d2c] text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-105 transition-transform">
                            <Globe size={14} /> Website
                          </a>
                        )}
                        <span className="text-slate-400 font-bold text-xs ml-2">{selectedFaculty.qualification}</span>
                       </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFaculty(null)}
                  className="bg-white p-4 rounded-[1.5rem] shadow-2xl text-slate-400 hover:text-red-500 transition-all hover:scale-110 active:rotate-90 hidden md:block"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Modal Body Scroll Area */}
              <div className="flex-1 overflow-y-auto p-10 md:p-14 space-y-16 custom-scrollbar scroll-smooth">
                {/* Biography Section */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#004d2c]/10 rounded-2xl flex items-center justify-center text-[#004d2c] shadow-inner">
                        <FileText size={24} />
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">Scholarly Profile</h4>
                    </div>
                    {(isBioGenerating || generatedBios[selectedFaculty.name]) && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#004d2c]/5 rounded-2xl border border-[#004d2c]/10 shadow-sm">
                        <Sparkles size={14} className="text-[#004d2c]" />
                        <span className="text-[9px] font-black uppercase text-[#004d2c] tracking-widest">Synthesized by AI Assistant</span>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    {isBioGenerating ? (
                      <div className="flex flex-col gap-4 py-4 animate-pulse">
                        <div className="h-5 bg-slate-100 rounded-full w-full"></div>
                        <div className="h-5 bg-slate-100 rounded-full w-[94%]"></div>
                        <div className="h-5 bg-slate-100 rounded-full w-[98%]"></div>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4">
                          <Loader2 size={16} className="animate-spin" />
                          Indexing Academic Records...
                        </div>
                      </div>
                    ) : (
                      <p className="text-xl text-slate-700 leading-relaxed font-semibold">
                        {selectedFaculty.bio || generatedBios[selectedFaculty.name] || "Detailed scholarly profile for " + selectedFaculty.name + " is being updated within the university portal."}
                      </p>
                    )}
                  </div>
                </section>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-16">
                  {/* Research Focus */}
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-600 shadow-inner">
                        <Microscope size={24} />
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">Primary Research</h4>
                    </div>
                    <div className="grid gap-4">
                      {selectedFaculty.researchInterests?.map((interest, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 text-[13px] font-black text-slate-700 hover:bg-slate-100 transition-colors cursor-default">
                          <div className="w-2.5 h-2.5 bg-[#004d2c] rounded-full shadow-lg shadow-[#004d2c]/20"></div>
                          {interest}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Publications */}
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-[#004d2c]/10 rounded-2xl flex items-center justify-center text-[#004d2c] shadow-inner">
                        <BookOpen size={24} />
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">Peer-Reviewed Works</h4>
                    </div>
                    <div className="space-y-6">
                      {selectedFaculty.publications?.map((pub, i) => {
                        const isStructured = typeof pub !== 'string';
                        const title = isStructured ? (pub as Publication).title : pub as string;
                        const year = isStructured ? (pub as Publication).year : null;
                        const journal = isStructured ? (pub as Publication).journal : null;

                        return (
                          <div key={i} className="group relative bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border-l-8 border-l-[#004d2c]">
                            <div className="flex items-start gap-5">
                              <div className="mt-1 flex-shrink-0">
                                 <ScrollText size={20} className="text-[#004d2c] opacity-20 group-hover:opacity-60 transition-opacity" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[14px] font-black text-slate-900 leading-snug group-hover:text-[#004d2c] transition-colors mb-4">
                                  {title}
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                  {year && (
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black bg-slate-100 text-slate-600 uppercase tracking-widest">
                                      <CalendarDays size={12} /> {year}
                                    </span>
                                  )}
                                  {journal && (
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black bg-[#004d2c]/5 text-[#004d2c] uppercase tracking-widest italic border border-[#004d2c]/10">
                                      {journal}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>

                {/* Conferences & Presentations Section */}
                <section>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                      <Presentation size={24} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">Conferences & Keynote Presentations</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {selectedFaculty.conferences?.map((conf, i) => (
                      <div key={i} className="group relative bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500 border-l-8 border-l-blue-600">
                        <div className="flex items-start gap-5">
                          <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                             <Mic2 size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-black text-slate-800 leading-relaxed mb-4">
                              {conf}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest px-3 py-1 bg-blue-50 rounded-full border border-blue-100">Academic Forum</span>
                              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Oral Presentation</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!selectedFaculty.conferences || selectedFaculty.conferences.length === 0) && (
                      <div className="col-span-full py-16 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <Presentation size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Conference history is being updated.</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Research & Working Papers Section */}
                <section>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                      <FileDigit size={24} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">Research & Working Papers</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {selectedFaculty.researchPapers?.map((paper, i) => (
                      <div key={i} className="group relative bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500 border-l-8 border-l-emerald-500">
                        <div className="flex items-start gap-5">
                          <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                             <ScrollText size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-black text-slate-800 leading-relaxed mb-4">
                              {paper}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">Draft Status</span>
                              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest italic">Research in Progress</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!selectedFaculty.researchPapers || selectedFaculty.researchPapers.length === 0) && (
                      <div className="col-span-full py-16 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <FileDigit size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ongoing research records are being updated.</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Footer section of modal */}
                <div className="pt-16 border-t border-slate-100 flex flex-col sm:flex-row gap-10 items-center justify-between">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8">
                    <div className="flex items-center gap-3 text-slate-400 font-black text-[11px] uppercase tracking-widest">
                      <Mail size={20} className="text-[#004d2c]" /> {selectedFaculty.name.toLowerCase().replace(' ', '.') + "@iub.edu.pk"}
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-[#004d2c] transition-all active:scale-95">
                    Download CV / Dossier
                  </button>
                </div>
              </div>
            </div>

            {/* Right Contextual AI Chat Sidebar */}
            <div className="w-full md:w-[350px] lg:w-[450px] bg-slate-50 border-l border-slate-200 flex flex-col overflow-hidden relative">
              <div className="p-8 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#004d2c] rounded-[1.5rem] flex items-center justify-center text-white shadow-xl">
                    <Sparkles size={28} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 tracking-tight">Academic AI</h4>
                    <p className="text-[10px] text-[#004d2c] font-black uppercase tracking-[0.3em]">Institutional Knowledge Base</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFaculty(null)}
                  className="bg-slate-100 p-3 rounded-2xl text-slate-400 hover:text-red-500 transition-all md:hidden"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Chat History Area */}
              <div 
                ref={facultyChatScrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]"
              >
                {facultyChatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[92%] p-5 rounded-[2rem] text-[13px] font-semibold leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-[#004d2c] text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isFacultyChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white px-6 py-4 rounded-[2rem] shadow-sm border border-slate-100 flex gap-2 items-center">
                      <Loader2 size={16} className="animate-spin text-[#004d2c]" />
                      <span className="text-[10px] font-black text-[#004d2c] uppercase tracking-widest">Consulting Faculty Database...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Area */}
              <div className="p-8 bg-white border-t border-slate-200">
                <div className="relative">
                  <input 
                    type="text"
                    value={facultyChatInput}
                    // Fix: Typo setInput to setFacultyChatInput
                    onChange={(e) => setFacultyChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFacultyChatSend()}
                    placeholder={`Query research regarding Prof. ${selectedFaculty.name.split(' ').pop()}...`}
                    className="w-full pl-6 pr-16 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-[#004d2c]/10 outline-none text-sm font-bold transition-all shadow-inner"
                  />
                  <button 
                    onClick={handleFacultyChatSend}
                    disabled={isFacultyChatLoading || !facultyChatInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#004d2c] text-white rounded-2xl flex items-center justify-center hover:bg-[#00331d] transition-all disabled:opacity-30 disabled:scale-95 active:scale-90 shadow-2xl"
                  >
                    <Send size={22} />
                  </button>
                </div>
                <p className="mt-4 text-[9px] text-slate-400 font-black text-center uppercase tracking-[0.2em]">
                  AI generated response • Data sourced from verified IUB publications
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDetail;