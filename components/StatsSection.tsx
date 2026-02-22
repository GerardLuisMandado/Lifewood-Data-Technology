import React, { useEffect, useMemo, useState } from 'react';

type StatItem = {
  id: number;
  title: string;
  content: string;
  panelTitle: string;
  statValue: string;
  statLabel: string;
};

type Theme = {
  rowBg: string;
  rowActiveBg: string;
  rowText: string;
  rowActiveText: string;
  panelBg: string;
  panelText: string;
  panelAccent: string;
  panelMetric: string;
  iconBg: string;
  iconColor: string;
};

const StatsSection: React.FC = () => {
  const [activeId, setActiveId] = useState<number>(1);
  const [displayId, setDisplayId] = useState<number>(1);
  const [panelVisible, setPanelVisible] = useState(true);
  const [animatedMetric, setAnimatedMetric] = useState<number>(0);

  const items: StatItem[] = [
    {
      id: 1,
      title: '40+ Global Delivery Centers',
      content:
        'Lifewood operates 40+ secure delivery centers worldwide, enabling reliable AI data operations with strict workflow and compliance standards.',
      panelTitle: 'Global Delivery Footprint',
      statValue: '40+',
      statLabel: 'Delivery Centers'
    },
    {
      id: 2,
      title: '30+ Countries Across All Continents',
      content:
        'Lifewood teams operate across regions with local context, ensuring cultural and linguistic relevance in data.',
      panelTitle: 'Worldwide Country Coverage',
      statValue: '30+',
      statLabel: 'Countries'
    },
    {
      id: 3,
      title: '50+ Language Capabilities and Dialects',
      content:
        'We deliver multilingual data collection, annotation, and quality assurance across diverse language variants.',
      panelTitle: 'Language Intelligence',
      statValue: '50+',
      statLabel: 'Languages & Dialects'
    },
    {
      id: 4,
      title: '56,000+ Global Online Resources',
      content:
        'With 56,788 specialists worldwide, Lifewood scales data collection, annotation, and quality assurance with 24/7 operational coverage.',
      panelTitle: 'Omni-Channel Workforce',
      statValue: '56K+',
      statLabel: 'Validated Experts'
    }
  ];

  const themes: Record<number, Theme> = {
    1: {
      rowBg: 'linear-gradient(180deg, #f5eedb 0%, #eee5cf 100%)',
      rowActiveBg: 'linear-gradient(180deg, #f5eedb 0%, #e8dec4 100%)',
      rowText: '#34495E',
      rowActiveText: '#101214',
      panelBg: 'linear-gradient(135deg, #f5eedb 0%, #e9dfc8 100%)',
      panelText: '#101214',
      panelAccent: '#012620',
      panelMetric: '#012620',
      iconBg: '#F3F4F6',
      iconColor: '#101214'
    },
    2: {
      rowBg: 'linear-gradient(180deg, #F8C979 0%, #F1B95E 100%)',
      rowActiveBg: 'linear-gradient(180deg, #F5BE68 0%, #E8AA4B 100%)',
      rowText: '#6B4E1F',
      rowActiveText: '#101214',
      panelBg: 'linear-gradient(135deg, #F5BE68 0%, #E9AD4F 100%)',
      panelText: '#101214',
      panelAccent: '#012620',
      panelMetric: '#012620',
      iconBg: '#F3F4F6',
      iconColor: '#101214'
    },
    3: {
      rowBg: 'linear-gradient(180deg, #0E7A4D 0%, #065E3A 100%)',
      rowActiveBg: 'linear-gradient(180deg, #0A7147 0%, #055634 100%)',
      rowText: '#DDF3E8',
      rowActiveText: '#FFFFFF',
      panelBg: 'linear-gradient(135deg, #065E3A 0%, #0A4A31 100%)',
      panelText: '#FFFFFF',
      panelAccent: '#D4AF37',
      panelMetric: '#F7B955',
      iconBg: 'rgba(255,255,255,0.92)',
      iconColor: '#065E3A'
    },
    4: {
      rowBg: 'linear-gradient(180deg, #111827 0%, #02050A 100%)',
      rowActiveBg: 'linear-gradient(180deg, #0B1220 0%, #02050A 100%)',
      rowText: '#E5E7EB',
      rowActiveText: '#FFFFFF',
      panelBg: 'linear-gradient(135deg, #02050A 0%, #111827 100%)',
      panelText: '#FFFFFF',
      panelAccent: '#D4AF37',
      panelMetric: '#F7B955',
      iconBg: 'rgba(255,255,255,0.92)',
      iconColor: '#02050A'
    }
  };

  useEffect(() => {
    if (activeId === displayId) return;
    setPanelVisible(false);
    const timer = window.setTimeout(() => {
      setDisplayId(activeId);
      setPanelVisible(true);
    }, 160);
    return () => window.clearTimeout(timer);
  }, [activeId, displayId]);

  useEffect(() => {
    const targetItem = items.find((item) => item.id === displayId) ?? items[0];
    const target = parseInt(targetItem.statValue.replace(/[^0-9]/g, ''), 10) || 0;

    const duration = 700;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedMetric(Math.round(target * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    setAnimatedMetric(0);
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [displayId]);

  const activeItem = useMemo(
    () => items.find((item) => item.id === displayId) ?? items[0],
    [displayId, items]
  );
  const activeTheme = themes[displayId] ?? themes[1];
  const metricSuffix = activeItem.statValue.includes('K+') ? 'K+' : activeItem.statValue.includes('+') ? '+' : '';

  return (
    <section className="mt-20">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <p className="lg:col-span-2 text-slate-600 text-base md:text-lg leading-relaxed mb-0 max-w-none lg:whitespace-nowrap">
          Local expertise and our global AI backbone create opportunities, strengthen communities, and drive inclusive growth.
        </p>
        <div className="space-y-3">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const theme = themes[item.id];
            return (
              <button
                key={item.id}
                onMouseEnter={() => setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                className="w-full h-[113px] rounded-3xl border border-white/70 px-6 py-5 flex items-center justify-between text-left transition-all duration-500 ease-out hover:-translate-y-0.5 relative overflow-hidden"
                style={{
                  background: isActive ? theme.rowActiveBg : theme.rowBg,
                  color: isActive ? theme.rowActiveText : theme.rowText,
                  boxShadow: isActive
                    ? '0 12px 28px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.45)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.35)'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/5 pointer-events-none" />
                <span className="absolute top-0 left-0 right-0 h-[1px] bg-white/60 pointer-events-none" />
                <span
                  className="text-lg md:text-2xl font-black uppercase tracking-tight pr-8 md:pr-12"
                  style={item.id <= 2 ? { color: '#000000' } : { color: '#FFFFFF' }}
                >
                  {item.title}
                </span>
                <span
                  className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0"
                  style={{ background: theme.iconBg, color: theme.iconColor }}
                >
                  {isActive ? '-' : '+'}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl lg:h-[500px] transition-all duration-700 ease-out"
          style={{ background: activeTheme.panelBg, color: activeTheme.panelText }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/15" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/55" />
            <div className="absolute -top-24 -left-10 w-72 h-72 bg-white/12 blur-3xl rounded-full" />
          </div>
          <div className={`relative z-10 h-full flex flex-col transition-all duration-300 ${panelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <div className="w-10 h-1 rounded-full mb-6" style={{ backgroundColor: activeTheme.panelAccent }} />
            <h3 className="text-4xl md:text-5xl font-black uppercase leading-[0.95] mb-5">{activeItem.panelTitle}</h3>
            <p className="text-lg md:text-xl font-medium leading-[1.25] mb-6 opacity-90">{activeItem.content}</p>
            <div className="grid grid-cols-2 gap-10 mt-auto">
              <div>
                <p className="text-5xl font-black mb-1" style={{ color: activeTheme.panelMetric }}>
                  {animatedMetric}
                  {metricSuffix}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-75">{activeItem.statLabel}</p>
              </div>
              <div>
                <p className="text-5xl font-black mb-1" style={{ color: activeTheme.panelMetric }}>24/7</p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-75">Ops Reliability</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
