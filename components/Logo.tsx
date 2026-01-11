
import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-24',
    xl: 'h-32'
  };
  
  return (
    <div className={`flex flex-col items-center ${sizes[size]}`}>
       <div className="relative group">
         {/* Simple SVG implementation of the shield + circuit logo from the prompt */}
         <svg viewBox="0 0 100 120" className="h-full w-auto">
            <path d="M50 5 L90 25 V60 C90 85 50 110 50 110 C50 110 10 85 10 60 V25 L50 5Z" fill="none" stroke="#1e3a8a" strokeWidth="4" />
            <path d="M50 20 V45 M50 55 V100 M35 40 Q40 50 50 60 M65 40 Q60 50 50 60" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="50" r="4" fill="#1e3a8a" />
         </svg>
       </div>
       <div className="mt-2 text-center">
          <span className="text-blue-900 font-bold tracking-tight text-xl">Moraqaba</span>
          <span className="text-lime-600 font-semibold block -mt-1 text-sm">AI</span>
       </div>
    </div>
  );
};
