# Weather Intelligence App (Level 2)

A modern, high-precision Weather Intelligence web application built with React, Vite, TypeScript, and Tailwind CSS using public Open-Meteo APIs.

## Features

- **Live Geocoding & City Search:** Search any global city with instant autocomplete, matching coordinates, country tags, and recent search history.
- **GPS Coordinates Detection:** One-click device geolocation support for local forecasts.
- **Current Meteorological Vital Signs:** Real-time temperature, apparent ("feels like") temperature, relative humidity comfort index, and Beaufort-scale wind flow with dynamic compass bearings.
- **24-Hour Atmospheric Timeline:** Hourly forecast carousel displaying temperature progression and precipitation probability (`💧 %`).
- **Astronomical Solar Arc & UV Index:** Celestial tracking of sunrise/sunset, daylight duration, and peak UV index ratings.
- **7-Day Synoptic Outlook & Temperature Spline:** Interactive cubic Bézier spline curve chart with hover inspections alongside 7-day daily forecast cards.
- **Intelligent Activity & Gear Advisories:** Contextual recommendations for outfits, commutes, outdoor activities, and weather alerts.
- **Dynamic Theming:** Condition-reactive ambient atmospheric lighting, seamless Dark/Light mode toggle, and persistent Celsius/Fahrenheit switching.

## Tech Stack

- **Framework:** React 18+ & Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (with custom dark mode variant)
- **Icons:** Lucide React
- **Data Provider:** [Open-Meteo](https://open-meteo.com/) (Zero-key public REST endpoints)

## API Integration

- **Geocoding API:** `https://geocoding-api.open-meteo.com/v1/search`
- **Forecast API:** `https://api.open-meteo.com/v1/forecast`

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build