/**
 * @file config.js
 * @description Central application configuration, API endpoints, and constants.
 */

export const CONFIG = {
  // Free Geo-coding API Endpoint
  GEOCODING_API: 'https://geocoding-api.open-meteo.com/v1/search',
  
  // High-precision Open-Meteo Weather API Endpoint
  WEATHER_API: 'https://api.open-meteo.com/v1/forecast',
  
  // Storage Keys
  THEME_STORAGE_KEY: 'skycast_theme_preference',
  HISTORY_STORAGE_KEY: 'skycast_search_history',
  MAX_HISTORY_ITEMS: 5,

  // Weather Code Mapping based on WMO Standards
  WEATHER_CODES: {
    0: { description: 'Clear Sky', icon: 'sun' },
    1: { description: 'Mainly Clear', icon: 'cloud-sun' },
    2: { description: 'Partly Cloudy', icon: 'cloud-sun' },
    3: { description: 'Overcast', icon: 'cloud' },
    45: { description: 'Foggy', icon: 'fog' },
    48: { description: 'Depositing Rime Fog', icon: 'fog' },
    51: { description: 'Light Drizzle', icon: 'drizzle' },
    61: { description: 'Slight Rain', icon: 'rain' },
    63: { description: 'Moderate Rain', icon: 'rain' },
    65: { description: 'Heavy Rain', icon: 'heavy-rain' },
    71: { description: 'Slight Snow', icon: 'snow' },
    95: { description: 'Thunderstorm', icon: 'thunderstorm' }
  }
};