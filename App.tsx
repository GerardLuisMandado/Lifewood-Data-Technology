
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import AiDataServices from './components/AiDataServices';
import AiProjects from './components/AiProjects';
import AboutUs from './components/AboutUs';
import Offices from './components/Offices';
import TypeA from './components/TypeA';
import TypeB from './components/TypeB';
import TypeC from './components/TypeC';
import Aigc from './components/Aigc';
import Philanthropy from './components/Philanthropy';
import Careers from './components/Careers';
import ContactUsPage from './components/ContactUsPage';
import InternalNews from './components/InternalNews';
import Footer from './components/Footer';
import PartnerLogos from './components/PartnerLogos';
import AiAssistant from './components/AiAssistant';
import HomeInnovationSection from './components/HomeInnovationSection';
import LoginPage from './components/LoginPage';

type Page = 'home' | 'services' | 'projects' | 'about' | 'offices' | 'type-a' | 'type-b' | 'type-c' | 'aigc' | 'philanthropy' | 'careers' | 'contact' | 'internal-news' | 'login';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [displayPage, setDisplayPage] = useState<Page>('home');
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleHashChange = () => {
      const rawHash = window.location.hash;
      const hash = rawHash.replace(/\/+$/, '');
      const path = window.location.pathname.replace(/\/+$/, '');
      if (hash === '#/ai-services') {
        setCurrentPage('services');
        scrollToTop();
      } else if (hash === '#/ai-projects') {
        setCurrentPage('projects');
        scrollToTop();
      } else if (hash === '#/about-us') {
        setCurrentPage('about');
        scrollToTop();
      } else if (hash === '#/offices') {
        setCurrentPage('offices');
        scrollToTop();
      } else if (hash === '#/type-a') {
        setCurrentPage('type-a');
        scrollToTop();
      } else if (hash === '#/type-b') {
        setCurrentPage('type-b');
        scrollToTop();
      } else if (hash === '#/type-c') {
        setCurrentPage('type-c');
        scrollToTop();
      } else if (hash === '#/aigc') {
        setCurrentPage('aigc');
        scrollToTop();
      } else if (hash === '#/philanthropy') {
        setCurrentPage('philanthropy');
        scrollToTop();
      } else if (hash === '#/careers') {
        setCurrentPage('careers');
        scrollToTop();
      } else if (hash === '#/contact') {
        setCurrentPage('contact');
        scrollToTop();
      } else if (hash === '#/internal-news') {
        setCurrentPage('internal-news');
        scrollToTop();
      } else if (hash === '#/login' || hash === '#login' || path === '/login') {
        setCurrentPage('login');
        scrollToTop();
      } else {
        setCurrentPage('home');
        if (hash === '#home' || hash === '' || hash === '#/') scrollToTop();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    
    // Initial check
    handleHashChange();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (currentPage === displayPage) {
      setIsPageVisible(true);
      return;
    }

    setIsPageVisible(false);
    const transitionTimer = window.setTimeout(() => {
      setDisplayPage(currentPage);
      setIsPageVisible(true);
    }, 180);

    return () => window.clearTimeout(transitionTimer);
  }, [currentPage, displayPage]);

  useEffect(() => {
    const root = document.querySelector('main');
    if (!root) return;

    const revealTargets = Array.from(root.querySelectorAll<HTMLElement>('section:not([data-no-reveal]), [data-scroll-reveal]'));
    revealTargets.forEach((el) => {
      el.classList.add('scroll-reveal');
      el.classList.remove('is-visible');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.18) {
            el.classList.add('is-visible');
          } else {
            el.classList.remove('is-visible');
          }
        });
      },
      { threshold: [0, 0.1, 0.18, 0.35], rootMargin: '-6% 0px -12% 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [displayPage]);

  const isLoginPage = displayPage === 'login';

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#D4AF37]/30">
      <Navbar scrolled={scrolled} currentPage={currentPage} />
      
      <main className="flex-grow">
        <div className={`transition-all duration-200 ease-out ${isPageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        {displayPage === 'home' && (
          <>
            <Hero />
            
            {/* About Section */}
            <section id="about" className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                  <span className="text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-4 block">About us</span>
                  <h2 className="text-4xl md:text-5xl font-black text-[#0D4A30] mb-8 leading-tight uppercase tracking-tighter">
                    Transformative Human Intelligence Infrastructure.
                  </h2>
                  <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                    At Lifewood, we bridge the gap between massive data sets and intelligent outcomes. 
                    By connecting local expertise with our global infrastructure, we create opportunities, 
                    empower communities, and drive inclusive growth worldwide.
                  </p>
                  <a href="#/about-us" className="inline-block">
                  <button className="bg-[#0D4A30] hover:bg-[#D4AF37] hover:text-[#0D4A30] text-white px-12 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all transform hover:scale-105 inline-flex items-center gap-2 group shadow-xl">
                    Know us more
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </a>
                </div>

                <StatsSection />
              </div>
            </section>


            <PartnerLogos />
            <HomeInnovationSection />
            {/* Call to Action Section */}
            <section className="py-24 bg-[#012620] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#D4AF37]">
                   <path d="M30 0 L70 0 L100 30 L100 70 L70 100 L30 100 L0 70 L0 30 Z" fill="currentColor" />
                </svg>
              </div>
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">Ready to revolutionize your AI strategy?</h2>
                    <p className="text-slate-300 text-lg mb-10 leading-relaxed font-medium">
                      Join 40+ global centers and thousands of specialists working 24/7 to deliver high-quality 
                      annotation, collection, and verification for the world's leading tech companies.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a href="#/contact" className="inline-block">
                        <button className="bg-[#D4AF37] hover:bg-white text-[#012620] px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all transform hover:scale-105 shadow-2xl">
                          Contact Us
                        </button>
                      </a>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative">
                      <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Tech workspace" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#012620] via-transparent to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {displayPage === 'services' && <div className="pt-20"><AiDataServices /></div>}
        {displayPage === 'projects' && <div className="pt-20"><AiProjects /></div>}
        {displayPage === 'about' && <div className="pt-20"><AboutUs /></div>}
        {displayPage === 'offices' && <div className="pt-20"><Offices /></div>}
        {displayPage === 'type-a' && <div className="pt-20"><TypeA /></div>}
        {displayPage === 'type-b' && <div className="pt-20"><TypeB /></div>}
        {displayPage === 'type-c' && <div className="pt-20"><TypeC /></div>}
        {displayPage === 'aigc' && <div className="pt-20"><Aigc /></div>}
        {displayPage === 'philanthropy' && <div className="pt-20"><Philanthropy /></div>}
        {displayPage === 'careers' && <div className="pt-20"><Careers /></div>}
        {displayPage === 'contact' && <div className="pt-20"><ContactUsPage /></div>}
        {displayPage === 'internal-news' && <div className="pt-20"><InternalNews /></div>}
        {displayPage === 'login' && <LoginPage />}
        </div>
      </main>

      {!isLoginPage && <Footer />}
      {!isLoginPage && <AiAssistant />}
    </div>
  );
};

export default App;


