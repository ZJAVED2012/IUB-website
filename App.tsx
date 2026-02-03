
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import Home from './views/Home';
import Admissions from './views/Admissions';
import Portal from './views/Portal';
import Academics from './views/Academics';
import DepartmentDetail from './views/DepartmentDetail';
import Footer from './components/Footer';

export type Page = 'home' | 'admissions' | 'academics' | 'portal' | 'research' | 'faculty' | 'department-detail';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [departmentImages, setDepartmentImages] = useState<{ [key: string]: string }>({});

  const navigate = (page: Page, params?: { id: string }) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      if (params?.id) {
        setSelectedDeptId(params.id);
      }
      window.scrollTo(0, 0);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '') as Page;
      if (['home', 'admissions', 'academics', 'portal', 'department-detail'].includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': 
        return <Home navigate={navigate} departmentImages={departmentImages} setDepartmentImages={setDepartmentImages} />;
      case 'admissions': 
        return <Admissions />;
      case 'academics': 
        return <Academics navigate={navigate} />;
      case 'portal': 
        return <Portal />;
      case 'department-detail': 
        return <DepartmentDetail deptId={selectedDeptId} navigate={navigate} departmentImages={departmentImages} />;
      default: 
        return <Home navigate={navigate} departmentImages={departmentImages} setDepartmentImages={setDepartmentImages} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentPage={currentPage} navigate={navigate} />
      
      <main className={`flex-grow transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {renderPage()}
      </main>

      <Footer navigate={navigate} />
      <AIAssistant />
    </div>
  );
};

export default App;
