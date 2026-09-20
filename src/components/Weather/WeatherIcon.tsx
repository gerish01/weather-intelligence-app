import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
} from 'lucide-react';
import { getWeatherCodeInfo } from '../../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  className = '',
  size = 28,
}) => {
  const info = getWeatherCodeInfo(code);

  if (!isDay && info.iconName === 'Sun') {
    return (
      <Moon
        size={size}
        className={`text-indigo-300 dark:text-indigo-200 transition-transform duration-300 hover:rotate-12 ${className}`}
      />
    );
  }

  if (!isDay && info.iconName === 'CloudSun') {
    return (
      <CloudMoon
        size={size}
        className={`text-indigo-300 dark:text-indigo-200 ${className}`}
      />
    );
  }

  switch (info.iconName) {
    case 'Sun':
      return (
        <Sun
          size={size}
          className={`text-amber-500 dark:text-amber-400 transition-transform duration-500 hover:rotate-90 ${className}`}
        />
      );
    case 'CloudSun':
      return (
        <CloudSun
          size={size}
          className={`text-amber-500 dark:text-amber-300 ${className}`}
        />
      );
    case 'Cloud':
      return (
        <Cloud
          size={size}
          className={`text-slate-400 dark:text-slate-300 ${className}`}
        />
      );
    case 'CloudFog':
      return (
        <CloudFog
          size={size}
          className={`text-slate-400 dark:text-slate-300 ${className}`}
        />
      );
    case 'CloudDrizzle':
      return (
        <CloudDrizzle
          size={size}
          className={`text-sky-400 dark:text-sky-300 ${className}`}
        />
      );
    case 'CloudRain':
      return (
        <CloudRain
          size={size}
          className={`text-blue-500 dark:text-blue-400 ${className}`}
        />
      );
    case 'CloudSnow':
      return (
        <CloudSnow
          size={size}
          className={`text-sky-300 dark:text-sky-200 ${className}`}
        />
      );
    case 'CloudLightning':
      return (
        <CloudLightning
          size={size}
          className={`text-yellow-400 dark:text-yellow-300 ${className}`}
        />
      );
    default:
      return (
        <Wind
          size={size}
          className={`text-slate-400 ${className}`}
        />
      );
  }
};
