
import React, { useEffect, useMemo, useRef, useState } from 'react';

declare global {
  interface Window {
    L?: any;
  }
}

type Office = {
  name: string;
  lat: number;
  lng: number;
};

const globalOfficeMapLocations: Office[] = [
  { name: 'Kuala Lumpur, Malaysia', lat: 3.139, lng: 101.6869 },
  { name: 'Singapore, Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Cebu, Philippines', lat: 10.3157, lng: 123.8854 },
  { name: 'Hanoi, Vietnam', lat: 21.0278, lng: 105.8342 },
  { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125 },
  { name: 'Kolkata, India', lat: 22.5726, lng: 88.3639 },
  { name: 'Hong Kong, China (SAR)', lat: 22.3193, lng: 114.1694 },
  { name: 'Shenzhen, China', lat: 22.5431, lng: 114.0579 },
  { name: 'Dongguan, China', lat: 23.0207, lng: 113.7518 },
  { name: 'Meizhou, China', lat: 24.2991, lng: 116.1212 },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792 },
  { name: 'Cotonou, Benin', lat: 6.3703, lng: 2.3912 },
  { name: 'Belgrade, Serbia', lat: 44.7866, lng: 20.4489 },
  { name: 'Helsinki, Finland', lat: 60.1699, lng: 24.9384 },
  { name: 'Hannover, Germany', lat: 52.3759, lng: 9.732 },
  { name: 'London, United Kingdom', lat: 51.5072, lng: -0.1276 },
  { name: 'Seattle, United States', lat: 47.6062, lng: -122.3321 },
  { name: 'San Jose, United States', lat: 37.3382, lng: -121.8863 },
  { name: 'Sao Paulo, Brazil', lat: -23.5505, lng: -46.6333 }
];

const LEAFLET_CSS_ID = 'lw-leaflet-css';
const LEAFLET_SCRIPT_ID = 'lw-leaflet-script';

const ensureLeaflet = async (): Promise<void> => {
  if (window.L) return;

  if (!document.getElementById(LEAFLET_CSS_ID)) {
    const link = document.createElement('link');
    link.id = LEAFLET_CSS_ID;
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(LEAFLET_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      if (window.L) {
        resolve();
        return;
      }
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Leaflet script.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = LEAFLET_SCRIPT_ID;
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Leaflet script.'));
    document.body.appendChild(script);
  });
};

