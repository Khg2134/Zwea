const chalk = require('chalk');
const ora = require('ora');

class Utils {
  async withSpinner(message, fn) {
    const spinner = ora(chalk.cyan(message)).start();
    try {
      const result = await fn();
      spinner.succeed(chalk.green(message + ' completed'));
      return result;
    } catch (error) {
      spinner.fail(chalk.red(message + ' failed'));
      throw error;
    }
  }

  isValidApiKey(key) {
    return key && typeof key === 'string' && key.length === 32;
  }

  isValidLocation(location) {
    return location && typeof location === 'string' && location.length > 0;
  }

  isValidCoords(lat, lon) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    return !isNaN(latNum) && !isNaN(lonNum) && 
           latNum >= -90 && latNum <= 90 && 
           lonNum >= -180 && lonNum <= 180;
  }

  validateUnits(units) {
    return ['metric', 'imperial', 'standard'].includes(units);
  }

  convertTemp(temp, fromUnit, toUnit) {
    if (fromUnit === toUnit) return temp;
    
    if (fromUnit === 'metric' && toUnit === 'imperial') {
      return (temp * 9/5) + 32;
    }
    if (fromUnit === 'imperial' && toUnit === 'metric') {
      return (temp - 32) * 5/9;
    }
    return temp;
  }

  convertWindSpeed(speed, fromUnit, toUnit) {
    const conversions = {
      'mps': { 'kmh': 3.6, 'mph': 2.237 },
      'kmh': { 'mps': 1/3.6, 'mph': 0.621 },
      'mph': { 'mps': 0.447, 'kmh': 1.609 }
    };
    
    if (fromUnit === toUnit) return speed;
    return speed * (conversions[fromUnit]?.[toUnit] || 1);
  }

  formatDate(date, format = 'short') {
    if (format === 'short') {
      return date.toLocaleDateString();
    }
    if (format === 'long') {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return date.toLocaleString();
  }
}

module.exports = new Utils();
