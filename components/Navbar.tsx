
import React, { useState } from 'react';


interface NavbarProps {
  scrolled: boolean;
  currentPage: string;
}

interface NavSubItem {
  name: string;
  href: string;
}

interface NavLink {
  name: string;
  href: string;
  hasDropdown?: boolean;
  subItems?: NavSubItem[];
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navLinks: NavLink[] = [
    { name: 'Home', href: '#/' },
    { 
      name: 'AI Initiatives', 
      href: '#', 
      hasDropdown: true,
      subItems: [
        { name: 'AI Services', href: '#/ai-services' },
        { name: 'AI Projects', href: '#/ai-projects' },
      ]
    },
    { 
      name: 'Our Company', 
      href: '#', 
      hasDropdown: true,
      subItems: [
        { name: 'About Us', href: '#/about-us' },
        { name: 'Global Offices', href: '#/offices' },
      ]
    },
    { 
      name: 'What We Offer', 
      href: '#', 
      hasDropdown: true,
      subItems: [
        { name: 'Type A-Data Servicing', href: '#/type-a' },
        { name: 'Type B-Horizontal LLM Data', href: '#/type-b' },
        { name: 'Type C-Vertical LLM Data', href: '#/type-c' },
        { name: 'Type D-AIGC', href: '#/aigc' },
      ]
    },
    { name: 'Philanthropy & Impact', href: '#/philanthropy' },
    { name: 'Careers', href: '#/careers' },
    { name: 'Contact Us', href: '#/contact' },
    { name: 'Internal News', href: '#/internal-news' },
  ];

  const isLinkActive = (link: NavLink) => {
    if (link.href === '#/') return currentPage === 'home';
    if (link.href === '#/philanthropy') return currentPage === 'philanthropy';
    if (link.href === '#/careers') return currentPage === 'careers';
    if (link.href === '#/contact') return currentPage === 'contact';
    if (link.href === '#/internal-news') return currentPage === 'internal-news';

    if (link.name === 'AI Initiatives') {
      return currentPage === 'services' || currentPage === 'projects';
    }
    if (link.name === 'Our Company') {
      return currentPage === 'about' || currentPage === 'offices';
    }
    if (link.name === 'What We Offer') {
      return currentPage === 'type-a' || currentPage === 'type-b' || currentPage === 'type-c' || currentPage === 'aigc';
    }

    return false;
  };

  const isSubLinkActive = (href: string) => {
    if (href === '#/ai-services') return currentPage === 'services';
    if (href === '#/ai-projects') return currentPage === 'projects';
    if (href === '#/about-us') return currentPage === 'about';
    if (href === '#/offices') return currentPage === 'offices';
    if (href === '#/type-a') return currentPage === 'type-a';
    if (href === '#/type-b') return currentPage === 'type-b';
    if (href === '#/type-c') return currentPage === 'type-c';
    if (href === '#/aigc') return currentPage === 'aigc';
    return false;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
      scrolled 
        ? 'bg-white/75 backdrop-blur-2xl py-3 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-b border-white/20' 
        : 'bg-transparent py-6'
    }`}>
      {/* Glossy Reflection Line */}
      {scrolled && (
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-40" />
      )}

      <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3 shrink-0">
          <a href="#/" className="group relative flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95">
            <img
              src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
              alt="Lifewood Logo"
              style={{ height: 56, width: 'auto', display: 'block' }}
            />
          </a>
        </div>

        <div className="hidden xl:flex items-center gap-6 2xl:gap-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
            <div key={link.name} className="relative py-4" onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)} onMouseLeave={() => setActiveDropdown(null)}>
              <a href={link.href} className={`text-[11px] font-bold tracking-tight transition-all relative group flex items-center gap-1.5 ${active ? 'text-[#D4AF37]' : 'text-black hover:text-[#D4AF37]'}`}>
                {link.name}
                {link.hasDropdown && <svg className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all ${active ? 'w-full' : `w-0 group-hover:w-full ${activeDropdown === link.name ? 'w-full' : ''}`}`}></span>
              </a>
              {link.hasDropdown && link.subItems && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-300 ${activeDropdown === link.name ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}>
                  <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-6 min-w-[220px] flex flex-col gap-4">
                    {link.subItems.map((sub) => (
                      <a key={sub.name} href={sub.href} onClick={() => setActiveDropdown(null)} className={`text-lg font-bold transition-all hover:translate-x-1 ${isSubLinkActive(sub.href) ? 'text-[#D4AF37]' : 'text-black hover:text-black'}`}>{sub.name}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )})}
          <a
            href="#/login"
            className={`ml-4 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
              currentPage === 'login'
                ? 'bg-[#F7B955] text-[#0D4A30]'
                : 'bg-[#0D4A30] text-white hover:bg-[#F7B955] hover:text-[#0D4A30]'
            }`}
          >
            Login
          </a>
        </div>

        <button className="xl:hidden p-2 text-black hover:bg-black/5 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className={`xl:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-slate-100 shadow-2xl transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.hasDropdown ? (
                <button className={`w-full flex justify-between items-center text-base font-bold tracking-tight pb-3 border-b border-slate-50 transition-colors ${isLinkActive(link) ? 'text-[#D4AF37]' : 'text-black hover:text-[#D4AF37]'}`} onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}>
                  {link.name}
                  <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              ) : (
                <a href={link.href} onClick={() => setIsOpen(false)} className={`w-full flex justify-between items-center text-base font-bold tracking-tight pb-3 border-b border-slate-50 transition-colors ${isLinkActive(link) ? 'text-[#D4AF37]' : 'text-black hover:text-[#D4AF37]'}`}>
                  {link.name}
                </a>
              )}
              {link.hasDropdown && activeDropdown === link.name && link.subItems && (
                <div className="pl-4 py-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                  {link.subItems.map((sub) => (
                    <a key={sub.name} href={sub.href} onClick={() => setIsOpen(false)} className={`text-lg font-bold ${isSubLinkActive(sub.href) ? 'text-[#D4AF37]' : 'text-black hover:text-black'}`}>{sub.name}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="#/login"
            onClick={() => setIsOpen(false)}
            className="block w-full mt-4 bg-[#0D4A30] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-[#F7B955] hover:text-[#0D4A30] transition-all text-center"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
