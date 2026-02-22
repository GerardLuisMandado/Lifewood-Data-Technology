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

type OfficeRegion = {
  name: 'APAC' | 'EMEA' | 'Americas';
  icon: 'building' | 'globe';
  offices: Office[];
};

const regionalOffices: OfficeRegion[] = [
  {
    name: 'APAC',
    icon: 'building',
    offices: [
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
      { name: 'Meizhou, China', lat: 24.2991, lng: 116.1212 }
    ]
  },
  {
    name: 'EMEA',
    icon: 'globe',
    offices: [
      { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
      { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792 },
      { name: 'Cotonou, Benin', lat: 6.3703, lng: 2.3912 },
      { name: 'Belgrade, Serbia', lat: 44.7866, lng: 20.4489 },
      { name: 'Helsinki, Finland', lat: 60.1699, lng: 24.9384 },
      { name: 'Hannover, Germany', lat: 52.3759, lng: 9.732 },
      { name: 'London, United Kingdom', lat: 51.5072, lng: -0.1276 }
    ]
  },
  {
    name: 'Americas',
    icon: 'globe',
    offices: [
      { name: 'Seattle, United States', lat: 47.6062, lng: -122.3321 },
      { name: 'San Jose, United States', lat: 37.3382, lng: -121.8863 },
      { name: 'Sao Paulo, Brazil', lat: -23.5505, lng: -46.6333 }
    ]
  }
];

const LEAFLET_CSS_ID = 'lw-leaflet-css';
const LEAFLET_SCRIPT_ID = 'lw-leaflet-script';
const normalizeLocation = (value: string) => value.trim().toLowerCase();

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

const Offices: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerByLocationRef = useRef<Record<string, any>>({});
  const locationItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const allOffices = useMemo(() => regionalOffices.flatMap((region) => region.offices), []);
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

  const focusOffice = (officeName: string) => {
    const marker = markerByLocationRef.current[normalizeLocation(officeName)];
    if (!marker || !mapInstanceRef.current) return;

    mapInstanceRef.current.flyTo(marker.getLatLng(), 6, { duration: 0.7 });
    marker.openPopup();
  };

  const handleLocationSelect = (officeName: string) => {
    setSelectedOffice(officeName);
    focusOffice(officeName);
  };

  const renderRegionIcon = (icon: OfficeRegion['icon']) => {
    if (icon === 'building') {
      return (
        <svg className="w-5 h-5 text-[#0F7B58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 20h16M6 20V6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14M9 9h2m4 0h-2m-4 4h2m4 0h-2M9 20v-3h6v3" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }

    return (
      <svg className="w-5 h-5 text-[#0F7B58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" strokeWidth="1.8" />
        <path d="M4.5 9.5h15M4.5 14.5h15M12 4a14 14 0 0 1 0 16M12 4a14 14 0 0 0 0 16" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  };

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
        const marker = L.marker([office.lat, office.lng], { icon: pinIcon, title: office.name })
          .addTo(map)
          .bindPopup(`<strong>${office.name}</strong>`);

        marker.on('click', () => {
          setSelectedOffice(office.name);
        });

        markerByLocationRef.current[normalizeLocation(office.name)] = marker;
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
      markerByLocationRef.current = {};
    };
  }, [allOffices]);

  useEffect(() => {
    if (!selectedOffice) return;
    const target = locationItemRefs.current[normalizeLocation(selectedOffice)];
    if (!target) return;
    target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedOffice]);

  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 py-10 md:py-12 space-y-5">
        <div className="rounded-[1.25rem] overflow-hidden shadow-2xl border border-[#0D4A30]/60">
          <div className="relative bg-[radial-gradient(120%_120%_at_20%_20%,#11875F_0%,#0D4A30_55%,#082F21_100%)] px-6 md:px-10 py-8 md:py-10">
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_40%,rgba(0,0,0,0.15)_100%)]" />
            <div className="relative text-center max-w-4xl mx-auto">
              <h1 className="text-white text-3xl md:text-5xl font-black leading-[0.95] tracking-tighter">
                Largest Global Data Collection Resources Distribution
              </h1>
              <p className="mt-4 text-[#D4E9DF] text-base md:text-xl leading-snug max-w-3xl mx-auto font-medium">
                Lifewood operates across APAC, EMEA, and the Americas, enabling scalable multilingual data operations with local expertise.
              </p>
            </div>
          </div>

          <div className="bg-[#0C6B47] grid md:grid-cols-3">
            <div className="px-5 py-5 md:py-6 text-center border-b md:border-b-0 md:border-r border-white/20">
              <p className="text-[#F7B955] text-4xl md:text-[2.6rem] font-black leading-none tracking-tight">56,788</p>
              <p className="mt-2 text-[#D8EFE5] text-xs md:text-sm uppercase tracking-[0.14em] font-bold">Online Resources</p>
            </div>
            <div className="px-5 py-5 md:py-6 text-center border-b md:border-b-0 md:border-r border-white/20">
              <p className="text-[#F7B955] text-4xl md:text-[2.6rem] font-black leading-none tracking-tight">30+</p>
              <p className="mt-2 text-[#D8EFE5] text-xs md:text-sm uppercase tracking-[0.14em] font-bold">Countries</p>
            </div>
            <div className="px-5 py-5 md:py-6 text-center">
              <p className="text-[#F7B955] text-4xl md:text-[2.6rem] font-black leading-none tracking-tight">40+</p>
              <p className="mt-2 text-[#D8EFE5] text-xs md:text-sm uppercase tracking-[0.14em] font-bold">Delivery Centers</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-6 items-start">
          <div className="rounded-[1.2rem] overflow-hidden border-2 border-[#123543] shadow-xl bg-white">
            <div ref={mapRef} className="h-[520px] md:h-[560px] w-full" />
          </div>

          <aside className="rounded-[1.2rem] border border-slate-200 bg-white p-6 md:p-7 shadow-xl h-[520px] md:h-[560px] flex flex-col">
            <h2 className="text-4xl font-black text-[#012620] leading-none mb-2">Global Office Locations</h2>
            <p className="text-slate-500 text-sm font-medium">All mapped locations are listed below by region. Click any pin to highlight its office.</p>

            <div className="mt-4 rounded-2xl border border-[#012620]/20 bg-[#012620]/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-widest font-black text-[#0D4A30]/80">Selected Pin</p>
              <p className="text-lg font-black text-[#012620] mt-1">{selectedOffice ?? 'None selected yet'}</p>
            </div>

            <div className="mt-5 space-y-4 overflow-y-auto pr-1">
              {regionalOffices.map((region) => (
                <div key={region.name} className="rounded-3xl border border-slate-200 bg-[#FCFBF7] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      {renderRegionIcon(region.icon)}
                    </div>
                    <h3 className="text-3xl font-black text-[#012620]">{region.name}</h3>
                  </div>

                  <div className="space-y-2.5">
                    {region.offices.map((office) => {
                      const [city, ...rest] = office.name.split(',');
                      const country = rest.join(',').trim();
                      const normalized = normalizeLocation(office.name);
                      const isSelected = selectedOffice ? normalizeLocation(selectedOffice) === normalized : false;

                      return (
                        <button
                          key={office.name}
                          type="button"
                          ref={(node) => {
                            locationItemRefs.current[normalized] = node;
                          }}
                          onClick={() => handleLocationSelect(office.name)}
                          className={`w-full flex items-start gap-2.5 text-left text-lg leading-snug rounded-xl px-2 py-1 transition-colors ${
                            isSelected ? 'bg-[#012620]/10' : 'hover:bg-slate-100'
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">
                            <svg className={`w-4 h-4 ${isSelected ? 'text-[#012620]' : 'text-[#0F7B58]'}`} viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2c-3.86 0-7 3.14-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7Zm0 9.25A2.25 2.25 0 1 1 12 6.75a2.25 2.25 0 0 1 0 4.5Z" />
                            </svg>
                          </span>
                          <span>
                            <span className={`font-black ${isSelected ? 'text-[#012620]' : 'text-[#24372F]'}`}>{city}</span>
                            {country ? <span className="text-slate-500">, {country}</span> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Offices;
