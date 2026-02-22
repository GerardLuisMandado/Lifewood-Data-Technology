
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Welcome to Lifewood. I'm your Data Strategy Consultant. How can I assist you with your AI data pipeline today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are the Lifewood Data Strategy Assistant. Lifewood is the global pioneer in high-fidelity data engineering and annotation. Your tone is authoritative, premium, and consultative. You speak about Lifewood's 56,000 specialists and 40+ global centers with pride. Focus on how Lifewood provides the human-in-the-loop critical for advanced AI (LLMs, Computer Vision, etc.). Use the color 'Gold' and 'Deep Green' as metaphors for quality and stability when appropriate.`
        }
      });

      const aiText = response.text || "I apologize, our data link is currently experiencing high latency. How else may I assist?";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered a connection issue. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl flex flex-col border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
          <div className="bg-[#012620] p-6 text-white flex justify-between items-center border-b border-[#D4AF37]/30">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <img 
                  src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png" 
                  alt="Lifewood Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest">Lifewood AI</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Data Strategy</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-5 bg-[#FCFBF7]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#012620] text-white rounded-br-none shadow-lg' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-white border-t border-slate-100">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Inquire about our capabilities..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 pr-14 text-sm font-medium focus:border-[#D4AF37] focus:ring-0 transition-all outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className="absolute right-2.5 top-2.5 p-2 bg-[#012620] text-[#D4AF37] rounded-xl hover:bg-[#023a31] transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-center text-slate-300 mt-4">Authorized Data Strategy Agent</p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-[#012620] text-[#D4AF37] rounded-[28px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-2 border-[#D4AF37]/30"
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
             <img 
               src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png" 
               alt="Lifewood Logo" 
               className="w-full h-full object-contain group-hover:rotate-45 transition-transform duration-700"
             />
          </div>
          <div className="absolute right-24 bg-white text-[#012620] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all shadow-2xl border border-slate-100">
            Consult With Lifewood AI
          </div>
        </button>
      )}
    </div>
  );
};

export default AiAssistant;
