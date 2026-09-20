import React, { useState, useEffect, useRef } from 'react';
import {
  GeoLocationItem,
  ForecastResponse,
  TemperatureUnit,
  WeatherRecommendation,
} from '../../types';
import { searchCity, fetchForecast, WeatherApiError } from '../../services/weatherApi';
import { generateRecommendations, getWeatherCodeInfo } from '../../utils/weatherCodes';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { HourlyForecastCard } from './HourlyForecastCard';
import { ForecastCard } from './ForecastCard';
import { TemperatureChart } from './TemperatureChart';
import { SolarCard } from './SolarCard';
import { RecommendationsCard } from './RecommendationsCard';
import { AtmosphericCanvas } from './AtmosphericCanvas';
import {
  Search,
  MapPin,
  Compass,
  AlertCircle,
  RefreshCw,
  X,
  ChevronRight,
  Sparkles,
  History,
  RotateCcw,
} from 'lucide-react';

const FEATURED_CITIES: { name: string; country: string; lat: number; lon: number; flag: string }[] = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lon: 139.6917, flag: '🇯🇵' },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006, flag: '🇺🇸' },
  { name: 'London', country: 'United Kingdom', lat: 51.5085, lon: -0.1257, flag: '🇬🇧' },
  { name: 'Paris', country: 'France', lat: 48.8534, lon: 2.3488, flag: '🇫🇷' },
  { name: 'Sydney', country: 'Australia', lat: -33.8678, lon: 151.2073, flag: '🇦🇺' },
  { name: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194, flag: '🇺🇸' },
  { name: 'Singapore', country: 'Singapore', lat: 1.2897, lon: 103.8501, flag: '🇸🇬' },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708, flag: '🇦🇪' },
];

