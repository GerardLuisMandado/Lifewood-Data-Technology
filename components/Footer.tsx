
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0D4A30] text-white pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Brand Octagon Background */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] text-[#F7B955]">
          <path d="M35 0 L65 0 L90 30 L90 70 L65 100 L35 100 L10 70 L10 30 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <div className="inline-flex items-center gap-3 mb-8 bg-white/90 px-3 py-2 rounded-xl shadow-sm">
              <img
                src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
                alt="Lifewood Logo"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed font-medium">
              A legacy of precision in data engineering. Powering the next generation of artificial intelligence through ethical, high-fidelity human insight.
            </p>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-[11px] mb-8 text-[#F7B955]">Capability Grid</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li><a href="#" className="hover:text-[#F7B955] transition-colors">Strategic Data Collection</a></li>
              <li><a href="#" className="hover:text-[#F7B955] transition-colors">Human-in-the-Loop Annotation</a></li>
              <li><a href="#" className="hover:text-[#F7B955] transition-colors">Visual Intelligence Ops</a></li>
              <li><a href="#" className="hover:text-[#F7B955] transition-colors">Linguistic Data Training</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-[11px] mb-8 text-[#F7B955]">The Enterprise</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li><a href="#" className="hover:text-[#F7B955] transition-colors">The Lifewood Way</a></li>
              <li><a href="#" className="hover:text-[#F7B955] transition-colors">Global Delivery Network</a></li>
              <li><a href="#" className="hover:text-[#F7B955] transition-colors">Social Responsibility</a></li>
              <li><a href="#" className="hover:text-[#F7B955] transition-colors">Career Pathways</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-[11px] mb-8 text-[#F7B955]">Global Presence</h4>
            <ul className="space-y-6 text-slate-400 font-medium text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#F7B955] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>intelligence@lifewood.com</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#F7B955] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>HQ - 1 Marina Boulevard,<br/>Singapore 018989</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-8">
              <a
                href="https://www.facebook.com/LifewoodPH"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#F7B955] hover:text-[#0D4A30] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5 9H16V6h-2.5C10.9 6 9 7.9 9 10.5V13H7v3h2v5h3v-5h2.3l.7-3H12v-2.5c0-.8.7-1.5 1.5-1.5z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/lifewood_official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#F7B955] hover:text-[#0D4A30] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="4"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/lifewood-data-technology-ltd./posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#F7B955] hover:text-[#0D4A30] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.5 8.8H3.8V20h2.7V8.8zM5.1 7.5a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2zM20.2 13.5c0-3.1-1.6-4.8-4.2-4.8-1.5 0-2.4.8-2.8 1.5V8.8h-2.6V20h2.7v-6c0-1.6.8-2.6 2.2-2.6 1.3 0 2 .9 2 2.6v6h2.7v-6.5z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@LifewoodDataTechnology"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#F7B955] hover:text-[#0D4A30] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.6 8.2a2.8 2.8 0 00-2-2c-1.8-.5-7.6-.5-7.6-.5s-5.8 0-7.6.5a2.8 2.8 0 00-2 2A29 29 0 002 12a29 29 0 00.4 3.8 2.8 2.8 0 002 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 002-2A29 29 0 0022 12a29 29 0 00-.4-3.8zM10 15.2V8.8l5.5 3.2-5.5 3.2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© 2026 Lifewood Data Solutions. Precision Guaranteed.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#F7B955] transition-colors">Data Privacy</a>
            <a href="#" className="hover:text-[#F7B955] transition-colors">Ethics Protocol</a>
            <a href="#" className="hover:text-[#F7B955] transition-colors">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

