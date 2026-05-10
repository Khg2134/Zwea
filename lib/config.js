const path = require('path');
const fs = require('fs');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.zwea');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const defaultConfig = {
  apiKey: process.env.OPEN_WEATHER_API_KEY || '',
  units: 'metric', // metric, imperial, standard
  language: 'en',
  defaultLocation: 'London',
  cacheExpiry: 600, // seconds
  theme: 'default'
};

class Config {
  constructor() {
    this.config = { ...defaultConfig };
    this.loadConfig();
  }

  loadConfig() {
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
        this.config = { ...defaultConfig, ...JSON.parse(data) };
      } catch (error) {
        console.error('Error loading config:', error.message);
      }
    }
  }

  saveConfig() {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
    this.saveConfig();
  }

  getAll() {
    return { ...this.config };
  }

  setAll(newConfig) {
    this.config = { ...defaultConfig, ...newConfig };
    this.saveConfig();
  }
}

module.exports = new Config();
