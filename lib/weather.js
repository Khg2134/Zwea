const axios = require('axios');
const cache = require('./cache');
const config = require('./config');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class Weather {
  constructor() {
    this.apiKey = config.get('apiKey');
  }

  async getCurrentWeather(location) {
    if (!this.apiKey) {
      throw new Error('API key not configured. Set OPEN_WEATHER_API_KEY or run: zwea config set apiKey <your-key>');
    }

    const cacheKey = `weather-current-${location}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return this.ensureDateObjects(cached);
    }

    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: config.get('units'),
          lang: config.get('language')
        }
      });

      const data = this.formatWeatherData(response.data);
      cache.set(cacheKey, data, config.get('cacheExpiry'));
      return this.ensureDateObjects(data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Location "${location}" not found`);
      }
      throw new Error(`Failed to fetch weather: ${error.message}`);
    }
  }

  async getForecast(location, days = 5) {
    if (!this.apiKey) {
      throw new Error('API key not configured. Set OPEN_WEATHER_API_KEY or run: zwea config set apiKey <your-key>');
    }

    const cacheKey = `weather-forecast-${location}-${days}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return this.ensureForecastDateObjects(cached);
    }

    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: config.get('units'),
          lang: config.get('language'),
          cnt: days * 8 // 8 forecasts per day (3-hour interval)
        }
      });

      const data = this.formatForecastData(response.data);
      cache.set(cacheKey, data, config.get('cacheExpiry'));
      return this.ensureForecastDateObjects(data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Location "${location}" not found`);
      }
      throw new Error(`Failed to fetch forecast: ${error.message}`);
    }
  }

  async getWeatherByCoords(lat, lon) {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    const cacheKey = `weather-coords-${lat}-${lon}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return this.ensureDateObjects(cached);
    }

    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: config.get('units'),
          lang: config.get('language')
        }
      });

      const data = this.formatWeatherData(response.data);
      cache.set(cacheKey, data, config.get('cacheExpiry'));
      return this.ensureDateObjects(data);
    } catch (error) {
      throw new Error(`Failed to fetch weather by coordinates: ${error.message}`);
    }
  }

  formatWeatherData(data) {
    return {
      location: data.name + (data.sys?.country ? `, ${data.sys.country}` : ''),
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      },
      temperature: {
        current: data.main.temp,
        feelsLike: data.main.feels_like,
        min: data.main.temp_min,
        max: data.main.temp_max
      },
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      visibility: data.visibility,
      windSpeed: data.wind.speed,
      windDegree: data.wind.deg,
      windGust: data.wind.gust,
      clouds: data.clouds.all,
      precipitation: data.rain?.['1h'] || 0,
      snow: data.snow?.['1h'] || 0,
      sunrise: data.sys.sunrise * 1000,
      sunset: data.sys.sunset * 1000,
      timezone: data.timezone,
      timestamp: data.dt * 1000
    };
  }

  ensureDateObjects(data) {
    return {
      ...data,
      sunrise: new Date(data.sunrise || 0),
      sunset: new Date(data.sunset || 0),
      timestamp: new Date(data.timestamp || 0)
    };
  }

  ensureForecastDateObjects(data) {
    return {
      ...data,
      forecasts: data.forecasts.map(forecast => ({
        ...forecast,
        timestamp: new Date(forecast.timestamp || 0)
      }))
    };
  }

  formatForecastData(data) {
    return {
      location: data.city.name + (data.city?.country ? `, ${data.city.country}` : ''),
      forecasts: data.list.map(item => ({
        timestamp: item.dt * 1000,
        temperature: item.main.temp,
        feelsLike: item.main.feels_like,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        weather: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        windSpeed: item.wind.speed,
        windDegree: item.wind.deg,
        clouds: item.clouds.all,
        precipitation: item.rain?.['3h'] || 0,
        snow: item.snow?.['3h'] || 0,
        visibility: item.visibility
      }))
    };
  }
}

module.exports = new Weather();
