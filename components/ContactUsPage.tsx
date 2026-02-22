
import React from 'react';

const ContactUsPage: React.FC = () => {
  return (
    <div className="bg-[#FCFBF7] min-h-screen flex items-center justify-center py-24 px-6 relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#012620] opacity-[0.02] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#F7B955] opacity-[0.05] rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Side Info */}
        <div className="space-y-8">
          <div className="inline-block bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
             <span className="text-xs font-black uppercase tracking-[0.3em] text-[#012620]">Contact us</span>
          </div>
          <h1 className="text-7xl font-black text-[#012620] uppercase tracking-tighter leading-none">
            Let's Start a<br/>Conversation
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-md">
            Whether you're looking to join our global specialist network or need enterprise-grade AI data engineering, we're here to help.
          </p>
          <div className="space-y-4 pt-12">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md border border-slate-50">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2.5"/></svg>
               </div>
               <span className="font-black text-[#012620] uppercase tracking-widest text-sm">intelligence@lifewood.com</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md border border-slate-50">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2.5"/></svg>
               </div>
               <span className="font-black text-[#012620] uppercase tracking-widest text-sm">1 Marina Boulevard, Singapore</span>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-[#012620] to-[#0D4A30] rounded-[3rem] rotate-2 scale-105 opacity-10 group-hover:rotate-1 transition-transform duration-700" />
           <div className="bg-[#012620] rounded-[3rem] overflow-hidden shadow-2xl relative border border-white/10 p-12">
              {/* Glossy green background */}
              <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute inset-0 bg-[linear-gradient(145deg,#0f6a4b_0%,#084934_48%,#022019_100%)]" />
                 <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_18%_6%,rgba(191,255,224,0.26)_0%,rgba(191,255,224,0.06)_34%,rgba(2,32,25,0)_65%)]" />
                 <div className="absolute -top-16 left-8 right-8 h-44 rounded-full bg-white/25 blur-3xl opacity-35" />
                 <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-emerald-200/20 blur-3xl" />
              </div>

              <div className="relative z-10 space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Name</label>
                    <input 
                      type="text" 
                      placeholder="Your full name" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] focus:bg-white/10 transition-all" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Email</label>
                    <input 
                      type="email" 
                      placeholder="email@company.com" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] focus:bg-white/10 transition-all" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Message</label>
                    <textarea 
                      rows={4}
                      placeholder="How can we collaborate?" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] focus:bg-white/10 transition-all resize-none" 
                    ></textarea>
                 </div>

                 <button className="w-full bg-[#F7B955] hover:bg-[#D4AF37] text-[#012620] py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl group active:scale-[0.98]">
                    Send Message
                 </button>

              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
