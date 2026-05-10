# ZWEA - Weather Forecast CLI Application 🌦️

A full-featured command-line weather forecast application with beautiful terminal output, caching, and comprehensive weather data.

## Features

✨ **Core Features:**
- 🌡️ Current weather information with detailed metrics
- 📅 Extended weather forecasts (up to 40 days)
- 📍 Location-based weather lookup
- 🧭 Coordinate-based queries (lat/lon)
- 🎨 Beautiful colored terminal output with emoji
- 💾 Smart caching system to reduce API calls
- ⚙️ Flexible configuration management
- 📊 Multiple output formats (beautiful tables, JSON)

✅ **Included:**
- Command-line argument parsing with Commander.js
- Colored output with Chalk
- ASCII art titles with Figlet
- Data caching with automatic expiry
- Configuration persistence
- Error handling and validation
- Loading spinners and progress indicators
- Wind direction calculations
- Temperature and unit conversions
- Sunrise/sunset times

## Installation

### Prerequisites
- Node.js >= 12.0.0
- npm or yarn

### Setup

1. Clone or navigate to the project:
```bash
cd zwea
```

2. Install dependencies:
```bash
npm install
```

3. Make the CLI executable (Linux/Mac):
```bash
chmod +x bin/index.js
```

4. Link the CLI globally (optional):
```bash
npm link
```

## Configuration

### Get Your API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from your account dashboard

### Configure API Key

**Option 1: Environment Variable**
```bash
export OPEN_WEATHER_API_KEY="your-32-character-api-key"
```

**Option 2: Using CLI**
```bash
zwea config set apiKey your-32-character-api-key
```

**Option 3: View Configuration**
```bash
zwea config view
```

### Configuration Options

```bash
# Set default location
zwea config set defaultLocation "London"

# Change units (metric, imperial, standard)
zwea config set units metric

# Set cache expiry time (in seconds)
zwea config set cacheExpiry 600

# Set language
zwea config set language en

# View all settings
zwea config view

# Reset to defaults
zwea config reset
```

## Usage

### Basic Commands

**Get current weather:**
```bash
zwea current London
zwea now New York          # Shorter alias
node bin/index.js current Paris
```

**Get forecast:**
```bash
zwea forecast London
zwea forecast "New York" -d 7
zwea next Tokyo --days 10  # Longer forecast
```

**Get weather by coordinates:**
```bash
zwea current --coords 51.5074,-0.1278
zwea now -c 40.7128,-74.0060              # New York coordinates
```

**JSON output:**
```bash
zwea current London --json
zwea forecast Paris --json
```

### Configuration Commands

```bash
# View all configuration
zwea config view

# Set values
zwea config set apiKey abc123def456ghi789...
zwea config set defaultLocation London
zwea config set units metric

# Get specific value
zwea config get defaultLocation

# Reset to defaults
zwea config reset
```

### Cache Management

```bash
# Clear all cached data
zwea cache clear
```

## Output Examples

### Current Weather Output
```
 📍 Location Information
──────────────────────────────────────────────────
  Location: London, GB
  Coordinates: 51.51°, -0.13°
  Timezone: UTC+1
  Last Updated: 5/8/2026, 2:30:45 PM

 🌡️ Temperature
──────────────────────────────────────────────────
  Current: 15.2°C ☀️
  Feels Like: 14.8°C
  Min / Max: 12.5°C / 18.3°C

 🌦️ Weather Conditions
──────────────────────────────────────────────────
  Condition: Clear - clear sky
  Humidity: 65%
  Pressure: 1013 hPa
  Visibility: 10.00 km
  Cloud Coverage: 5%

 💨 Wind
──────────────────────────────────────────────────
  Speed: 3.5 m/s
  Direction: NW (315°)

 🌅 Sun Times
──────────────────────────────────────────────────
  Sunrise: 5:45:30 AM
  Sunset: 8:30:15 PM
```

### Forecast Output
Shows a table with hourly forecasts grouped by day:
```
 📍 Location: London, GB
────────────────────────────────────────────────────────────────────────────────────────────────────

📅 5/8/2026
┌──────────┬─────────────────┬──────────┬─────────────┬──────────┬────────────┬─────────┬────────────┐
│ Time     │ Weather         │ Temp     │ Feels Like  │ Humidity │ Wind       │ Clouds  │ Visibility │
├──────────┼─────────────────┼──────────┼─────────────┼──────────┼────────────┼─────────┼────────────┤
│ 12:00 AM │ ☀️ Clear        │ 14.5°    │ 14.1°       │ 68%      │ 3.2 m/s    │ 8%      │ 10.00 km   │
│ 03:00 AM │ ☁️ Clouds       │ 13.2°    │ 12.8°       │ 72%      │ 3.8 m/s    │ 25%     │ 9.50 km    │
└──────────┴─────────────────┴──────────┴─────────────┴──────────┴────────────┴─────────┴────────────┘
```

## Project Structure

