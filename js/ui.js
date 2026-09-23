/**
 * @file ui.js
 * @description Manages view updates, skeleton state transitions, and HTML rendering.
 */

import { CONFIG } from './config.js';
import { formatDate, getWindDirection, getWeatherIconSVG } from './helpers.js';

export class UIManager {
  constructor() {
    // View state element caches
    this.stateEmpty = document.getElementById('state-empty');
    this.stateLoading = document.getElementById('state-loading');
    this.stateError = document.getElementById('state-error');
    this.stateDashboard = document.getElementById('state-dashboard');
    
    // History Menu
    this.historyWrapper = document.getElementById('history-wrapper');
    this.historyMenu = document.getElementById('history-menu');
    this.historyList = document.getElementById('history-list');
  }

  /**
   * Switch between app layout states
   */
  setViewState(stateName) {
    this.stateEmpty.classList.add('hidden');
    this.stateLoading.classList.add('hidden');
    this.stateError.classList.add('hidden');
    this.stateDashboard.classList.add('hidden');

    switch (stateName) {
      case 'empty':
        this.stateEmpty.classList.remove('hidden');
        break;
      case 'loading':
        this.stateLoading.classList.remove('hidden');
        break;
      case 'error':
        this.stateError.classList.remove('hidden');
        break;
      case 'dashboard':
        this.stateDashboard.classList.remove('hidden');
        this.stateDashboard.classList.add('fade-in');
        break;
    }
  }

  /**
   * Populate UI widgets with fetched weather payload
   */
  renderDashboard(location, data) {
    const current = data.current;
    const daily = data.daily;
    const codeMeta = CONFIG.WEATHER_CODES[current.weather_code] || { description: 'Clear', icon: 'sun' };

    // Hero Section
    document.getElementById('hero-location-name').textContent = location.name;
    document.getElementById('hero-location-country').textContent = location.country;
    document.getElementById('hero-timestamp').textContent = formatDate(new Date());
    document.getElementById('hero-temp').textContent = Math.round(current.temperature_2m);
    document.getElementById('hero-feels-like').textContent = `${Math.round(current.apparent_temperature)}°`;
    document.getElementById('hero-condition-text').textContent = codeMeta.description;
    document.getElementById('hero-icon').innerHTML = getWeatherIconSVG(codeMeta.icon);
    document.getElementById('hero-temp-max').textContent = `${Math.round(daily.temperature_2m_max[0])}°`;
    document.getElementById('hero-temp-min').textContent = `${Math.round(daily.temperature_2m_min[0])}°`;
    document.getElementById('hero-elevation').textContent = `${location.elevation || 0}m`;

    // Metrics Grid
    document.getElementById('metric-humidity').innerHTML = `${current.relative_humidity_2m}<span class="metric-unit">%</span>`;
    document.getElementById('metric-wind').innerHTML = `${Math.round(current.wind_speed_10m)} <span class="metric-unit">km/h</span>`;
    document.getElementById('metric-wind-dir').textContent = `Direction: ${getWindDirection(current.wind_direction_10m)}`;
    document.getElementById('metric-pressure').innerHTML = `${Math.round(current.surface_pressure)} <span class="metric-unit">hPa</span>`;
    document.getElementById('metric-uv').textContent = daily.uv_index_max[0] || '3.5';

    // Sun Schedule
    if (daily.sunrise && daily.sunrise[0]) {
      document.getElementById('sun-rise').textContent = formatDate(new Date(daily.sunrise[0]), { hour: '2-digit', minute: '2-digit' });
      document.getElementById('sun-set').textContent = formatDate(new Date(daily.sunset[0]), { hour: '2-digit', minute: '2-digit' });
    }

    // Hourly Timeline Render
    this.renderHourly(data.hourly);

    // 7-Day Daily Forecast Render
    this.renderDaily(data.daily);

    this.setViewState('dashboard');
  }

  renderHourly(hourly) {
    const listContainer = document.getElementById('hourly-list');
    listContainer.innerHTML = '';

    // Render next 24 hours
    for (let i = 0; i < 24; i++) {
      const time = new Date(hourly.time[i]);
      const temp = Math.round(hourly.temperature_2m[i]);
      const code = hourly.weather_code[i];
      const codeMeta = CONFIG.WEATHER_CODES[code] || { icon: 'sun' };

      const item = document.createElement('div');
      item.className = `hourly-card ${i === 0 ? 'active' : ''}`;
      item.innerHTML = `
        <span style="font-size: 0.75rem; font-weight:600;">${i === 0 ? 'Now' : formatDate(time, { hour: '2-digit' })}</span>
        ${getWeatherIconSVG(codeMeta.icon)}
        <span style="font-size: 0.95rem; font-weight:700;">${temp}°</span>
      `;
      listContainer.appendChild(item);
    }
  }

  renderDaily(daily) {
    const dailyContainer = document.getElementById('daily-list');
    dailyContainer.innerHTML = '';

    for (let i = 0; i < 7; i++) {
      const date = new Date(daily.time[i]);
      const max = Math.round(daily.temperature_2m_max[i]);
      const min = Math.round(daily.temperature_2m_min[i]);
      const codeMeta = CONFIG.WEATHER_CODES[daily.weather_code[i]] || { description: 'Clear', icon: 'sun' };

      const row = document.createElement('div');
      row.className = 'daily-row';
      row.innerHTML = `
        <span class="daily-day">${i === 0 ? 'Today' : formatDate(date, { weekday: 'short', month: 'numeric', day: 'numeric' })}</span>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          ${getWeatherIconSVG(codeMeta.icon)}
          <span style="font-size:0.85rem; color:var(--text-secondary); width:110px;">${codeMeta.description}</span>
        </div>
        <div style="font-size:0.85rem; font-weight:600;">
          <span>${max}°</span> / <span style="color:var(--text-muted);">${min}°</span>
        </div>
      `;
      dailyContainer.appendChild(row);
    }
  }

  /**
   * Render Recent Searches List
   */
  renderHistory(history, onSelect) {
    this.historyList.innerHTML = '';
    if (history.length === 0) {
      this.historyList.innerHTML = '<li class="dropdown-empty" style="padding:0.75rem; font-size:0.8rem; color:var(--text-muted);">No recents</li>';
      return;
    }

    history.forEach(item => {
      const li = document.createElement('li');
      li.className = 'dropdown-item';
      li.textContent = item;
      li.addEventListener('click', () => {
        onSelect(item);
        this.historyMenu.classList.remove('show');
      });
      this.historyList.appendChild(li);
    });
  }
}