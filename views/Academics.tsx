
import React, { useState } from 'react';
import { Search, Building2, Users, GraduationCap, ChevronRight, Filter } from 'lucide-react';
import { DEPARTMENTS } from '../constants';
import { Page } from '../App';

interface AcademicsProps {
  navigate: (page: Page, params?: { id: string }) => void;
}

const Academics: React.FC<AcademicsProps> = ({ navigate }) => {
  const [query, setQuery] = useState('');

  const filtered = DEPARTMENTS.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) || 
    d.faculty.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-[#004d2c] mb-6 tracking-tighter">Academics & Research</h1>
          <p className="text-xl text-slate-600 max-w-2xl font-medium leading-relaxed">
            Choose from over 120 departments across 14 faculties, all dedicated to excellence in teaching and research.
          </p>
        </header>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text" 
              placeholder="Search by department or faculty name..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#004d2c] outline-none font-medium"
            />
          </div>
          <button className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
            <Filter size={20} /> Filter By Faculty
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map(dept => (
                <div key={dept.id} className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-2xl transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-[#004d2c]/5 rounded-2xl flex items-center justify-center text-[#004d2c]">
                      <Building2 size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-yellow-600 tracking-widest bg-yellow-50 px-3 py-1 rounded-full">Active</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-[#004d2c] transition-colors">{dept.name}</h3>
                  <p className="text-sm font-bold text-slate-500 mb-6">{dept.faculty}</p>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">450+ Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">25 Faculty</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('department-detail', { id: dept.id })}
                    className="w-full bg-[#004d2c] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#00331d] transition-all"
                  >
                    Department Details <ChevronRight size={18} />
                  </button>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                <Search size={48} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">No departments found matching your search.</h3>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-[#004d2c] rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-black mb-6">Quick Contacts</h3>
              <div className="space-y-6">
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <h5 className="font-bold text-yellow-400 text-sm mb-1">Registrar Office</h5>
                  <p className="text-xs opacity-80 leading-relaxed">For official documentation and academic verification requests.</p>
                  <p className="mt-3 font-bold text-sm">registrar@iub.edu.pk</p>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <h5 className="font-bold text-yellow-400 text-sm mb-1">Controller Exams</h5>
                  <p className="text-xs opacity-80 leading-relaxed">For results, degrees, and examination schedule inquiries.</p>
                  <p className="mt-3 font-bold text-sm">+92 62 9250239</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
              <h3 className="text-xl font-black text-slate-900 mb-6">Upcoming Events</h3>
              <div className="space-y-6">
                {[
                  { date: '15 Nov', title: 'Convocation 2023', type: 'Academic' },
                  { date: '22 Nov', title: 'Tech Expo 2023', type: 'Event' },
                  { date: '01 Dec', title: 'Winter Holidays', type: 'Holiday' }
                ].map((ev, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200">
                      <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{ev.date.split(' ')[1]}</span>
                      <span className="text-lg font-black text-[#004d2c] leading-none mt-1">{ev.date.split(' ')[0]}</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{ev.title}</h5>
                      <span className="text-[10px] font-bold text-[#004d2c] uppercase">{ev.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academics;
