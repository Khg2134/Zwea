const path = require('path');
const fs = require('fs');
const os = require('os');

const CACHE_DIR = path.join(os.homedir(), '.zwea', 'cache');

class Cache {
  constructor() {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  }

  getCacheFile(key) {
    return path.join(CACHE_DIR, `${key}.json`);
  }

  set(key, value, expirySeconds = 600) {
    const cacheFile = this.getCacheFile(key);
    const data = {
      value,
      timestamp: Date.now(),
      expiry: expirySeconds * 1000
    };
    fs.writeFileSync(cacheFile, JSON.stringify(data));
  }

  get(key) {
    const cacheFile = this.getCacheFile(key);
    
    if (!fs.existsSync(cacheFile)) {
      return null;
    }

    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      const isExpired = (Date.now() - data.timestamp) > data.expiry;
      
      if (isExpired) {
        fs.unlinkSync(cacheFile);
        return null;
      }
      
      return data.value;
    } catch (error) {
      return null;
    }
  }

  clear(key) {
    const cacheFile = this.getCacheFile(key);
    if (fs.existsSync(cacheFile)) {
      fs.unlinkSync(cacheFile);
    }
  }

  clearAll() {
    if (fs.existsSync(CACHE_DIR)) {
      fs.readdirSync(CACHE_DIR).forEach(file => {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      });
    }
  }
}

module.exports = new Cache();
