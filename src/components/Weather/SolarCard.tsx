import React from 'react';
import { DailyForecast } from '../../types';
import { Sunrise, Sunset, Sun, ShieldAlert, Sparkles, Orbit } from 'lucide-react';

interface SolarCardProps {
  daily: DailyForecast;
  currentTimeStr?: string;
}

export const SolarCard: React.FC<SolarCardProps> = ({ daily, currentTimeStr }) => {
  const sunriseStr = daily.sunrise?.[0];
  const sunsetStr = daily.sunset?.[0];
  const uvMax = daily.uv_index_max?.[0];
  const precipProbMax = daily.precipitation_probability_max?.[0];
  const precipSum = daily.precipitation_sum?.[0];

  if (!sunriseStr || !sunsetStr) return null;

  const sunriseDate = new Date(sunriseStr);
  const sunsetDate = new Date(sunsetStr);
  const now = currentTimeStr ? new Date(currentTimeStr) : new Date();

  const sunriseTimeFormatted = sunriseDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const sunsetTimeFormatted = sunsetDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  // Daylight duration
  const daylightMs = Math.max(sunsetDate.getTime() - sunriseDate.getTime(), 0);
  const daylightHours = Math.floor(daylightMs / (1000 * 60 * 60));
  const daylightMins = Math.floor((daylightMs % (1000 * 60 * 60)) / (1000 * 60));

  // Sun position calculation across the sky (0 to 1)
  const totalDayTime = sunsetDate.getTime() - sunriseDate.getTime();
  const currentProgressTime = now.getTime() - sunriseDate.getTime();
  let sunProgress = 0;
  if (totalDayTime > 0) {
    sunProgress = Math.min(Math.max(currentProgressTime / totalDayTime, 0), 1);
  }

  // Calculate sun position on SVG arc (arc from (30, 90) to (270, 90) with apex at (150, 20))
  // Parametric ellipse arc:
  const angle = Math.PI * (1 - sunProgress);
  const sunX = 150 + 120 * Math.cos(angle);
  const sunY = 95 - 75 * Math.sin(angle);

  const getUvDescriptor = (val: number) => {
    if (val <= 2) return { label: 'Low', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    if (val <= 5) return { label: 'Moderate', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    if (val <= 7) return { label: 'High', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
    if (val <= 10) return { label: 'Very High', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
    return { label: 'Extreme', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' };
  };

  const uvInfo = uvMax !== undefined ? getUvDescriptor(uvMax) : null;

  return (
    <div
      id="solar-uv-telemetry-card"
      className="w-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/30 dark:shadow-none backdrop-blur-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400 flex items-center justify-center shadow-xs">
            <Orbit size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Solar Arc & Radiation Telemetry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Astronomical solar progression and UV radiation index
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          Daylight: {daylightHours}h {daylightMins}m
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Solar Arc graphic */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <div className="w-full max-w-[340px] relative">
            <svg viewBox="0 0 300 120" className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#eab308" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Base Horizon Line */}
              <line
                x1="20"
                y1="95"
                x2="280"
                y2="95"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Celestial Arc */}
              <path
                d="M 30 95 A 120 75 0 0 1 270 95"
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Current Sun Position */}
              <circle
                cx={sunX}
                cy={sunY}
                r="7"
                className="fill-amber-400 stroke-white dark:stroke-slate-900 shadow-md"
                strokeWidth="2.5"
              />
              <circle
                cx={sunX}
                cy={sunY}
                r="12"
                className="fill-amber-400/25 animate-ping"
              />
            </svg>

            {/* Sunrise and Sunset Labels */}
            <div className="flex items-center justify-between text-xs mt-1 px-1">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                <Sunrise size={16} />
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">Dawn</span>
                  <span>{sunriseTimeFormatted}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                {sunProgress > 0 && sunProgress < 1 ? 'Sun Above Horizon' : 'Sun Below Horizon'}
              </div>

              <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold text-right">
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">Dusk</span>
                  <span>{sunsetTimeFormatted}</span>
                </div>
                <Sunset size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: UV Index & Atmospheric Moisture */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {/* UV Index metric */}
          {uvMax !== undefined && uvInfo && (
            <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                  Peak UV Radiation
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {uvMax.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Index</span>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold border ${uvInfo.color}`}
              >
                {uvInfo.label}
              </span>
            </div>
          )}

          {/* Peak Precipitation Risk */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Precipitation Potential
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {precipProbMax !== undefined ? `${precipProbMax}%` : '0%'}
                </span>
                {precipSum !== undefined && precipSum > 0 && (
                  <span className="text-xs text-slate-500 font-medium font-mono">
                    ({precipSum.toFixed(1)} mm)
                  </span>
                )}
              </div>
            </div>

            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-lg bg-sky-500/10">
              {precipProbMax && precipProbMax > 40 ? 'Rain Likely' : 'Minimal Chance'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
