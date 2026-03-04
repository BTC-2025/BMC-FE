import { useState } from "react";

const RadialSegment = ({ index, total, icon, label, activeIndex, setActiveIndex, onEnter }) => {
  const angleStep = 360 / total;
  const startAngle = (index * angleStep) - 90 - (angleStep / 2);
  const endAngle = ((index + 1) * angleStep) - 90 - (angleStep / 2);
  const radius = 95;
  const innerRadius = 48;
  const gap = 1.8; 
  
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    var angleInRadians = (angleInDegrees) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  const describeSegment = (x, y, innerR, outerR, startA, endA) => {
    const sA = startA + gap;
    const eA = endA - gap;
    const startOuter = polarToCartesian(x, y, outerR, sA);
    const endOuter = polarToCartesian(x, y, outerR, eA);
    const startInner = polarToCartesian(x, y, innerR, sA);
    const endInner = polarToCartesian(x, y, innerR, eA);
    const largeArcFlag = eA - sA <= 180 ? "0" : "1";
    
    return ["M", startOuter.x, startOuter.y, "A", outerR, outerR, 0, largeArcFlag, 1, endOuter.x, endOuter.y, "L", endInner.x, endInner.y, "A", innerR, innerR, 0, largeArcFlag, 0, startInner.x, startInner.y, "Z"].join(" ");
  }

  const midAngle = (startAngle + endAngle) / 2;
  const iconPos = polarToCartesian(100, 100, 72, midAngle);
  const isActive = activeIndex === index;

  return (
    <g 
      className="cursor-pointer group/seg transition-all duration-300" 
      onMouseEnter={() => setActiveIndex(index)}
      onClick={(e) => { e.stopPropagation(); onEnter(); }}
    >
      <path
        d={describeSegment(100, 100, innerRadius, radius, startAngle, endAngle)}
        className={`transition-all duration-500 ${isActive ? 'fill-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]' : 'fill-white/90 hover:fill-white'}`}
        style={isActive ? { transform: 'scale(1.1)', transformOrigin: 'center' } : {}}
      />
      <text
        x={iconPos.x}
        y={iconPos.y}
        textAnchor="middle"
        alignmentBaseline="middle"
        className={`text-2xl font-bold transition-all duration-500 pointer-events-none select-none ${isActive ? 'fill-gray-950 scale-125' : 'fill-gray-400'}`}
        style={{ transformOrigin: `${iconPos.x}px ${iconPos.y}px` }}
      >
        {icon}
      </text>
      {isActive && (
        <foreignObject x={iconPos.x - 45} y={iconPos.y - 65} width="90" height="30">
          <div className="flex justify-center animate-in slide-in-from-bottom-2 duration-500">
            <span className="bg-white text-gray-900 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-xl border border-gray-100">
              {label}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

const DevelopedRadialMenu = ({ items, centerIcon, mainLabel, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="relative w-[140px] h-[140px] flex items-center justify-center scale-90 md:scale-100">
        {/* Orbital Traces */}
        <div className={`absolute inset-0 border border-white/10 rounded-full transition-all duration-1000 ${isOpen ? 'scale-110' : 'scale-90 opacity-0'}`}></div>
        <div className={`absolute inset-4 border border-dashed border-gray-400/10 rounded-full animate-spin-slow transition-all duration-1000 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>

        {/* SVG Ring */}
        <svg 
          viewBox="0 0 200 200" 
          className={`w-full h-full overflow-visible transition-all duration-[1200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${isOpen ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90 pointer-events-none'}`}
        >
            <circle cx="100" cy="100" r="95" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
            {items.map((item, i) => (
                <RadialSegment 
                    key={i}
                    index={i}
                    total={items.length}
                    icon={item.icon}
                    label={item.label}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    onEnter={() => { onAction(item); setIsOpen(false); }}
                />
            ))}
            <circle cx="100" cy="100" r="48" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>
        
        {/* Toggle Hub - EXACT IMAGE MATCH */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isOpen ? (
            <button 
                onClick={() => setIsOpen(false)} 
                className="group relative w-[56px] h-[56px] flex items-center justify-center transition-all duration-700 active:scale-90"
            >
                {/* Pure White Circular Hub */}
                <div className="absolute inset-0 bg-white rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.08)] group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-500"></div>
                
                <div className="relative flex flex-col items-center justify-center">
                    <span className="text-gray-950 text-base font-bold transition-transform group-hover:scale-110 duration-500">←</span>
                </div>
            </button>
          ) : (
            <button 
                onClick={() => setIsOpen(true)} 
                className="group relative w-[56px] h-[56px] flex items-center justify-center transition-all duration-700 active:scale-95"
            >
                {/* Floating Liquid Core */}
                <div className="absolute inset-0 bg-white rounded-full shadow-[0_12px_32px_-5px_rgba(0,0,0,0.1)] group-hover:scale-105 group-hover:shadow-[0_15px_40px_-8px_rgba(0,0,0,0.15)] transition-all duration-700 ease-out"></div>
                
                {/* Icon Container */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <span className="text-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[360deg] select-none filter drop-shadow-sm">
                        {centerIcon}
                    </span>
                </div>

                {/* Status Dot Removed per user request */}

                {/* Tooltip Label */}
                <div className="absolute -bottom-12 scale-0 group-hover:scale-100 transition-all duration-500 origin-top bg-gray-900/90 text-[8px] font-black text-white uppercase tracking-widest px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-sm whitespace-nowrap border border-white/10">
                    {mainLabel}
                </div>
            </button>
          )}
        </div>
    </div>
  );
};

export default DevelopedRadialMenu;
