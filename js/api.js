/**
 * @file api.js
 * @description Handles raw HTTP requests to Open-Meteo APIs.
 */

import { CONFIG } from './config.js';

/**
 * Fetch latitude & longitude coordinates for a query string
 */
export async function geocodeLocation(query) {
  const url = `${CONFIG.GEOCODING_API}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Geocoding service unavailable.');
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`No location records found for "${query}".`);
  }

  const result = data.results[0];
  return {
    name: result.name,
    country: result.country || '',
    latitude: result.latitude,
    longitude: result.longitude,
    elevation: result.elevation
  };
}

/**
 * Fetch complete weather dataset for specified coordinates
 */
export async function fetchWeatherData(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m',
    hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
    timezone: 'auto'
  });

  const response = await fetch(`${CONFIG.WEATHER_API}?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Unable to retrieve meteorological dataset.');
  }

  return await response.json();
}