
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, FileText, User, GraduationCap, Building } from 'lucide-react';

const Admissions: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    program: '',
    campus: 'Bahawalpur',
    prevSchool: '',
    grade: ''
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="bg-slate-50 py-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#004d2c] mb-4">Undergraduate Admissions</h1>
          <p className="text-slate-600 font-medium">Start your academic journey with IUB. Please complete the form below.</p>
        </header>

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all shadow-lg ${
                step >= s ? 'bg-[#004d2c] text-white' : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              {step > s ? <CheckCircle2 size={24} /> : s}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-3 mb-8">
                <User className="text-[#004d2c]" size={28} />
                <h2 className="text-2xl font-bold text-slate-800">Personal Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004d2c] focus:border-transparent transition-all outline-none" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004d2c] outline-none" placeholder="name@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004d2c] outline-none" placeholder="+92 XXX XXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004d2c] outline-none" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="text-[#004d2c]" size={28} />
                <h2 className="text-2xl font-bold text-slate-800">Academic History</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Previous Institution (HSSC/A-Levels)</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004d2c] outline-none" placeholder="College Name" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Total Marks</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004d2c] outline-none" placeholder="1100" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Obtained Marks</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004d2c] outline-none" placeholder="Enter marks" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-3 mb-8">
                <Building className="text-[#004d2c]" size={28} />
                <h2 className="text-2xl font-bold text-slate-800">Program Selection</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Department</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#004d2c] outline-none appearance-none bg-slate-50">
                    <option>BS Computer Science</option>
                    <option>BS Software Engineering</option>
                    <option>BS Information Technology</option>
                    <option>Pharm-D</option>
                    <option>MBBS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Campus</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Bahawalpur', 'Rahim Yar Khan', 'Bahawalnagar'].map(campus => (
                      <button key={campus} className="p-4 border-2 border-slate-100 rounded-xl font-bold text-slate-600 hover:border-[#004d2c] hover:text-[#004d2c] transition-all">
                        {campus}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Application Ready!</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">Your information has been validated. Clicking submit will create your admission case and send you a confirmation email.</p>
              <button className="bg-[#004d2c] text-white px-12 py-4 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all">
                Submit Application
              </button>
            </div>
          )}

          {step < 4 && (
            <div className="mt-12 flex justify-between border-t border-slate-100 pt-8">
              <button 
                onClick={prevStep} 
                disabled={step === 1}
                className="px-8 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-0"
              >
                Previous Step
              </button>
              <button 
                onClick={nextStep} 
                className="bg-[#004d2c] text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-[#00331d] flex items-center gap-2 transition-all active:scale-95"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="mt-12 bg-yellow-50 rounded-2xl p-6 flex items-center gap-4 border border-yellow-100">
          <div className="bg-yellow-400 p-3 rounded-xl">
            <FileText className="text-[#004d2c]" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#004d2c]">Need help with the form?</h4>
            <p className="text-sm text-yellow-800 font-medium">Contact our admission helpline at +92 62 9250235 or use the AI Assistant.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admissions;
