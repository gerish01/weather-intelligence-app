export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface GeoLocationItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
}

export interface GeocodingResponse {
  results?: GeoLocationItem[];
  generationtime_ms?: number;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
  // Enhanced telemetry
  apparent_temperature?: number;
  relativehumidity_2m?: number;
  precipitation_probability?: number;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  relativehumidity_2m?: number[];
  apparent_temperature?: number[];
  precipitation_probability?: number[];
  weathercode: number[];
  is_day?: number[];
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max?: number[];
  precipitation_sum?: number[];
  uv_index_max?: number[];
  sunrise?: string[];
  sunset?: string[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather?: CurrentWeather;
  hourly?: HourlyForecast;
  daily?: DailyForecast;
}

export interface WeatherRecommendation {
  summary: string;
  outfit: string;
  activity: string;
  commute: string;
  gear: string[];
  warning?: string;
  badge: {
    label: string;
    variant: 'emerald' | 'amber' | 'blue' | 'rose' | 'indigo';
  };
}