const Philanthropy: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const heroImageRef = useRef<HTMLImageElement | null>(null);
  const impactImageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const allOffices = useMemo(() => globalOfficeMapLocations, []);
  const [isHeroImageVisible, setIsHeroImageVisible] = useState(false);
  const [visibleImpactImages, setVisibleImpactImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let isUnmounted = false;
    let handleResize: (() => void) | null = null;

    const initMap = async () => {
      await ensureLeaflet();
      if (isUnmounted || !mapRef.current || !window.L || mapInstanceRef.current) return;

      const L = window.L;
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        minZoom: 2,
        maxZoom: 8,
        worldCopyJump: true
      }).setView([18, 15], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: 'lifewood-pin-icon',
        html: '<svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg"><path d="M12 1C6.5 1 2 5.5 2 11c0 7.7 10 19 10 19s10-11.3 10-19C22 5.5 17.5 1 12 1z" fill="#0F7B58" stroke="#ffffff" stroke-width="2"/><circle cx="12" cy="11" r="3" fill="#F7B955"/></svg>',
        iconSize: [24, 32],
        iconAnchor: [12, 32],
        popupAnchor: [0, -28]
      });

      const bounds = L.latLngBounds([]);
      allOffices.forEach((office) => {
        const marker = L.marker([office.lat, office.lng], { icon: pinIcon, title: office.name }).addTo(map);
        marker.bindPopup(`<strong>${office.name}</strong>`);
        bounds.extend([office.lat, office.lng]);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.2), { maxZoom: 2 });
      }

      mapInstanceRef.current = map;

      handleResize = () => {
        map.invalidateSize();
      };
      window.setTimeout(handleResize, 0);
      window.addEventListener('resize', handleResize);
    };

    void initMap();

    return () => {
      isUnmounted = true;
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [allOffices]);

  useEffect(() => {
    const heroImage = heroImageRef.current;
    if (!heroImage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry?.isIntersecting) return;
        setIsHeroImageVisible(true);
        observer.unobserve(heroImage);
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(heroImage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.impactIndex);
          if (!Number.isNaN(idx)) {
            setVisibleImpactImages((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
    );

    impactImageRefs.current.forEach((img) => {
      if (img) observer.observe(img);
    });

    return () => observer.disconnect();
  }, []);

  const impactSections = [
    {
      title: 'Impact',
      desc: 'Through purposeful partnership and sustainable investment, we empower communities across Africa and the Indian sub-continent.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Partnership',
      desc: 'Collaborating with local experts in Nigeria, Ethiopia, Namibia, Zambia, Zimbabwe, Liberia, Sierra Leone, and Bangladesh.',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Application',
      desc: 'Deploying educational resources and data tools that facilitate long-term growth and community autonomy.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Expanding',
      desc: 'Our network grows every day, reaching more remote communities and creating new pathways for digital inclusion.',
      image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800',
    }
  ];

  return (
    <section data-no-reveal className="bg-white min-h-screen">
      {/* Header Section */}
      <div data-scroll-reveal className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex -space-x-1">
            <div className="w-3 h-3 rounded-full bg-black" />
            <div className="w-3 h-3 rounded-full bg-slate-300" />
          </div>
          <div className="h-px w-20 bg-slate-200" />
        </div>
        <h1 className="text-6xl font-black text-[#012620] uppercase tracking-tighter mb-8">Philanthropy and Impact</h1>
        <p className="max-w-4xl text-slate-600 text-lg leading-relaxed font-medium">
          We direct resources into education and developmental projects that create lasting change. Our approach goes beyond giving; it builds sustainable growth and empowers communities for the future.
        </p>
        <a href="#/contact" className="mt-8 inline-flex bg-[#F7B955] hover:bg-[#D4AF37] text-black px-6 py-2 rounded-full font-bold text-sm items-center gap-2 transition-all">
          Contact Us
          <div className="w-6 h-6 rounded-full bg-[#012620] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 17l9.2-9.2M17 17V7H7" strokeWidth="2.5"/></svg>
          </div>
        </a>
      </div>

      {/* Hero Section */}
      <div data-scroll-reveal className="max-w-7xl mx-auto px-6 mb-12">
        <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl relative">
          <img
            ref={heroImageRef}
            src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&q=80&w=2000" 
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isHeroImageVisible ? 'grayscale-0' : 'grayscale'
            }`}
            alt="People climbing a mountain"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      {/* Vision Statement */}
      <div data-scroll-reveal className="max-w-5xl mx-auto px-6 pt-12 pb-24 text-center">
        <h2 className="text-4xl md:text-5xl font-medium text-[#012620] leading-tight mb-12">
          Our vision is of a world where financial investment plays a central role in solving the social and environmental challenges facing the global community, specifically in Africa and the Indian sub-continent.
        </h2>
        <a href="#/about-us" className="inline-flex bg-[#012620] hover:bg-black text-[#F7B955] px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs items-center gap-3 mx-auto transition-all group">
          Know Us Better
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-1">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="2.5"/></svg>
          </div>
        </a>
      </div>

      {/* Transforming Communities Map Section */}
      <div data-scroll-reveal className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100 relative">
        <div className="mb-16 flex justify-center">
          <h2 className="text-4xl md:text-6xl font-black text-[#012620] uppercase tracking-tighter leading-none text-center whitespace-nowrap">
            Transforming Communities Worldwide
          </h2>
        </div>

        {/* Global Offices Leaflet Map */}
        <div className="bg-slate-50 rounded-[3rem] overflow-hidden relative shadow-2xl border border-slate-200 h-[600px]">
          <div ref={mapRef} className="h-full w-full" />
        </div>
      </div>

      {/* Alternating Content Sections */}
      <div data-scroll-reveal className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        {impactSections.map((section, idx) => (
          <div key={idx} className={`flex flex-col md:flex-row items-center gap-16 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="md:w-1/3">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px bg-slate-200" />
                <h3 className="text-3xl font-black text-slate-300 uppercase tracking-tighter">{section.title}</h3>
              </div>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                {section.desc}
              </p>
            </div>
            <div className="md:w-2/3">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[450px]">
                <img
                  ref={(el) => {
                    impactImageRefs.current[idx] = el;
                  }}
                  data-impact-index={idx}
                  src={section.image}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    visibleImpactImages[idx] ? 'grayscale-0' : 'grayscale'
                  }`}
                  alt={section.title}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Closing Quote */}
      <div data-scroll-reveal className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h3 className="text-4xl md:text-5xl font-black text-[#012620] uppercase tracking-tighter leading-tight">
          Working with new<br/>intelligence for a better world.
        </h3>
      </div>
    </section>
  );
};

export default Philanthropy;
