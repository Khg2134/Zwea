# 🌦️ ZWEA - Quick Start Guide

## What You've Got

A complete, production-ready CLI weather application with:

✅ **Core Features**
- Real-time weather data from OpenWeatherMap API
- 5-40 day forecasts
- Location search and coordinate lookup
- Beautiful colored terminal output
- Smart caching system
- Configuration management
- JSON output for scripting

✅ **Professional CLI Tools**
- **Commander.js** - Advanced argument parsing
- **Chalk** - Beautiful terminal colors
- **Figlet** - ASCII art titles
- **Ora** - Loading spinners
- **Table** - Formatted data tables
- **Axios** - Robust HTTP requests

## Setup (2 minutes)

### 1. Get API Key
Visit [OpenWeatherMap](https://openweathermap.org/api) and sign up for a **free account**.

Copy your 32-character API key.

### 2. Configure API Key

**Option A - Environment Variable:**
```bash
export OPEN_WEATHER_API_KEY="your-32-char-key"
```

**Option B - Using CLI:**
```bash
node bin/index.js config set apiKey your-32-char-key
```

**Option C - .env file:**
```bash
cp .env.example .env
# Edit .env and add your API key
```

### 3. Test It Out

```bash
# Check help
node bin/index.js --help

# Get current weather
node bin/index.js current London

# Get forecast
node bin/index.js forecast "New York" -d 7

# By coordinates
node bin/index.js current --coords 51.5074,-0.1278
```

## Command Reference

### Current Weather
```bash
# By city name
node bin/index.js current London
node bin/index.js current "New York"
node bin/index.js now Paris              # Shorter alias

# By coordinates (lat, lon)
node bin/index.js current --coords 51.5074,-0.1278
node bin/index.js current -c 40.7128,-74.0060

# JSON output
node bin/index.js current London --json
```

### Forecast
```bash
# Basic (5 days default)
node bin/index.js forecast London

# Extended forecast
node bin/index.js forecast "New York" -d 10
node bin/index.js forecast Paris --days 14
node bin/index.js next Tokyo -d 7         # Using alias

# JSON output
node bin/index.js forecast London --json
```

### Configuration
```bash
# View all settings
node bin/index.js config view

# Set values
node bin/index.js config set apiKey abc123...
node bin/index.js config set defaultLocation London
node bin/index.js config set units metric        # or imperial
node bin/index.js config set cacheExpiry 600

# Get specific value
node bin/index.js config get defaultLocation

# Reset to defaults
node bin/index.js config reset
```

### Cache Management
```bash
# Clear all cached data
node bin/index.js cache clear
```

## Project Structure

```
zwea/
├── bin/
│   └── index.js              # Main CLI entry point (6.9 KB)
├── lib/
│   ├── weather.js            # API integration & weather logic
│   ├── formatter.js          # Output formatting with colors/emoji
│   ├── config.js             # Configuration persistence
│   ├── cache.js              # Smart caching system
│   └── utils.js              # Helper functions & utilities
├── config/                   # Configuration directory (user-created)
├── package.json              # Dependencies & metadata
├── package-lock.json         # Locked dependencies
├── .env.example              # Example environment file
├── .gitignore                # Git ignore rules
├── README.md                 # Full documentation
├── EXAMPLES.md               # Usage examples & scripts
├── QUICKSTART.md             # This file
└── setup.js                  # Interactive setup script
```

## File Descriptions

| File | Purpose | Size | Key Features |
|------|---------|------|--------------|
| `bin/index.js` | Main CLI entry point | 7 KB | Commands, args parsing, help |
| `lib/weather.js` | Weather API client | 4 KB | Forecast, current, coordinates |
| `lib/formatter.js` | Output formatting | 5 KB | Colors, tables, ASCII art |
| `lib/config.js` | Configuration manager | 2 KB | Persistent user settings |
| `lib/cache.js` | Caching system | 2 KB | File-based with expiry |
| `lib/utils.js` | Utility functions | 2 KB | Validation, conversion helpers |
| `README.md` | Full documentation | 10 KB | Complete guide & API reference |
| `EXAMPLES.md` | Usage examples | 8 KB | Scripts, integrations, tips |

## Example Outputs

### Current Weather Output
```
📍 Location Information
──────────────────────────────────────────────────
  Location: London, GB
  Coordinates: 51.51°, -0.13°
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

### Forecast Output (Table Format)
Displays hourly forecasts in formatted tables organized by day with:
- Time stamps
- Weather conditions with emoji
- Temperature data
- Humidity and wind speed
- Cloud coverage and visibility

## Common Use Cases

### 1. Quick Weather Check
```bash
node bin/index.js current London
```

### 2. Plan Your Week
```bash
node bin/index.js forecast "New York" -d 7
```

### 3. Check Multiple Cities
```bash
for city in London Paris Tokyo; do
  node bin/index.js current "$city"
done
```

### 4. Export for Analysis
```bash
node bin/index.js forecast London --json > forecast.json
```

### 5. Integration with Scripts
```bash
TEMP=$(node bin/index.js current London --json | jq '.temperature.current')
echo "It's currently $TEMP°C in London"
```

## Storage & Configuration

### Config Location
```
~/.zwea/config.json
```

### Cache Location
```
~/.zwea/cache/
  ├── weather-current-*.json
  ├── weather-forecast-*.json
  └── weather-coords-*.json
```

## Global Installation (Optional)

Make `zwea` available anywhere:

```bash
# Link globally
npm link

# Then use simply:
zwea current London
zwea forecast Paris -d 7
zwea config view
```

Or use it directly:
```bash
node /path/to/zwea/bin/index.js current London
```

## Dependencies Installed

```json
{
  "axios": "HTTP requests to OpenWeatherMap API",
  "chalk": "Terminal color output",
  "commander": "CLI argument parsing",
  "dotenv": "Environment variable loading",
  "figlet": "ASCII art text generation",
  "ora": "Loading spinners",
  "table": "Formatted ASCII tables"
}
```

## Troubleshooting

### "API key not configured"
```bash
node bin/index.js config set apiKey your-key
```

### "Location not found"
- Verify spelling: `London` not `Londen`
- Try with country: `London, GB` or `London, UK`

### "Cache issues"
```bash
node bin/index.js cache clear
```

### "Command not found"
Ensure you're in the project directory or use `npm link`

## Tips & Tricks

1. **Set default location** to skip typing it:
   ```bash
   node bin/index.js config set defaultLocation "London"
   node bin/index.js current              # Uses default
   ```

2. **Use JSON for automation:**
   ```bash
   DATA=$(node bin/index.js current London --json)
   echo $DATA | jq '.temperature.current'
   ```

3. **Create shell aliases:**
   ```bash
   alias zwea-now="node /path/to/zwea/bin/index.js current"
   zwea-now London
   ```

4. **Schedule weather checks:**
   ```bash
   # In crontab -e
   0 8 * * * node /path/to/zwea/bin/index.js current London
   ```

## Next Steps

1. **Read Full Documentation**: See [README.md](README.md)
2. **Explore Examples**: See [EXAMPLES.md](EXAMPLES.md)
3. **Customize Output**: Edit [lib/formatter.js](lib/formatter.js)
4. **Add New Features**: Extend [lib/weather.js](lib/weather.js)

## Features at a Glance

| Feature | Details |
|---------|---------|
| **Real-time Data** | Current weather, temperature, conditions |
| **Forecasts** | Up to 40 days ahead, hourly data |
| **Locations** | City names or latitude/longitude |
| **Colors** | Beautiful terminal colors with emoji |
| **Caching** | Smart caching to reduce API calls |
| **Config** | Persistent user settings |
| **JSON** | Output in JSON for scripting |
| **Spinners** | Loading indicators for long operations |
| **Tables** | Formatted forecast data |
| **CLI** | Professional command-line interface |

## Support Resources

- **OpenWeatherMap API Docs**: https://openweathermap.org/api
- **Commander.js**: https://github.com/tj/commander.js
- **Chalk Colors**: https://github.com/chalk/chalk
- **Full README**: [README.md](README.md)
- **Examples**: [EXAMPLES.md](EXAMPLES.md)

---

**Version**: 1.0.0  
**Last Updated**: May 8, 2026  
**Status**: Production Ready ✅

Ready to check the weather? Start with:
```bash
node bin/index.js --help
```
