import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WeatherDashboard } from './components/Weather/WeatherDashboard';
import { TemperatureUnit } from './types';
import { CloudSun, Radio, Globe, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('weather_temp_unit');
      if (saved === 'fahrenheit' || saved === 'celsius') return saved;
    }
    return 'celsius';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_preference');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme_preference', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme_preference', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('weather_temp_unit', unit);
  }, [unit]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${isDark ? 'dark' : ''} bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 selection:bg-sky-500 selection:text-white transition-colors duration-300 relative overflow-x-hidden font-sans`}
    >
      {/* Top Navigation Header */}
      <Header
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        unit={unit}
        setUnit={setUnit}
      />

      {/* Main Weather Dashboard with atmospheric backdrop */}
      <main className="flex-1 pb-16">
        <WeatherDashboard unit={unit} setUnit={setUnit} isDark={isDark} />
      </main>

      {/* Sophisticated Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md py-8 px-4 sm:px-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <CloudSun size={19} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                Weather Intelligence
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Atmospheric Geocoding & High-Resolution Meteorological Analytics
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <Globe size={13} className="text-sky-500" />
              Powered by Open-Meteo
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <Radio size={13} className="text-emerald-500" />
              Real-time Geocoding
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <Sparkles size={13} className="text-amber-500" />
              WMO Meteorological Standards
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
