/**
 * @file helpers.js
 * @description Utility functions for formatting, DOM manipulation, and date calculations.
 */

/**
 * Format timestamp into standard readable strings
 */
export function formatDate(dateObj, options = {}) {
  const defaultOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj);
}

/**
 * Convert wind direction degrees to cardinal compass points
 */
export function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Weather condition SVG generator based on code type
 */
export function getWeatherIconSVG(iconType) {
  switch (iconType) {
    case 'sun':
      return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>`;
    case 'cloud-sun':
      return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M16 5l1.41 1.41"/><path d="M17.5 19B4.5 4.5 0 0 0 18 10a7 7 0 0 0-13.61 2.09A4.5 4.5 0 0 0 6.5 19z"/></svg>`;
    case 'rain':
    case 'heavy-rain':
      return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M16 13v8M8 13v8M12 15v8"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`;
    default:
      return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M17.5 19A4.5 4.5 0 0 0 18 10a7 7 0 0 0-13.61 2.09A4.5 4.5 0 0 0 6.5 19z"/></svg>`;
  }
}