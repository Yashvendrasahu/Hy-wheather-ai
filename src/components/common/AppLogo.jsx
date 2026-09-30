// src/components/common/AppLogo.jsx
import React, { useState } from 'react';
import { CloudRain } from 'lucide-react';

export default function AppLogo({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showText = true,
  className = '',
  light = false
}) {
  const [imgError, setImgError] = useState(false);

  // Dimensions configuration
  const sizeMap = {
    sm: { box: 'w-7 h-7 rounded-lg', img: 'w-7 h-7', icon: 'w-4 h-4', text: 'text-base' },
    md: { box: 'w-8 h-8 sm:w-9 sm:h-9 rounded-xl', img: 'w-8 h-8 sm:w-9 sm:h-9', icon: 'w-4.5 h-4.5 sm:w-5 sm:h-5', text: 'text-lg sm:text-xl' },
    lg: { box: 'w-11 h-11 sm:w-12 sm:h-12 rounded-2xl', img: 'w-11 h-11 sm:w-12 sm:h-12', icon: 'w-6 h-6', text: 'text-xl sm:text-2xl' },
    xl: { box: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl', img: 'w-14 h-14 sm:w-16 sm:h-16', icon: 'w-8 h-8', text: 'text-2xl sm:text-3xl' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 select-none ${className}`}>
      {/* Direct PNG Logo Image */}
      <div className={`relative flex items-center justify-center shrink-0 ${currentSize.box}`}>
        {!imgError ? (
          <img
            src="/logo.png"
            alt="WEATHER FUSE Logo"
            onError={() => setImgError(true)}
            className={`${currentSize.img} object-contain rounded-xl drop-shadow-sm`}
          />
        ) : (
          <div className={`w-full h-full rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20`}>
            <CloudRain className={`${currentSize.icon} stroke-[2.2]`} />
          </div>
        )}
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex items-center">
          <span className={`font-black tracking-tight uppercase ${currentSize.text} ${light ? 'text-white' : 'text-slate-900'}`}>
            Weather <span className="text-sky-500">Fuse</span>
          </span>
        </div>
      )}
    </div>
  );
}
