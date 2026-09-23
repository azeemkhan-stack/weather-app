/**
 * @file app.js
 * @description Main application controller. Initializes event delegation and state logic.
 */

import { CONFIG } from './config.js';
import { geocodeLocation, fetchWeatherData } from './api.js';
import { UIManager } from './ui.js';

class App {
  constructor() {
    this.ui = new UIManager();
    this.searchHistory = JSON.parse(localStorage.getItem(CONFIG.HISTORY_STORAGE_KEY)) || [];
    
    // Bind DOM elements
    this.form = document.getElementById('search-form');
    this.searchInput = document.getElementById('search-input');
    this.themeBtn = document.getElementById('btn-theme');
    this.geoBtn = document.getElementById('btn-geolocation');
    this.historyBtn = document.getElementById('btn-history');
    this.historyMenu = document.getElementById('history-menu');
    this.retryBtn = document.getElementById('btn-error-retry');

    this.init();
  }

  init() {
    this.setupTheme();
    this.attachEventListeners();
    this.ui.renderHistory(this.searchHistory, (city) => this.handleSearch(city));

    // Default Load City
    this.handleSearch('London');
  }

  setupTheme() {
    const savedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(CONFIG.THEME_STORAGE_KEY, newTheme);
  }

  attachEventListeners() {
    // Form Submit Search
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = this.searchInput.value.trim();
      if (query) this.handleSearch(query);
    });

    // Theme Switch
    this.themeBtn.addEventListener('click', () => this.toggleTheme());

    // History Menu Toggle
    this.historyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.historyMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => this.historyMenu.classList.remove('show'));

    // Quick City Chips
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const city = chip.getAttribute('data-city');
        this.searchInput.value = city;
        this.handleSearch(city);
      });
    });

    // Error State Retry
    this.retryBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.ui.setViewState('empty');
    });

    // Browser Geolocation
    this.geoBtn.addEventListener('click', () => this.handleGeolocation());
  }

  async handleSearch(cityQuery) {
    this.ui.setViewState('loading');
    
    try {
      // 1. Geocode location coordinates
      const location = await geocodeLocation(cityQuery);
      
      // 2. Fetch meteorological weather payload
      const weatherData = await fetchWeatherData(location.latitude, location.longitude);
      
      // 3. Render Dashboard
      this.ui.renderDashboard(location, weatherData);

      // Save History
      this.saveHistory(location.name);

    } catch (error) {
      document.getElementById('error-message').textContent = error.message;
      this.ui.setViewState('error');
    }
  }

  handleGeolocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    this.ui.setViewState('loading');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherData = await fetchWeatherData(latitude, longitude);
          this.ui.renderDashboard({ name: 'Current Location', country: 'GPS Coordinates', elevation: 0 }, weatherData);
        } catch (err) {
          this.ui.setViewState('error');
        }
      },
      () => {
        document.getElementById('error-message').textContent = 'Unable to retrieve location permissions.';
        this.ui.setViewState('error');
      }
    );
  }

  saveHistory(cityName) {
    if (!this.searchHistory.includes(cityName)) {
      this.searchHistory.unshift(cityName);
      if (this.searchHistory.length > CONFIG.MAX_HISTORY_ITEMS) {
        this.searchHistory.pop();
      }
      localStorage.setItem(CONFIG.HISTORY_STORAGE_KEY, JSON.stringify(this.searchHistory));
      this.ui.renderHistory(this.searchHistory, (city) => this.handleSearch(city));
    }
  }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => new App());