import { GeocodingResponse, GeoLocationItem, ForecastResponse } from '../types';

export class WeatherApiError extends Error {
  constructor(message: string, public code: 'EMPTY_INPUT' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'INVALID_DATA') {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/**
 * Geocodes a city name using Open-Meteo Geocoding API
 */
export async function searchCity(query: string, signal?: AbortSignal): Promise<GeoLocationItem[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new WeatherApiError('Please enter a city name to search.', 'EMPTY_INPUT');
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new WeatherApiError(
        `Failed to geocode city: Server returned HTTP ${response.status}`,
        'NETWORK_ERROR'
      );
    }

    const data: GeocodingResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new WeatherApiError(
        `City "${trimmed}" not found. Please check spelling or try a nearby major city.`,
        'NOT_FOUND'
      );
    }

    return data.results;
  } catch (error: unknown) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new WeatherApiError(
      'Unable to connect to Open-Meteo services. Please check your network connection.',
      'NETWORK_ERROR'
    );
  }
}

/**
 * Fetches current weather, 24-hr hourly trend, and 7-day forecast data from Open-Meteo
 */
export async function fetchForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<ForecastResponse> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new WeatherApiError(
        `Weather forecast unavailable: Server returned HTTP ${response.status}`,
        'NETWORK_ERROR'
      );
    }

    const data: ForecastResponse = await response.json();

    if (!data.current_weather || !data.daily || !data.daily.time || data.daily.time.length === 0) {
      throw new WeatherApiError(
        'Weather information is incomplete for this location.',
        'INVALID_DATA'
      );
    }

    // Match current hour telemetry from hourly data if available
    if (data.current_weather && data.hourly?.time) {
      const currentTime = data.current_weather.time;
      let matchedIndex = data.hourly.time.indexOf(currentTime);
      if (matchedIndex === -1 && currentTime) {
        // Try matching by prefix YYYY-MM-DDTHH
        const currentHourPrefix = currentTime.substring(0, 13);
        matchedIndex = data.hourly.time.findIndex((t) => t.startsWith(currentHourPrefix));
      }

      if (matchedIndex !== -1) {
        if (data.hourly.apparent_temperature?.[matchedIndex] !== undefined) {
          data.current_weather.apparent_temperature = data.hourly.apparent_temperature[matchedIndex];
        }
        if (data.hourly.relativehumidity_2m?.[matchedIndex] !== undefined) {
          data.current_weather.relativehumidity_2m = data.hourly.relativehumidity_2m[matchedIndex];
        }
        if (data.hourly.precipitation_probability?.[matchedIndex] !== undefined) {
          data.current_weather.precipitation_probability = data.hourly.precipitation_probability[matchedIndex];
        }
      }
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new WeatherApiError(
      'Failed to load weather forecast. Please check your network connection and retry.',
      'NETWORK_ERROR'
    );
  }
}
