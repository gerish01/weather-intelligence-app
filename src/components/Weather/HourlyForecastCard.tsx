import React, { useRef } from 'react';
import { HourlyForecast, TemperatureUnit } from '../../types';
import { formatTemp, getWeatherCodeInfo } from '../../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { Clock, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';

interface HourlyForecastCardProps {
  hourly: HourlyForecast;
  unit: TemperatureUnit;
  currentTimeStr?: string;
}

export const HourlyForecastCard: React.FC<HourlyForecastCardProps> = ({
  hourly,
  unit,
  currentTimeStr,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!hourly.time || hourly.time.length === 0) return null;

  // Find index closest to now
  let startIndex = 0;
  if (currentTimeStr) {
    const currentPrefix = currentTimeStr.substring(0, 13);
    const found = hourly.time.findIndex((t) => t.startsWith(currentPrefix));
    if (found !== -1) startIndex = found;
  }

  // Slice next 24 hours
  const next24 = hourly.time.slice(startIndex, startIndex + 24);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const formatHourLabel = (dateStr: string, index: number) => {
    if (index === 0) return 'Now';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  };

  return (
    <div
      id="hourly-forecast-section"
      className="w-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/30 dark:shadow-none backdrop-blur-md transition-all"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-sky-400/20 dark:text-sky-400 flex items-center justify-center shadow-xs">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              24-Hour Atmospheric Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hour-by-hour temperature progression and precipitation chances
            </p>
          </div>
        </div>

        {/* Scroll navigation arrows */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={scrollLeft}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
            aria-label="Scroll hourly forecast backward"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
            aria-label="Scroll hourly forecast forward"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto pb-3 custom-scrollbar scroll-smooth"
      >
        {next24.map((timeStr, i) => {
          const globalIdx = startIndex + i;
          const temp = hourly.temperature_2m?.[globalIdx] ?? 0;
          const code = hourly.weathercode?.[globalIdx] ?? 0;
          const isDay = hourly.is_day?.[globalIdx] !== undefined ? hourly.is_day[globalIdx] === 1 : true;
          const precipProb = hourly.precipitation_probability?.[globalIdx];
          const codeInfo = getWeatherCodeInfo(code);
          const isNow = i === 0;

          return (
            <div
              key={timeStr}
              className={`shrink-0 flex flex-col items-center justify-between w-[96px] py-3.5 px-2 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
                isNow
                  ? 'bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/40 dark:to-slate-800/80 border-sky-400 dark:border-sky-500/60 shadow-md ring-2 ring-sky-400/20'
                  : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {/* Hour time label */}
              <span
                className={`text-xs font-bold block mb-2 ${
                  isNow
                    ? 'text-sky-600 dark:text-sky-400 font-extrabold'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {formatHourLabel(timeStr, i)}
              </span>

              {/* Weather icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2">
                <WeatherIcon code={code} isDay={isDay} size={24} />
              </div>

              {/* Hourly Temperature */}
              <span className="text-sm font-black text-slate-900 dark:text-white font-mono mb-1.5">
                {formatTemp(temp, unit)}
              </span>

              {/* Precipitation probability pill */}
              {precipProb !== undefined && precipProb > 0 ? (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  <Droplets size={10} className="text-sky-500" />
                  {precipProb}%
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 text-center px-1">
                  {codeInfo.label.split(' ')[0]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
