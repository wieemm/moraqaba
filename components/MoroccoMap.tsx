
import React from 'react';

interface MoroccoMapProps {
  onRegionClick?: (region: string) => void;
  selectedRegion?: string;
}

const regions = [
  { id: 'tanger', name: 'Tanger-Tétouan-Al Hoceïma', d: 'M50,10 L70,10 L70,20 L50,20 Z', color: 'bg-blue-200' },
  { id: 'oriental', name: 'L’Oriental', d: 'M70,20 L90,20 L90,50 L70,50 Z', color: 'bg-blue-300' },
  { id: 'fes', name: 'Fès-Meknès', d: 'M60,20 L75,20 L75,40 L60,40 Z', color: 'bg-blue-400' },
  { id: 'rabat', name: 'Rabat-Salé-Kénitra', d: 'M45,20 L60,20 L60,35 L45,35 Z', color: 'bg-blue-500' },
  { id: 'casa', name: 'Casablanca-Settat', d: 'M35,35 L50,35 L50,55 L35,55 Z', color: 'bg-blue-600' },
  { id: 'beni', name: 'Béni Mellal-Khénifra', d: 'M55,40 L70,40 L70,60 L55,60 Z', color: 'bg-blue-400' },
  { id: 'marrakech', name: 'Marrakech-Safi', d: 'M25,55 L45,55 L45,80 L25,80 Z', color: 'bg-blue-700' },
  { id: 'draa', name: 'Drâa-Tafilalet', d: 'M50,60 L80,60 L80,90 L50,90 Z', color: 'bg-blue-500' },
  { id: 'souss', name: 'Souss-Massa', d: 'M15,80 L40,80 L40,110 L15,110 Z', color: 'bg-blue-800' },
  { id: 'guelmim', name: 'Guelmim-Oued Noun', d: 'M10,110 L30,110 L30,150 L10,150 Z', color: 'bg-blue-600' },
  { id: 'laayoune', name: 'Laâyoune-Sakia El Hamra', d: 'M5,150 L25,150 L25,200 L5,200 Z', color: 'bg-blue-700' },
  { id: 'dakhla', name: 'Dakhla-Oued Ed-Dahab', d: 'M0,200 L20,200 L20,280 L0,280 Z', color: 'bg-blue-900' },
];

export const MoroccoMap: React.FC<MoroccoMapProps> = ({ onRegionClick, selectedRegion }) => {
  return (
    <div className="relative w-full aspect-[1/2] max-h-[600px] flex items-center justify-center p-4">
      {/* Simplified illustrative Morocco Map with regional segments */}
      <svg viewBox="0 0 100 300" className="w-full h-full drop-shadow-2xl">
        {regions.map((reg) => (
          <path
            key={reg.id}
            d={reg.d}
            className={`cursor-pointer transition-all duration-300 hover:fill-lime-500 ${
              selectedRegion === reg.id ? 'fill-lime-600 stroke-white stroke-2' : 'fill-slate-700 stroke-slate-500'
            }`}
            onClick={() => onRegionClick?.(reg.id)}
          >
            <title>{reg.name}</title>
          </path>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur p-4 rounded-xl border border-slate-200 text-xs shadow-sm max-w-[150px]">
        <h4 className="font-bold mb-2 uppercase text-slate-500">Taux Présence</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-900 rounded-sm"></span>
            <span>&gt; 95% Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
            <span>80-95% Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-slate-700 rounded-sm"></span>
            <span>&lt; 80% Alerte</span>
          </div>
        </div>
      </div>
    </div>
  );
};
