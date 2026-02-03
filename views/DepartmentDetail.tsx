import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../App';
import { DEPARTMENTS } from '../constants';
import { FacultyMember, ChatMessage, Publication } from '../types';
import { getGeminiResponse, generateFacultyBio } from '../geminiService';
import { 
  ArrowLeft, Mail, Phone, Book, GraduationCap, Users, MapPin, 
  Search, ShieldCheck, Microscope, ListChecks, ArrowRight, 
  Github, Linkedin, Globe, X, ExternalLink, Award, FileText,
  Clock, CheckCircle, Send, Sparkles, Loader2, BookOpen, Quote,
  Presentation, FileDigit, CalendarDays, ScrollText
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
  const facultyChatScrollRef = useRef<HTMLDivElement>(null);

  const department = DEPARTMENTS.find(d => d.id === deptId);

  useEffect(() => {
    if (selectedFaculty) {
      setFacultyChatMessages([
        { role: 'assistant', content: `Hello! I'm the research assistant for ${selectedFaculty.name}. Ask me anything about their academic background, research papers, or expertise!` }
      ]);

      // Check if bio is missing and not already generated
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
    // Professional placeholder using UI-Avatars service with IUB brand colors
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=004d2c&color=ffffff&size=256&bold=true&font-size=0.33`;
  };

  const handleFacultyChatSend = async () => {
    if (!facultyChatInput.trim() || isFacultyChatLoading || !selectedFaculty) return;

    const userMsg = facultyChatInput.trim();
    setFacultyChatInput('');
    setFacultyChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
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

  const deptImage = departmentImages[department.id] || department.image;

  return (
    <div className="bg-slate-50 min-h-screen animate-in fade-in duration-500 pb-24 relative">
      {/* Dynamic Hero Section */}
      <div className="relative h-[450px] md:h-[550px] overflow-hidden">
        <img 
          src={deptImage} 
          alt={department.name} 
          className="w-full h-full object-cover scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#004d2c] via-[#004d2c]/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => navigate('academics')}
              className="text-white/70 hover:text-white flex items-center gap-2 mb-8 font-black uppercase text-xs tracking-[0.2em] transition-all group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Faculties
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <span className="text-yellow-400 font-black text-sm uppercase tracking-[0.3em] mb-4 block drop-shadow-md">
                  {department.faculty}
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl leading-none">
                  {department.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-white font-bold text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-2xl border border-white/20 shadow-2xl">
                    <Users size={18} className="text-yellow-400" /> 1,200+ Students
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-2xl border border-white/20 shadow-2xl">
                    <GraduationCap size={18} className="text-yellow-400" /> 25+ PhD Scholars
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-2xl border border-white/20 shadow-2xl">
                    <ShieldCheck size={18} className="text-yellow-400" /> HEC Level-4
                  </span>
                </div>
              </div>
              <button 
                onClick={() => navigate('admissions')}
                className="bg-yellow-400 text-[#004d2c] px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,204,0,0.3)] flex items-center gap-3"
              >
                Apply Now <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-12 gap-16">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-20">
          
          {/* Detailed About Section */}
          <section className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="flex items-center gap-5 mb-10 relative z-10">
              <div className="w-16 h-16 bg-[#004d2c]/10 rounded-2xl flex items-center justify-center text-[#004d2c] shadow-inner">
                <Book size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mission & Objectives</h2>
                <p className="text-xs text-[#004d2c] font-black uppercase tracking-[0.2em] mt-1">Established 1925</p>
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-2xl text-slate-700 leading-relaxed font-bold mb-8">
                {department.description}
              </p>
              <div className="grid md:grid-cols-2 gap-8 text-slate-500 leading-relaxed font-medium">
                <p>
                  Our curriculum is meticulously designed to align with international standards, ensuring that our graduates are well-equipped to tackle the challenges of a rapidly evolving global landscape. We prioritize experiential learning, critical thinking, and ethical professional conduct.
                </p>
                <p>
                  Through state-of-the-art facilities and a vibrant academic community, we provide an environment that encourages cross-disciplinary collaboration and hands-on research from the undergraduate level upwards.
                </p>
              </div>
            </div>
          </section>

          {/* Academic Programs Section */}
          <section id="programs">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-600 shadow-inner">
                <ListChecks size={32} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Academic Programmes</h2>
                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Foundations of Excellence</p>
              </div>
            </div>
            <div className="grid gap-6">
              {department.programsOffered?.map((program, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all group flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex flex-shrink-0 items-center justify-center text-[#004d2c] border border-slate-100 group-hover:bg-[#004d2c] group-hover:text-white transition-all">
                    <CheckCircle size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <h4 className="text-xl font-black text-slate-900 leading-tight">{program.name}</h4>
                      <div className="flex items-center gap-1.5 bg-[#004d2c]/5 text-[#004d2c] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        <Clock size={12} /> {program.duration}
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                  <button onClick={() => navigate('admissions')} className="flex items-center gap-2 text-[#004d2c] font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:translate-x-1">
                    Apply <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Academic Faculty section */}
          <section id="faculty">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                  <Users size={32} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Expert Faculty</h2>
                  <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Learned Scholars & Professionals</p>
                </div>
              </div>
              <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#004d2c] transition-all">
                Full Faculty Directory
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {department.facultyMembers?.map((member, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedFaculty(member)}
                  className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all group hover:-translate-y-2 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left cursor-pointer"
                >
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-[#004d2c] to-yellow-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <img 
                      src={getFacultyImage(member)} 
                      alt={member.name} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl grayscale group-hover:grayscale-0 transition-all duration-500" 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-[#004d2c] p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-2xl text-slate-900 mb-1 leading-none">{member.name}</h4>
                    <p className="text-[#004d2c] text-sm font-black mb-3 uppercase tracking-widest">{member.designation}</p>
                    
                    {/* Faculty Professional Links */}
                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                      {member.linkedin && (
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0077b5] transition-colors group/link"
                        >
                          <Linkedin size={14} /> 
                          <span className="hidden sm:inline opacity-0 group-hover/link:opacity-100 transition-opacity">LinkedIn</span>
                        </a>
                      )}
                      {member.website && (
                        <a 
                          href={member.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#004d2c] transition-colors group/link"
                        >
                          <Globe size={14} /> 
                          <span className="hidden sm:inline opacity-0 group-hover/link:opacity-100 transition-opacity">Portfolio</span>
                        </a>
                      )}
                      {!member.linkedin && !member.website && (
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">IUB Faculty Portal</span>
                      )}
                    </div>

                    <div className="h-px w-12 bg-slate-100 mb-4 mx-auto md:mx-0"></div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6 line-clamp-2">{member.qualification}</p>
                    <div className="flex justify-center md:justify-start gap-3">
                      <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-[#004d2c] hover:bg-[#004d2c]/5 transition-all"><Mail size={16} /></button>
                      <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-[#004d2c] hover:bg-[#004d2c]/5 transition-all"><FileText size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Research Areas section */}
          <section id="research">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <Microscope size={32} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Research Ecosystem</h2>
                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Innovation & Discovery</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {department.researchAreas?.map((area, i) => (
                <div key={i} className="group bg-[#004d2c] p-10 rounded-[3rem] text-white relative overflow-hidden flex flex-col justify-between aspect-square md:aspect-auto md:h-64 shadow-2xl">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl group-hover:bg-yellow-400/20 transition-all duration-700"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="text-2xl font-black mb-3 tracking-tight leading-tight">{area}</h4>
                    <p className="text-white/60 text-sm font-medium leading-relaxed">Pioneering next-generation studies and contributing to the global body of knowledge.</p>
                  </div>
                  <button className="mt-8 flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-[0.2em] hover:gap-4 transition-all w-fit">
                    Explore Projects <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* Head Message Sidebar */}
          <div className="bg-[#004d2c] p-12 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-yellow-400 text-center">
              Chairperson's Office
            </h3>
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-10">
                <div className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
                <img src="https://i.pravatar.cc/150?u=hod" className="w-40 h-40 rounded-[3.5rem] object-cover border-4 border-white/20 relative z-10 shadow-2xl" />
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-[#004d2c] p-3 rounded-2xl shadow-xl">
                  <Mail size={20} />
                </div>
              </div>
              <h4 className="text-3xl font-black mb-2 tracking-tight text-center">{department.headOfDepartment}</h4>
              <p className="text-yellow-400 font-black text-xs mb-12 uppercase tracking-[0.3em] text-center">Professor & Chairman</p>
              
              <div className="w-full space-y-4">
                <button className="w-full bg-white text-[#004d2c] py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                  Read Welcome Message
                </button>
                <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>

          {/* Contact Hub section */}
          <div className="bg-white p-12 rounded-[4.5rem] border border-slate-200 shadow-2xl relative">
            <div className="absolute top-0 right-12 w-12 h-12 bg-yellow-400 rounded-b-3xl flex items-center justify-center text-[#004d2c] shadow-lg">
              <Phone size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-12 tracking-tight">Direct Connect</h3>
            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#004d2c] shadow-inner border border-slate-100">
                  <MapPin size={28} />
                </div>
                <div>
                  <h5 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-wider">Our Location</h5>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    Admin Block C, Suite 204-B,<br/> 
                    Abbasia Campus, IUB, Bahawalpur
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#004d2c] shadow-inner border border-slate-100">
                  <Mail size={28} />
                </div>
                <div>
                  <h5 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-wider">Inquiry Email</h5>
                  <p className="text-sm text-[#004d2c] font-black tracking-tight">{department.contactEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#004d2c] shadow-inner border border-slate-100">
                  <Phone size={28} />
                </div>
                <div>
                  <h5 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-wider">Helpline</h5>
                  <p className="text-sm text-slate-700 font-black">{department.contactPhone}</p>
                </div>
              </div>
            </div>
            <div className="h-px bg-slate-100 my-12"></div>
            <div className="space-y-4">
               <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-center">Interested in Joining?</h5>
               <button 
                onClick={() => navigate('admissions')}
                className="w-full bg-[#004d2c] text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-[#00331d] shadow-2xl active:scale-95 transition-all"
              >
                Apply for Admission
              </button>
              <button className="w-full border-2 border-slate-100 text-slate-400 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-slate-600 transition-all">
                Download Brochure
              </button>
            </div>
          </div>
          
          {/* Programs Mini List - Re-styled for better visibility */}
          <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-bl-full"></div>
             <div className="flex items-center gap-4 mb-8">
                <ListChecks className="text-yellow-400" size={24} />
                <h3 className="text-xl font-black">All Programmes</h3>
             </div>
             <div className="space-y-3 relative z-10">
                {department.programsOffered?.map((p, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                       const el = document.getElementById('programs');
                       el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 cursor-pointer transition-all group"
                  >
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform"></span>
                    {p.name}
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>

      {/* Faculty Detail Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-[#00331d]/90 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setSelectedFaculty(null)}
          ></div>
          
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row">
            
            {/* Left Content Column */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="p-8 md:p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-start shrink-0">
                <div className="flex gap-8 items-center">
                  <img 
                    src={getFacultyImage(selectedFaculty)} 
                    alt={selectedFaculty.name} 
                    className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-4 border-white shadow-xl" 
                  />
                  <div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-none mb-2">{selectedFaculty.name}</h3>
                    <p className="text-[#004d2c] font-black text-sm uppercase tracking-widest">{selectedFaculty.designation}</p>
                    <p className="text-xs text-slate-400 font-bold mt-2">{selectedFaculty.qualification}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFaculty(null)}
                  className="bg-white p-3 rounded-2xl shadow-lg text-slate-400 hover:text-red-500 transition-all hover:scale-110 md:hidden"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body Scroll Area */}
              <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-12 custom-scrollbar">
                {/* Biography Section */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#004d2c]/10 rounded-xl flex items-center justify-center text-[#004d2c]">
                        <FileText size={20} />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">Academic Biography</h4>
                    </div>
                    {(isBioGenerating || generatedBios[selectedFaculty.name]) && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#004d2c]/5 rounded-full border border-[#004d2c]/10">
                        <Sparkles size={14} className="text-[#004d2c]" />
                        <span className="text-[10px] font-black uppercase text-[#004d2c] tracking-widest">AI Enhanced</span>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    {isBioGenerating ? (
                      <div className="flex flex-col gap-3 py-4 animate-pulse">
                        <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                        <div className="h-4 bg-slate-100 rounded-full w-[90%]"></div>
                        <div className="h-4 bg-slate-100 rounded-full w-[95%]"></div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mt-2">
                          <Loader2 size={14} className="animate-spin" />
                          Curating academic record...
                        </div>
                      </div>
                    ) : (
                      <p className="text-lg text-slate-600 leading-relaxed font-medium">
                        {selectedFaculty.bio || generatedBios[selectedFaculty.name] || "Academic biography details are being updated. Dr. " + selectedFaculty.name.split(' ').pop() + " has a distinguished career in research and teaching."}
                      </p>
                    )}
                  </div>
                </section>

                {/* Research Interests & Publications Grid */}
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Interests */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-600">
                        <Microscope size={20} />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">Research Focus</h4>
                    </div>
                    <div className="space-y-3">
                      {selectedFaculty.researchInterests?.map((interest, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700">
                          <div className="w-2 h-2 bg-[#004d2c] rounded-full"></div>
                          {interest}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Publications & Papers Section */}
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-[#004d2c]/10 rounded-xl flex items-center justify-center text-[#004d2c] shadow-sm">
                        <BookOpen size={20} />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">Selected Publications (Journal)</h4>
                    </div>
                    <div className="space-y-6 mb-12">
                      {selectedFaculty.publications?.map((pub, i) => {
                        const isStructured = typeof pub !== 'string';
                        const title = isStructured ? (pub as Publication).title : pub as string;
                        const year = isStructured ? (pub as Publication).year : null;
                        const journal = isStructured ? (pub as Publication).journal : null;
                        const link = isStructured ? (pub as Publication).link : null;

                        return (
                          <div key={i} className="group relative bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-[#004d2c]">
                            <div className="flex items-start gap-4">
                              <div className="mt-1 flex-shrink-0">
                                 <ScrollText size={18} className="text-[#004d2c] opacity-20" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[15px] font-black text-slate-900 leading-snug group-hover:text-[#004d2c] transition-colors mb-3">
                                  {title}
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-3">
                                  {year && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-100 text-slate-600 uppercase tracking-widest">
                                      <CalendarDays size={12} /> {year}
                                    </span>
                                  )}
                                  {journal && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-[#004d2c]/5 text-[#004d2c] uppercase tracking-widest italic border border-[#004d2c]/10">
                                      {journal}
                                    </span>
                                  )}
                                  {link && (
                                    <a href={link} className="ml-auto text-[10px] font-black text-[#004d2c] hover:underline uppercase tracking-[0.2em] flex items-center gap-1.5 group/btn">
                                      Full Text <ExternalLink size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {(!selectedFaculty.publications || selectedFaculty.publications.length === 0) && (
                        <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                           <BookOpen size={32} className="mx-auto text-slate-200 mb-3" />
                           <p className="text-xs font-bold text-slate-400">Journal publication list is being compiled.</p>
                        </div>
                      )}
                    </div>

                    {/* Research & Working Papers Section */}
                    <div className="flex items-center gap-3 mb-8 mt-12">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                        <FileDigit size={20} />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">Research & Working Papers</h4>
                    </div>
                    <div className="space-y-6 mb-12">
                      {selectedFaculty.researchPapers?.map((paper, i) => (
                        <div key={i} className="group relative bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-emerald-500">
                          <div className="flex items-start gap-4">
                            <div className="mt-1 flex-shrink-0">
                               <FileDigit size={14} className="text-emerald-500 opacity-20" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-emerald-600 transition-colors mb-3">
                                {paper}
                              </p>
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100">
                                  Research Paper
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-50 text-slate-500 uppercase tracking-widest border border-slate-100">
                                  In Review / Working
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!selectedFaculty.researchPapers || selectedFaculty.researchPapers.length === 0) && (
                        <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                           <FileDigit size={32} className="mx-auto text-slate-200 mb-3" />
                           <p className="text-xs font-bold text-slate-400">Research paper records are being updated.</p>
                        </div>
                      )}
                    </div>

                    {/* Conferences & Presentations */}
                    <div className="flex items-center gap-3 mb-8 mt-12">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                        <Presentation size={20} />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">Conferences & Presentations</h4>
                    </div>
                    <div className="space-y-6">
                      {selectedFaculty.conferences?.map((conf, i) => (
                        <div key={i} className="group relative bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500">
                          <div className="flex items-start gap-4">
                            <div className="mt-1 flex-shrink-0">
                               <Presentation size={14} className="text-blue-500 opacity-20" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors mb-3">
                                {conf}
                              </p>
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-50 text-purple-600 uppercase tracking-widest border border-purple-100">
                                  International
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-50 text-blue-600 uppercase tracking-widest border border-blue-100">
                                  Presentation
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!selectedFaculty.conferences || selectedFaculty.conferences.length === 0) && (
                        <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                           <Presentation size={32} className="mx-auto text-slate-200 mb-3" />
                           <p className="text-xs font-bold text-slate-400">Conference records are being updated.</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Footer Section in Main Area */}
                <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-8 items-center justify-between">
                  <div className="flex gap-8">
                    {selectedFaculty.linkedin && (
                      <a 
                        href={selectedFaculty.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-3 text-slate-400 hover:text-[#0077b5] transition-colors"
                      >
                        <Linkedin size={18} />
                        <span className="text-xs font-bold">LinkedIn Profile</span>
                      </a>
                    )}
                    {selectedFaculty.website && (
                      <a 
                        href={selectedFaculty.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-3 text-slate-400 hover:text-[#004d2c] transition-colors"
                      >
                        <Globe size={18} />
                        <span className="text-xs font-bold">Personal Portfolio</span>
                      </a>
                    )}
                    <div className="flex items-center gap-3 text-slate-400">
                      <Mail size={18} className="text-[#004d2c]" />
                      <span className="text-xs font-bold">{selectedFaculty.name.toLowerCase().replace(' ', '.') + "@iub.edu.pk"}</span>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#004d2c] transition-all">
                    Download CV
                  </button>
                </div>
              </div>
            </div>

            {/* Right Contextual AI Chat Sidebar */}
            <div className="w-full md:w-[350px] lg:w-[400px] bg-slate-50 border-l border-slate-200 flex flex-col overflow-hidden relative">
              <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#004d2c] rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm leading-none mb-1">Research AI</h4>
                    <p className="text-[10px] text-[#004d2c] font-black uppercase tracking-widest">Contextual Assistant</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFaculty(null)}
                  className="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-red-500 transition-all hidden md:block"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat History Area */}
              <div 
                ref={facultyChatScrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]"
              >
                {facultyChatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-4 rounded-[1.5rem] text-xs font-medium leading-relaxed shadow-sm ${
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
                    <div className="bg-white px-4 py-3 rounded-[1.5rem] shadow-sm border border-slate-100 flex gap-1 items-center">
                      <Loader2 size={14} className="animate-spin text-[#004d2c]" />
                      <span className="text-[10px] font-black text-[#004d2c] uppercase tracking-widest">Consulting Faculty Data...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Area */}
              <div className="p-6 bg-white border-t border-slate-200">
                <div className="relative">
                  <input 
                    type="text"
                    value={facultyChatInput}
                    onChange={(e) => setFacultyChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFacultyChatSend()}
                    placeholder={`Ask about ${selectedFaculty.name.split(' ').pop()}'s research...`}
                    className="w-full pl-5 pr-14 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#004d2c] outline-none text-xs font-bold transition-all"
                  />
                  <button 
                    onClick={handleFacultyChatSend}
                    disabled={isFacultyChatLoading || !facultyChatInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#004d2c] text-white rounded-xl flex items-center justify-center hover:bg-[#00331d] transition-all disabled:opacity-30 disabled:scale-95 active:scale-90 shadow-lg"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="mt-3 text-[9px] text-slate-400 font-bold text-center uppercase tracking-widest">
                  AI generates insights based on verified academic records
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