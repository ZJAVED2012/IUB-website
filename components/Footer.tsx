
import React from 'react';
import { Twitter, Facebook, Youtube, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { Page } from '../App';

interface FooterProps {
  navigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#00331d] text-slate-300 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex flex-col mb-8 cursor-pointer group" onClick={() => navigate('home')}>
              <div className="flex items-center gap-4 mb-3">
                <img 
                  src="https://www.iub.edu.pk/images/logo.png" 
                  alt="IUB Logo" 
                  className="h-16 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-4xl font-black text-white tracking-tighter leading-none">IUB</span>
              </div>
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] mt-2">Islamia University Bahawalpur</span>
            </div>
            <p className="text-sm leading-relaxed mb-8 font-medium text-slate-400">
              Transforming lives through quality education and research since 1925. One of the largest and oldest public sector universities in Pakistan.
            </p>
            <div className="flex gap-4">
              {[Twitter, Facebook, Youtube, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="bg-white/5 p-3 rounded-xl hover:bg-yellow-400 hover:text-[#004d2c] transition-all duration-300">
                  <Icon size={20}/>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black text-lg mb-8 tracking-tight">University Links</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><button onClick={() => navigate('admissions')} className="hover:text-yellow-400 transition-colors">Admission Portal</button></li>
              <li><button onClick={() => navigate('academics')} className="hover:text-yellow-400 transition-colors">Academic Departments</button></li>
              <li><button onClick={() => navigate('portal')} className="hover:text-yellow-400 transition-colors">Student Portal</button></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Research Projects</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">HEC Quality Assurance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-lg mb-8 tracking-tight">Support</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Scholarship Office</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Job Opportunities</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">IT Support / CMS</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Download Center</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">University Library</a></li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
            <h4 className="text-white font-black text-lg mb-8 tracking-tight">Main Campus</h4>
            <ul className="space-y-6 text-sm font-medium">
              <li className="flex items-start gap-4">
                <MapPin size={24} className="text-yellow-400 flex-shrink-0" />
                <span>Abbasia Campus, Bahawalpur, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={24} className="text-yellow-400 flex-shrink-0" />
                <span>+92 62 9250231</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={24} className="text-yellow-400 flex-shrink-0" />
                <span>info@iub.edu.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
          <p>© 2024 The Islamia University of Bahawalpur. All Rights Reserved.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">HEC Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
