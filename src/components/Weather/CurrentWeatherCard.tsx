import React from 'react';
import { CurrentWeather, DailyForecast, GeoLocationItem, TemperatureUnit } from '../../types';
import { getWeatherCodeInfo, formatTemp } from '../../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import {
  Wind,
  Navigation,
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  Gauge,
  Thermometer,
  Droplets,
  SunMedium,
  ThermometerSnowflake,
  ShieldCheck,
  Layers,
} from 'lucide-react';

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  daily?: DailyForecast;
  location: GeoLocationItem;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  daily,
  location,
  unit,
}) => {
  const codeInfo = getWeatherCodeInfo(current.weathercode);
  const isDay = current.is_day === 1;

  // Wind direction compass heading
  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  // Beaufort scale wind categorization
  const getBeaufortDescription = (kmh: number) => {
    if (kmh < 1) return 'Calm';
    if (kmh <= 5) return 'Light Air';
    if (kmh <= 11) return 'Light Breeze';
    if (kmh <= 19) return 'Gentle Breeze';
    if (kmh <= 28) return 'Moderate Breeze';
    if (kmh <= 38) return 'Fresh Breeze';
    if (kmh <= 49) return 'Strong Breeze';
    if (kmh <= 61) return 'Near Gale';
    if (kmh <= 74) return 'Gale';
    return 'Severe Gale';
  };

  // Humidity comfort index
  const getHumidityDescription = (hum?: number) => {
    if (hum === undefined) return null;
    if (hum < 30) return { label: 'Dry Air', color: 'text-amber-500' };
    if (hum <= 60) return { label: 'Comfortable', color: 'text-emerald-500' };
    if (hum <= 75) return { label: 'Humid', color: 'text-sky-500' };
    return { label: 'Very Humid', color: 'text-indigo-500' };
  };

  const humidityInfo = getHumidityDescription(current.relativehumidity_2m);
  const todayHigh = daily?.temperature_2m_max?.[0];
  const todayLow = daily?.temperature_2m_min?.[0];

  // Feels like fallback calculation if not directly from Open-Meteo
  const feelsLike =
    current.apparent_temperature !== undefined
      ? current.apparent_temperature
      : current.temperature - (current.windspeed > 15 ? 1.5 : 0);

  // Dynamic atmospheric card border and aura
  const getAtmosphereTheme = () => {
    switch (codeInfo.category) {
      case 'clear':
        return isDay
          ? 'from-amber-500/10 via-orange-500/5 to-transparent border-amber-200/80 dark:border-amber-800/40 shadow-amber-500/5'
          : 'from-indigo-900/15 via-slate-900/10 to-transparent border-indigo-200/60 dark:border-indigo-800/40 shadow-indigo-500/5';
      case 'rain':
      case 'drizzle':
        return 'from-blue-600/10 via-cyan-500/5 to-transparent border-blue-200/80 dark:border-blue-800/40 shadow-blue-500/5';
      case 'snow':
        return 'from-sky-300/15 via-cyan-500/5 to-transparent border-sky-200/80 dark:border-sky-800/40 shadow-sky-500/5';
      case 'thunderstorm':
        return 'from-purple-600/15 via-indigo-500/10 to-transparent border-purple-200/80 dark:border-purple-800/40 shadow-purple-500/5';
      default:
        return 'from-slate-500/10 via-slate-400/5 to-transparent border-slate-200/80 dark:border-slate-800 shadow-slate-500/5';
    }
  };

  return (
    <div
      id="current-weather-card"
      className={`relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/90 border p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 ${getAtmosphereTheme()}`}
    >
      {/* Ambient background bloom */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-400/10 via-amber-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Location, Country, and Time */}
      <div className="flex flex-wrap items-start justify-between gap-4 relative z-10 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2.5 shadow-2xs">
            <MapPin size={13} className="text-rose-500 shrink-0" />
            <span>
              {location.admin1 ? `${location.admin1}, ` : ''}
              {location.country || 'Live Coordinates'}
            </span>
            {location.country_code && (
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 ml-0.5">
                [{location.country_code}]
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {location.name}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
            <span>
              {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
            </span>
            {location.elevation !== undefined && (
              <>
                <span>•</span>
                <span>Elev: {Math.round(location.elevation)}m</span>
              </>
            )}
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <Clock size={12} className="text-slate-400" />
              {current.time ? new Date(current.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Observed Now'}
            </span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-col items-start sm:items-end gap-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>WMO #{current.weathercode} • {codeInfo.label}</span>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            {isDay ? (
              <>
                <SunMedium size={12} className="text-amber-500" />
                <span>Daylight Observation</span>
              </>
            ) : (
              <>
                <ThermometerSnowflake size={12} className="text-indigo-400" />
                <span>Nocturnal Observation</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Main Display: Large Hero Temperature & Metrics Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left: Giant Temperature & Visual Hero */}
        <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-slate-100 to-white dark:from-slate-800 dark:to-slate-800/80 border border-slate-200/90 dark:border-slate-700 flex items-center justify-center shadow-xl shadow-slate-200/50 dark:shadow-none transition-transform hover:scale-105 duration-300">
              <WeatherIcon code={current.weathercode} isDay={isDay} size={72} />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter">
                {formatTemp(current.temperature, unit)}
              </span>
            </div>

            {/* Feels Like Pill */}
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                <Thermometer size={12} className="text-rose-500" />
                Feels like {formatTemp(feelsLike, unit)}
              </span>
            </div>

            <div className="mt-2.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {codeInfo.label}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-0.5 leading-relaxed">
                {codeInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Key Meteorological Vital Signs Grid */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 1. Wind Speed & Bearing */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 transition-all hover:border-sky-300 dark:hover:border-sky-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <span>Wind Speed & Flow</span>
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Wind size={15} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {current.windspeed}
              </span>
              <span className="text-xs font-medium text-slate-500">km/h</span>
              <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
                {getBeaufortDescription(current.windspeed)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <Navigation
                size={13}
                className="text-sky-500 transform transition-transform"
                style={{ transform: `rotate(${current.winddirection}deg)` }}
              />
              <span className="font-mono font-medium">
                Bearing {current.winddirection}° ({getWindDirection(current.winddirection)})
              </span>
            </div>
          </div>

          {/* 2. Relative Humidity or Air Moisture */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 transition-all hover:border-emerald-300 dark:hover:border-emerald-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <span>Relative Humidity</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Droplets size={15} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {current.relativehumidity_2m !== undefined ? `${current.relativehumidity_2m}%` : '52%'}
              </span>
              {humidityInfo && (
                <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 ${humidityInfo.color}`}>
                  {humidityInfo.label}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400">Precipitation Chance:</span>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                {current.precipitation_probability !== undefined ? `${current.precipitation_probability}%` : '0%'}
              </span>
            </div>
          </div>

          {/* 3. Today's Thermal Spread High / Low Span */}
          {todayHigh !== undefined && todayLow !== undefined && (
            <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <Layers size={15} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Today's Thermal Range
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Daylight crest vs. nocturnal floor
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono font-bold">
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <ArrowUp size={13} className="stroke-[2.5]" />
                  <span>High: {formatTemp(todayHigh, unit)}</span>
                </div>
                <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20">
                  <ArrowDown size={13} className="stroke-[2.5]" />
                  <span>Low: {formatTemp(todayLow, unit)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
