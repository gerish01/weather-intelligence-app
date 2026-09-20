import { WeatherRecommendation } from '../types';

export type WeatherCategory = 'clear' | 'clouds' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';

export interface WeatherCodeInfo {
  label: string;
  description: string;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudSnow' | 'CloudLightning' | 'Tornado';
  category: WeatherCategory;
}

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        description: 'Bright sunshine with virtually no cloud cover.',
        iconName: 'Sun',
        category: 'clear',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        description: 'Scattered fair-weather clouds with plenty of sunshine.',
        iconName: 'CloudSun',
        category: 'clear',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Sun interspersed with moderate cloud patches.',
        iconName: 'CloudSun',
        category: 'clouds',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Dense gray cloud blanket covering the sky.',
        iconName: 'Cloud',
        category: 'clouds',
      };
    case 45:
    case 48:
      return {
        label: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
        description: 'Low-lying mist causing reduced visibility.',
        iconName: 'CloudFog',
        category: 'fog',
      };
    case 51:
      return {
        label: 'Light Drizzle',
        description: 'Gentle, fine mist-like precipitation.',
        iconName: 'CloudDrizzle',
        category: 'drizzle',
      };
    case 53:
      return {
        label: 'Moderate Drizzle',
        description: 'Steady fine mist with dampened streets.',
        iconName: 'CloudDrizzle',
        category: 'drizzle',
      };
    case 55:
      return {
        label: 'Dense Drizzle',
        description: 'Heavy drizzle with noticeably wet conditions.',
        iconName: 'CloudDrizzle',
        category: 'drizzle',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Sub-zero freezing drizzle causing glaze or ice sheets.',
        iconName: 'CloudSnow',
        category: 'snow',
      };
    case 61:
      return {
        label: 'Slight Rain',
        description: 'Intermittent light rain showers.',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Consistent, steady rain throughout the area.',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Heavy downpours with potential water pooling.',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Hazardous freezing rain forming black ice.',
        iconName: 'CloudSnow',
        category: 'snow',
      };
    case 71:
      return {
        label: 'Slight Snowfall',
        description: 'Gentle snowflakes drifting with light accumulation.',
        iconName: 'CloudSnow',
        category: 'snow',
      };
    case 73:
      return {
        label: 'Moderate Snow',
        description: 'Steady snowfall building snowbanks.',
        iconName: 'CloudSnow',
        category: 'snow',
      };
    case 75:
      return {
        label: 'Heavy Snow',
        description: 'Heavy blizzard-like snowfall with poor visibility.',
        iconName: 'CloudSnow',
        category: 'snow',
      };
    case 77:
      return {
        label: 'Snow Grains',
        description: 'Crisp, microscopic ice pellets.',
        iconName: 'CloudSnow',
        category: 'snow',
      };
    case 80:
      return {
        label: 'Slight Rain Showers',
        description: 'Passing brief rain showers.',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 81:
      return {
        label: 'Moderate Showers',
        description: 'Periodic brisk showers with sudden bursts.',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 82:
      return {
        label: 'Violent Showers',
        description: 'Intense, torrential cloudbursts.',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Sudden flurry squalls of snow.',
        iconName: 'CloudSnow',
        category: 'snow',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Lightning, thunder, and gusty wind squalls.',
        iconName: 'CloudLightning',
        category: 'thunderstorm',
      };
    case 96:
    case 99:
      return {
        label: 'Severe Thunderstorm & Hail',
        description: 'Violent squall line with thunder and destructive hail pellets.',
        iconName: 'CloudLightning',
        category: 'thunderstorm',
      };
    default:
      return {
        label: 'Variable Conditions',
        description: 'Standard atmospheric conditions observed.',
        iconName: 'CloudSun',
        category: 'clouds',
      };
  }
}