interface WeatherDashboardProps {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  isDark: boolean;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ unit, setUnit, isDark }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<GeoLocationItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [currentLocation, setCurrentLocation] = useState<GeoLocationItem | null>(null);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [recommendations, setRecommendations] = useState<WeatherRecommendation | null>(null);

  // Recent searches persisted in localStorage
  const [recentSearches, setRecentSearches] = useState<GeoLocationItem[]>(() => {
    try {
      const saved = localStorage.getItem('weather_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save recent searches to localStorage
  const addRecentSearch = (loc: GeoLocationItem) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.latitude !== loc.latitude || item.longitude !== loc.longitude
      );
      const updated = [loc, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Initial load: Default to London
  useEffect(() => {
    loadLocationWeather(
      {
        id: 2643743,
        name: 'London',
        country: 'United Kingdom',
        latitude: 51.50853,
        longitude: -0.12574,
      },
      false
    );
  }, []);

  // Load weather for a given geolocated item
  const loadLocationWeather = async (loc: GeoLocationItem, closeSearch = true) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setErrorMessage(null);

    if (closeSearch) {
      setShowDropdown(false);
      setSearchQuery(`${loc.name}${loc.country ? `, ${loc.country}` : ''}`);
    }

    try {
      const data = await fetchForecast(loc.latitude, loc.longitude, controller.signal);
      setCurrentLocation(loc);
      setForecastData(data);
      addRecentSearch(loc);

      if (data.current_weather && data.daily) {
        const todayHigh = data.daily.temperature_2m_max?.[0] ?? data.current_weather.temperature;
        const todayLow = data.daily.temperature_2m_min?.[0] ?? data.current_weather.temperature;

        const recs = generateRecommendations(
          data.current_weather.weathercode,
          data.current_weather.temperature,
          data.current_weather.windspeed,
          todayHigh,
          todayLow
        );
        setRecommendations(recs);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      if (err instanceof WeatherApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to retrieve forecast data. Please check your network connection and retry.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle City Search Form Submit calling Open-Meteo Geocoding API
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a city name to search.');
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearchingGeocode(true);
    setErrorMessage(null);

    try {
      const results = await searchCity(trimmed);
      setSearchResults(results);
      if (results.length === 1) {
        // Direct single hit, load immediately
        loadLocationWeather(results[0]);
      } else {
        setShowDropdown(true);
      }
    } catch (err: unknown) {
      if (err instanceof WeatherApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(`City "${trimmed}" could not be found. Please verify spelling.`);
      }
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  // Browser Geolocation
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser environment.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const customLoc: GeoLocationItem = {
          id: Date.now(),
          name: 'Current Coordinates',
          latitude: lat,
          longitude: lon,
        };
        await loadLocationWeather(customLoc, false);
        setSearchQuery('Current Location');
      },
      (geoErr) => {
        setIsLoading(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setErrorMessage('Location permission was denied. You can still search for any city.');
        } else {
          setErrorMessage('Unable to retrieve device coordinates. Please search for a city above.');
        }
      },
      { timeout: 10000 }
    );
  };

  const weatherCategory = forecastData?.current_weather
    ? getWeatherCodeInfo(forecastData.current_weather.weathercode).category
    : 'clear';
  const isDay = forecastData?.current_weather ? forecastData.current_weather.is_day === 1 : true;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 sm:space-y-8 relative">
      {/* Ambient Atmospheric Backdrop */}
      <AtmosphericCanvas category={weatherCategory} isDay={isDay} isDark={isDark} />

      {/* Top Search & Controls Section */}
      <div className="relative z-30 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/30 dark:shadow-none backdrop-blur-xl">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Geocoding Search Input Field */}
          <div className="relative flex-1" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
                <Search size={19} />
              </div>

              <input
                id="city-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Search any global city (e.g. Tokyo, New York, Zurich, Sydney)..."
                className="w-full pl-11 pr-28 py-3.5 rounded-2xl text-sm font-medium bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 transition-all shadow-inner"
              />

              {searchQuery && (
                <button
                  type="button"
                  id="clear-search-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowDropdown(false);
                  }}
                  className="absolute right-24 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 transition-colors cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="submit"
                id="search-city-button"
                disabled={isSearchingGeocode || isLoading}
                className="absolute right-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-sky-500/25 cursor-pointer"
              >
                {isSearchingGeocode ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Searching</span>
                  </>
                ) : (
                  <>
                    <span>Search</span>
                  </>
                )}
              </button>
            </form>

            {/* Geocoding Matching Results Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                <div className="px-4 py-2.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between">
                  <span>Matching Locations ({searchResults.length})</span>
                  <span className="text-[10px] lowercase text-slate-400">click to load forecast</span>
                </div>
                {searchResults.map((item) => (
                  <button
                    key={`${item.id}-${item.latitude}-${item.longitude}`}
                    type="button"
                    onClick={() => loadLocationWeather(item)}
                    className="w-full text-left px-4 py-3 text-xs hover:bg-sky-50/70 dark:hover:bg-slate-800/70 flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin size={15} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {item.name}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {item.admin1 ? `${item.admin1}, ` : ''}
                          {item.country || 'Coordinates'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1 group-hover:text-sky-500 transition-colors">
                      {item.latitude.toFixed(1)}°N, {item.longitude.toFixed(1)}°E
                      <ChevronRight size={14} />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons: GPS Location & Refresh */}
          <div className="flex items-center gap-2.5 shrink-0 justify-end">
            <button
              type="button"
              id="geolocation-weather-btn"
              onClick={handleUseGeolocation}
              disabled={isLoading}
              className="px-3.5 py-3 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 transition-all disabled:opacity-50 shadow-2xs cursor-pointer"
              title="Detect device coordinates"
            >
              <Compass size={16} className="text-sky-500" />
              <span className="hidden sm:inline">Use My Location</span>
              <span className="sm:hidden">GPS</span>
            </button>

            {currentLocation && (
              <button
                type="button"
                id="refresh-forecast-btn"
                onClick={() => loadLocationWeather(currentLocation, false)}
                disabled={isLoading}
                className="p-3 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center transition-all disabled:opacity-50 shadow-2xs cursor-pointer"
                title="Refresh current forecast"
                aria-label="Refresh forecast"
              >
                <RotateCcw size={16} className={isLoading ? 'animate-spin text-sky-500' : ''} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Pick Featured Cities */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto pb-1 text-xs custom-scrollbar">
          <span className="text-slate-400 dark:text-slate-500 font-bold whitespace-nowrap flex items-center gap-1.5 mr-1">
            <Sparkles size={14} className="text-amber-500" />
            Quick picks:
          </span>
          {FEATURED_CITIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => {
                loadLocationWeather({
                  id: Math.random(),
                  name: c.name,
                  country: c.country,
                  latitude: c.lat,
                  longitude: c.lon,
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/40 dark:hover:text-sky-300 border border-slate-200/60 dark:border-slate-700/60 transition-all font-medium whitespace-nowrap shadow-2xs cursor-pointer"
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Recent Search History if any */}
        {recentSearches.length > 0 && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/50 overflow-x-auto text-xs custom-scrollbar">
            <span className="text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
              <History size={13} /> Recent:
            </span>
            {recentSearches.map((item) => (
              <button
                key={`${item.latitude}-${item.longitude}`}
                type="button"
                onClick={() => loadLocationWeather(item)}
                className="text-[11px] text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-300 underline underline-offset-2 whitespace-nowrap cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error state handling (City not found / Empty input / Network failures) */}
      {errorMessage && (
        <div
          id="weather-error-banner"
          className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start justify-between gap-4 text-rose-800 dark:text-rose-200 text-sm shadow-lg shadow-rose-500/5"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="font-bold text-base text-rose-900 dark:text-rose-100">{errorMessage}</p>
              <p className="text-xs text-rose-700/90 dark:text-rose-300/80 mt-1">
                Verify the location spelling or click on any of the featured cities above.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-700 dark:hover:text-rose-100 p-1.5 transition-colors cursor-pointer"
            aria-label="Dismiss error message"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Loading Skeleton with glowing shimmer */}
      {isLoading && (
        <div className="w-full space-y-6 animate-pulse">
          <div className="h-72 bg-slate-200/80 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-800" />
          <div className="h-44 bg-slate-200/80 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-800" />
          <div className="h-80 bg-slate-200/80 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-800" />
          <div className="h-60 bg-slate-200/80 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-800" />
        </div>
      )}

      {/* Weather Content View */}
      {!isLoading && currentLocation && forecastData?.current_weather && (
        <div className="space-y-6 sm:space-y-8">
          {/* 1. Hero Current Weather Card */}
          <CurrentWeatherCard
            current={forecastData.current_weather}
            daily={forecastData.daily}
            location={currentLocation}
            unit={unit}
          />

          {/* 2. 24-Hour Timeline Hourly Carousel */}
          {forecastData.hourly && (
            <HourlyForecastCard
              hourly={forecastData.hourly}
              unit={unit}
              currentTimeStr={forecastData.current_weather.time}
            />
          )}

          {/* 3. 7-Day Temperature Trends Spline Chart */}
          {forecastData.daily && (
            <TemperatureChart daily={forecastData.daily} unit={unit} />
          )}

          {/* 4. 7-Day Forecast Cards */}
          {forecastData.daily && (
            <ForecastCard daily={forecastData.daily} unit={unit} />
          )}

          {/* 5. Astronomical Solar Arc & UV Telemetry */}
          {forecastData.daily && (
            <SolarCard
              daily={forecastData.daily}
              currentTimeStr={forecastData.current_weather.time}
            />
          )}

          {/* 6. Intelligent Planning Recommendations */}
          {recommendations && (
            <RecommendationsCard recommendation={recommendations} />
          )}
        </div>
      )}
    </div>
  );
};
