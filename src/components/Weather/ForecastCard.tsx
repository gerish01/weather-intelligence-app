import React from 'react';
import { DailyForecast, TemperatureUnit } from '../../types';
import { getWeatherCodeInfo, formatTemp } from '../../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { CalendarDays, ArrowUp, ArrowDown, Droplets } from 'lucide-react';

interface ForecastCardProps {
  daily: DailyForecast;
  unit: TemperatureUnit;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ daily, unit }) => {
  const times = daily.time || [];
  const codes = daily.weathercode || [];
  const maxTemps = daily.temperature_2m_max || [];
  const minTemps = daily.temperature_2m_min || [];
  const precipProbs = daily.precipitation_probability_max || [];

  if (times.length === 0) return null;

  // Calculate global min and max for relative temperature bar visualization
  const allTemps = [...maxTemps, ...minTemps];
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const totalRange = Math.max(globalMax - globalMin, 1);

  const formatDayName = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  };

  const formatDateString = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div
      id="seven-day-forecast-section"
      className="w-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/30 dark:shadow-none backdrop-blur-md transition-all"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-sky-400/20 dark:text-sky-400 flex items-center justify-center shadow-xs">
            <CalendarDays size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              7-Day Synoptic Outlook
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily atmospheric outlook with temperature spectrum alignment
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          7 Consecutive Days
        </span>
      </div>

      {/* Grid of 7 forecast cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-3.5">
        {times.slice(0, 7).map((dateStr, index) => {
          const code = codes[index] ?? 0;
          const max = maxTemps[index] ?? 0;
          const min = minTemps[index] ?? 0;
          const precipProb = precipProbs[index];
          const info = getWeatherCodeInfo(code);
          const isToday = index === 0;

          // Bar offset calculation
          const leftPercent = ((min - globalMin) / totalRange) * 100;
          const widthPercent = Math.max(((max - min) / totalRange) * 100, 14);

          return (
            <div
              key={dateStr}
              className={`flex flex-col items-center justify-between p-4 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
                isToday
                  ? 'bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/40 dark:to-slate-800/80 border-sky-400 dark:border-sky-500/60 shadow-md ring-2 ring-sky-400/20'
                  : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              {/* Day & Date Header */}
              <div className="text-center w-full mb-2">
                <span
                  className={`text-xs font-extrabold tracking-tight block ${
                    isToday
                      ? 'text-sky-600 dark:text-sky-400'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {formatDayName(dateStr, index)}
                </span>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 block mt-0.5">
                  {formatDateString(dateStr)}
                </span>
              </div>

              {/* Weather Icon & Code Label */}
              <div className="my-2 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700/60 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform">
                  <WeatherIcon code={code} size={28} />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center line-clamp-1">
                  {info.label}
                </span>

                {/* Rain probability pill */}
                {precipProb !== undefined && precipProb > 0 ? (
                  <span className="inline-flex items-center gap-0.5 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    <Droplets size={10} className="text-sky-500" />
                    {precipProb}%
                  </span>
                ) : (
                  <span className="h-4 mt-1 block" />
                )}
              </div>

              {/* Temperatures: High and Low */}
              <div className="w-full mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
                  <span className="flex items-center text-amber-600 dark:text-amber-400">
                    <ArrowUp size={11} className="mr-0.5 stroke-[2.5]" />
                    {formatTemp(max, unit)}
                  </span>
                  <span className="flex items-center text-sky-600 dark:text-sky-400">
                    <ArrowDown size={11} className="mr-0.5 stroke-[2.5]" />
                    {formatTemp(min, unit)}
                  </span>
                </div>

                {/* Visual Temperature Range Bar */}
                <div className="w-full h-2 bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden relative shadow-inner">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 shadow-xs transition-all duration-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