```
zwea/
├── bin/
│   └── index.js              # Main CLI entry point
├── lib/
│   ├── weather.js            # Weather API integration
│   ├── formatter.js          # Output formatting with chalk/figlet
│   ├── config.js             # Configuration management
│   ├── cache.js              # Caching system
│   └── utils.js              # Utility functions
├── package.json              # Dependencies and metadata
└── README.md                 # This file
```

## File Locations

Configuration and cache data are stored in:
```
~/.zwea/
├── config.json               # User configuration
└── cache/                    # Cached weather data
    ├── weather-current-*.json
    ├── weather-forecast-*.json
    └── weather-coords-*.json
```

## API Reference

### Weather Module
```javascript
const weather = require('./lib/weather');

// Get current weather
await weather.getCurrentWeather('London');

// Get forecast
await weather.getForecast('London', 5);

// Get weather by coordinates
await weather.getWeatherByCoords(51.5074, -0.1278);
```

### Formatter Module
```javascript
const formatter = require('./lib/formatter');

formatter.formatCurrentWeather(weatherData);
formatter.formatForecast(forecastData);
formatter.formatError('Error message');
formatter.formatSuccess('Success message');
```

### Config Module
```javascript
const config = require('./lib/config');

config.get('apiKey');
config.set('apiKey', 'your-key');
config.getAll();
```

### Cache Module
```javascript
const cache = require('./lib/cache');

cache.set('key', data, 600);     // 600 second expiry
cache.get('key');
cache.clear('key');
cache.clearAll();
```

## Environment Variables

```bash
# Set API key via environment
export OPEN_WEATHER_API_KEY="your-api-key"

# Linux/Mac - add to ~/.bashrc or ~/.zshrc
export OPEN_WEATHER_API_KEY="your-api-key"

# Windows - set permanently via System Properties or in .env file
set OPEN_WEATHER_API_KEY=your-api-key
```

## Error Handling

The application provides helpful error messages:

- **Missing API Key**: Guides you to set the API key
- **Invalid Location**: Suggests correct location format
- **Invalid Coordinates**: Shows coordinate format requirements
- **Network Errors**: Clear error messages with suggestions
- **API Errors**: Parses OpenWeatherMap error responses

## Performance & Caching

- Automatic caching of weather data (default: 10 minutes)
- Cache expiry configured via `cacheExpiry` setting
- Manual cache clearing with `zwea cache clear`
- JSON responses for integration with other tools

## Dependencies

- **commander**: CLI framework with argument parsing
- **chalk**: Terminal string styling
- **figlet**: ASCII art text generation
- **axios**: HTTP client for API requests
- **ora**: Elegant terminal spinner
- **table**: ASCII table formatting
- **dotenv**: Environment variable loading

## Tips & Tricks

1. **Set default location** to avoid typing it every time:
   ```bash
   zwea config set defaultLocation "Your City"
   zwea current                    # Uses default location
   ```

2. **Use JSON output** for scripting:
   ```bash
   zwea current London --json | jq '.temperature.current'
   ```

3. **Chain commands** in scripts:
   ```bash
   WEATHER=$(zwea current London --json)
   echo $WEATHER | jq '.weather.description'
   ```

4. **Get coordinates** from any location lookup service and use:
   ```bash
   zwea current --coords 51.5074,-0.1278
   ```

5. **Automate weather checks** with cron jobs:
   ```bash
   # Add to crontab -e
   0 8 * * * /usr/local/bin/zwea current London >> ~/weather-log.txt
   ```

## Troubleshooting

### "API key not configured"
```bash
zwea config set apiKey your-32-character-key
# or
export OPEN_WEATHER_API_KEY="your-key"
```

### Location not found
- Check spelling
- Use city name instead of district
- Try with country code: "London, GB"

### No network connection
- Check your internet connection
- Verify API endpoint is accessible
- Check firewall settings

### Cache issues
```bash
zwea cache clear    # Clear all cached data
```

## Advanced Usage

### Custom Scripts

```bash
#!/bin/bash
# Check weather for multiple cities

CITIES=("London" "New York" "Tokyo" "Paris")

for city in "${CITIES[@]}"; do
  zwea current "$city" --json | jq '{
    city: .location,
    temp: .temperature.current,
    condition: .weather.main
  }'
done
```

### JSON Integration

```bash
# Get temperature only
zwea current London --json | jq '.temperature.current'

# Get all temperatures
zwea current London --json | jq '.temperature'

# Format custom output
zwea forecast London --json | jq '.forecasts[0] | {time, temp: .temperature, condition: .weather}'
```

## License

ISC

## Support

For issues, feature requests, or contributions:
1. Check the troubleshooting section
2. Verify API key and internet connection
3. Clear cache and try again
4. Check OpenWeatherMap API status

## Version History

**v1.0.0** - Initial release
- Current weather lookup
- Extended forecasts
- Configuration management
- Caching system
- Beautiful terminal output

---

Made with ❤️ for weather enthusiasts and CLI lovers!
