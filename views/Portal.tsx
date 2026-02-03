
import React, { useState } from 'react';
import { LogIn, User, Lock, LayoutDashboard, BookOpen, Clock, Award, Bell } from 'lucide-react';

const Portal: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setLoading(false);
    }, 1500);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-[#004d2c] p-8 text-center text-white">
            <h1 className="text-3xl font-black mb-2 tracking-tighter">MyIUB Portal</h1>
            <p className="text-white/70 text-sm font-medium">Digital University Management System</p>
          </div>
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Registration No.</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="text" placeholder="F23-BSCS-123" className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#004d2c] outline-none transition-all font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Portal Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#004d2c] outline-none transition-all font-bold" />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#004d2c] text-white py-4 rounded-xl font-black text-lg shadow-xl hover:bg-[#00331d] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Clock className="animate-spin" /> : <LogIn size={20} />}
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>
            <div className="mt-8 text-center space-y-4">
              <a href="#" className="text-xs font-bold text-[#004d2c] hover:underline">Forgot password?</a>
              <div className="h-px bg-slate-100 w-full"></div>
              <p className="text-xs text-slate-400 font-medium">Secured by IUB Cyber Division</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6 sticky top-20 h-[calc(100vh-80px)]">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#004d2c] rounded-xl flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-none">Ahmed Raza</h4>
            <span className="text-[10px] text-slate-500 font-bold">BSCS Fall 2023</span>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: BookOpen, label: 'Courses' },
            { icon: Award, label: 'Results' },
            { icon: Bell, label: 'Notices' },
            { icon: Clock, label: 'Attendance' }
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              item.active ? 'bg-[#004d2c] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-[#004d2c]'
            }`}>
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="mt-auto w-full border-2 border-slate-100 text-slate-400 py-3 rounded-xl font-bold hover:border-red-100 hover:text-red-500 transition-all">
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-slate-900">Student Dashboard</h1>
          <div className="flex gap-4">
            <button className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Overall GPA', value: '3.82', icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-100' },
            { label: 'Attendance', value: '94%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Active Courses', value: '06', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule & Recent Results */}
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6">Today's Schedule</h3>
            <div className="space-y-4">
              {[
                { time: '09:00 AM', subject: 'Data Structures', room: 'Lab 04' },
                { time: '11:30 AM', subject: 'Digital Logic Design', room: 'Hall A' },
                { time: '02:00 PM', subject: 'Communication Skills', room: 'Room 202' }
              ].map((cls, i) => (
                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                  <div className="text-sm font-black text-[#004d2c] w-20">{cls.time}</div>
                  <div className="h-10 w-px bg-slate-200"></div>
                  <div className="flex-1">
                    <h5 className="font-bold text-slate-800">{cls.subject}</h5>
                    <p className="text-xs text-slate-400 font-bold">{cls.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#004d2c] rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full"></div>
            <h3 className="text-xl font-black mb-6 relative z-10">Mid-Term Notices</h3>
            <div className="space-y-6 relative z-10">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                <p className="text-xs font-bold text-yellow-400 uppercase mb-1">Important</p>
                <p className="text-sm font-medium">Mid-term examinations start from Monday, 15th Nov 2023. Check datasheet in Downloads.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20 opacity-80">
                <p className="text-xs font-bold text-blue-300 uppercase mb-1">Fee Reminder</p>
                <p className="text-sm font-medium">Please clear your semester dues before examination to avoid roll number slip block.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portal;
