import React from 'react';
import { WeatherCategory } from '../../utils/weatherCodes';

interface AtmosphericCanvasProps {
  category: WeatherCategory;
  isDay: boolean;
  isDark: boolean;
}

export const AtmosphericCanvas: React.FC<AtmosphericCanvasProps> = ({
  category,
  isDay,
  isDark,
}) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-all duration-700 ease-in-out select-none"
    >
      {/* Dynamic theme ambient base overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark
            ? 'bg-[#080c16]/95'
            : 'bg-gradient-to-b from-sky-50/70 via-slate-50/40 to-slate-100/60'
        }`}
      />

      {/* Atmospheric lighting blooms tailored to weather condition */}
      {category === 'clear' && isDay && (
        <>
          {/* Warm Sun Ray Bloom */}
          <div className="absolute -top-24 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-400/20 via-orange-300/10 to-transparent rounded-full blur-3xl transform translate-x-20 animate-pulse" />
          <div className="absolute top-10 right-1/3 w-[300px] h-[300px] bg-amber-300/15 rounded-full blur-2xl" />
        </>
      )}

      {category === 'clear' && !isDay && (
        <>
          {/* Celestial Night Glow & Starfield effect */}
          <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-gradient-to-b from-indigo-500/15 via-purple-900/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-20 left-10 w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_8px_#fff]" />
          <div className="absolute top-44 left-1/4 w-1 h-1 rounded-full bg-white/50" />
          <div className="absolute top-14 right-1/3 w-1.5 h-1.5 rounded-full bg-indigo-200/80 shadow-[0_0_6px_#c7d2fe]" />
          <div className="absolute top-36 right-1/6 w-1 h-1 rounded-full bg-white/60" />
        </>
      )}

      {(category === 'rain' || category === 'drizzle') && (
        <>
          {/* Aquatic storm front mood */}
          <div className="absolute -top-20 left-1/3 w-[700px] h-[500px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl" />
        </>
      )}

      {category === 'thunderstorm' && (
        <>
          {/* Deep violet storm energy */}
          <div className="absolute -top-32 left-1/4 w-[800px] h-[600px] bg-gradient-to-br from-purple-700/20 via-indigo-600/15 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-32 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-2xl" />
        </>
      )}

      {category === 'snow' && (
        <>
          {/* Crystalline winter cold haze */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-sky-300/20 via-cyan-100/10 to-transparent rounded-full blur-3xl" />
        </>
      )}

      {(category === 'clouds' || category === 'fog') && (
        <>
          {/* Diffuse soft cloud deck */}
          <div className="absolute -top-10 left-1/4 w-[700px] h-[450px] bg-gradient-to-b from-slate-400/15 via-slate-500/5 to-transparent rounded-full blur-3xl" />
        </>
      )}

      {/* Subtle fine geometric grid pattern for sophisticated data-intelligence feel */}
      <div
        className={`absolute inset-0 opacity-[0.025] dark:opacity-[0.035] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]`}
      />
    </div>
  );
};