export function generateRecommendations(
  weatherCode: number,
  tempC: number,
  windSpeedKmH: number,
  highC: number,
  lowC: number
): WeatherRecommendation {
  const codeInfo = getWeatherCodeInfo(weatherCode);

  let summary = 'Great conditions for general daily plans.';
  let outfit = 'Comfortable casual wear with light footwear.';
  let activity = 'Optimal for walking, running, and outdoor gatherings.';
  let commute = 'Clean transit corridors with standard travel times.';
  const gear: string[] = [];
  let warning: string | undefined = undefined;
  let badgeVariant: WeatherRecommendation['badge']['variant'] = 'emerald';
  let badgeLabel = 'Favorable Outdoors';

  // Precipitation check
  if (codeInfo.category === 'rain' || codeInfo.category === 'drizzle') {
    summary = 'Precipitation active. Carry rain gear and plan indoor alternatives.';
    outfit = 'Waterproof jacket or trench coat with water-resistant footwear.';
    activity = 'Indoor visits, cafes, museums, or covered sport arenas recommended.';
    commute = 'Allow an extra 10-15 minutes for wet pavement and reduced vehicle braking distances.';
    gear.push('Sturdy Umbrella', 'Water-repellent Jacket', 'Compact Towel');
    badgeVariant = 'blue';
    badgeLabel = 'Rain Preparedness';
  } else if (codeInfo.category === 'thunderstorm') {
    summary = 'Thunderstorm alert. Seek sheltered structures and stay indoors.';
    outfit = 'Heavy weather-resistant clothing and secure closed-toe boots.';
    activity = 'Indoor leisure only. Avoid open fields, elevated balconies, and waterways.';
    commute = 'Delay non-essential driving during peak squalls; watch for flash ponding.';
    warning = 'Lightning risk: Stay away from tall isolated trees and metal railings.';
    gear.push('Emergency Umbrella', 'Waterproof Shell', 'Mobile Powerbank');
    badgeVariant = 'rose';
    badgeLabel = 'Severe Storm Alert';
  } else if (codeInfo.category === 'snow') {
    summary = 'Wintry snowfall. Bundle up in thermal insulation and watch your footing.';
    outfit = 'Insulated down parka, wool thermal base layers, beanie, and winter boots with grip.';
    activity = 'Winter photography, cozy indoor activities, or skiing if prepared.';
    commute = 'Check road de-icing updates; expect delays on transit and bus routes.';
    gear.push('Insulated Gloves', 'Wool Beanie', 'Thermal Flask', 'Traction Footwear');
    badgeVariant = 'indigo';
    badgeLabel = 'Wintry Conditions';
  } else if (codeInfo.category === 'fog') {
    summary = 'Reduced visibility from fog banks. Exercise caution while traveling.';
    outfit = 'Warm breathable layer to ward off damp chill.';
    activity = 'Local strolls or cozy indoor venues; scenic vista views may be obscured.';
    commute = 'Use low-beam headlights or fog lamps; double following distance.';
    gear.push('Reflective Gear', 'Windbreaker');
    badgeVariant = 'amber';
    badgeLabel = 'Low Visibility';
  }

  // Temperature nuances
  if (tempC < 5) {
    outfit += ' Pair with thick socks and a warm fleece scarf.';
    if (!gear.includes('Insulated Gloves')) gear.push('Gloves & Scarf');
    if (tempC < 0) {
      warning = 'Freezing temperatures: watch for black ice on footpaths and bridge decks.';
    }
  } else if (tempC >= 28) {
    summary = 'Hot sunny weather. Stay well-hydrated and seek shaded intervals.';
    outfit = 'Lightweight breathable cotton or linen in bright reflective shades.';
    activity = 'Plan high-exertion workouts for early morning or post-sunset.';
    gear.push('SPF 50 Sunscreen', 'UV400 Sunglasses', 'Hydration Bottle');
    badgeVariant = 'amber';
    badgeLabel = 'High Heat Index';
  } else if (codeInfo.category === 'clear' || codeInfo.category === 'clouds') {
    gear.push('UV Sunglasses', 'Refillable Water Bottle');
    if (highC - lowC > 10) {
      outfit += ' Dress in layered separates as temperatures swing across the day.';
    }
  }

  // Wind check
  if (windSpeedKmH > 35) {
    commute += ' High crosswinds reported; grip bicycle and motorcycle handles firmly.';
    if (!gear.includes('Windbreaker')) gear.push('Windbreaker Outerwear');
    if (windSpeedKmH > 50) {
      warning = 'High wind advisory: secure loose terrace items and avoid scaffolding.';
      badgeVariant = 'rose';
      badgeLabel = 'High Wind Warning';
    }
  }

  return {
    summary,
    outfit,
    activity,
    commute,
    gear: Array.from(new Set(gear)),
    warning,
    badge: {
      label: badgeLabel,
      variant: badgeVariant,
    },
  };
}

export function convertCelsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function formatTemp(tempC: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    return `${convertCelsiusToFahrenheit(tempC)}°F`;
  }
  return `${Math.round(tempC)}°C`;
}
