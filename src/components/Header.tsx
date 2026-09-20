import React from 'react';
import { CloudSun, Moon, Sun, Compass, Radio } from 'lucide-react';
import { TemperatureUnit } from '../types';

interface HeaderProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  toggleDarkMode,
  unit,
  setUnit,
  onRefresh,
  isLoading,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <CloudSun size={22} className="drop-shadow-xs" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Weather Intelligence
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <Radio size={10} className="animate-pulse" />
                Live Open-Meteo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Precision Geocoding • 7-Day Atmospheric Analytics • Smart Planning
            </p>
          </div>
        </div>

        {/* Right side controls: Temp Unit & Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Temperature Unit Segmented Control */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold">
            <button
              type="button"
              id="header-celsius-btn"
              onClick={() => setUnit('celsius')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                unit === 'celsius'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              id="header-fahrenheit-btn"
              onClick={() => setUnit('fahrenheit')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            id="dark-mode-toggle-btn"
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors shadow-xs"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun size={18} className="text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon size={18} className="text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
