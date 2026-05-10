# ZWEA Usage Examples

Complete examples for using the ZWEA weather CLI application.

## Basic Usage

### Get Current Weather

```bash
# Basic weather lookup
zwea current London

# Using alias
zwea now Paris

# For default location
zwea current

# Multiple locations
zwea current "New York"
zwea current "Los Angeles"
zwea current Tokyo
```

### Get Weather Forecast

```bash
# Default 5-day forecast
zwea forecast London

# Extended forecast
zwea forecast "New York" -d 10
zwea forecast Paris --days 14

# Using alias
zwea next Tokyo
zwea next "San Francisco" -d 7
```

### Using Coordinates

```bash
# Get weather by latitude, longitude
zwea current --coords 51.5074,-0.1278      # London
zwea current -c 40.7128,-74.0060            # New York
zwea current --coords 35.6762,139.6503      # Tokyo

# With forecast
zwea forecast --coords 48.8566,2.3522       # Paris
zwea forecast -c 52.5200,13.4050 -d 10      # Berlin
```

## Configuration Examples

### Initial Setup

```bash
# Set API key (required)
zwea config set apiKey abc123def456...

# Set your default location
zwea config set defaultLocation "London"

# View all configuration
zwea config view

# Then you can use defaults
zwea current
zwea forecast
```

### Change Units

```bash
# Metric units (Celsius, m/s) - default
zwea config set units metric

# Imperial units (Fahrenheit, mph)
zwea config set units imperial

# Standard units (Kelvin)
zwea config set units standard
```

### Configuration Management

```bash
# View all settings
zwea config view

# Set individual settings
zwea config set cacheExpiry 1200
zwea config set language en
zwea config set theme default

# Get specific setting
zwea config get defaultLocation

# Reset to defaults
zwea config reset
```

## JSON Output for Scripting

### Extract Specific Data

```bash
# Get just the temperature
zwea current London --json | jq '.temperature.current'
# Output: 15.2

# Get weather description
zwea current London --json | jq '.weather.description'
# Output: "clear sky"

# Get all temperature info
zwea current London --json | jq '.temperature'
# Output: { current: 15.2, feelsLike: 14.8, min: 12.5, max: 18.3 }

# Get humidity and pressure
zwea current London --json | jq '{humidity: .humidity, pressure: .pressure}'
# Output: { humidity: 65, pressure: 1013 }
```

### Save to File

```bash
# Save weather data to JSON file
zwea current London --json > weather_london.json

# Parse and format the data
zwea current London --json | jq '.temperature' > temps.json

# Append weather history
zwea current London --json >> weather_history.json
```

### Pipe to Other Tools

```bash
# Pretty print JSON
zwea current London --json | python3 -m json.tool

# Count number of forecasts
zwea forecast London --json | jq '.forecasts | length'

# Filter forecasts with rain
zwea forecast London --json | jq '.forecasts[] | select(.precipitation > 0)'

# Export to CSV (basic)
zwea forecast London --json | jq -r '.forecasts[] | [.timestamp, .temperature, .weather] | @csv'
```

## Shell Scripting Examples

### Check Multiple Cities

```bash
#!/bin/bash

for city in "London" "New York" "Tokyo" "Paris"; do
    echo "=== $city ==="
    zwea current "$city" --json | jq '{
        location: .location,
        temperature: .temperature.current,
        condition: .weather.main,
        humidity: .humidity
    }'
    echo ""
done
```

### Weather Alert Script

```bash
#!/bin/bash

WEATHER=$(zwea current London --json)
TEMP=$(echo $WEATHER | jq '.temperature.current')

if (( $(echo "$TEMP > 30" | bc -l) )); then
    echo "⚠️  Hot alert: Temperature is $TEMP°C"
fi

if (( $(echo "$TEMP < 0" | bc -l) )); then
    echo "❄️  Freeze alert: Temperature is $TEMP°C"
fi
```

### Scheduled Weather Reports

```bash
#!/bin/bash
# Add to crontab: 0 8 * * * /path/to/weather_report.sh

REPORT="Weather Report - $(date)"
WEATHER=$(zwea current London --json)

echo "$REPORT" > weather_report.txt
echo "" >> weather_report.txt
echo $WEATHER | jq -r '.location + ": " + .weather.main + " - " + (.temperature.current | tostring) + "°C"' >> weather_report.txt

# Optional: Send via email
# mail -s "Daily Weather" user@example.com < weather_report.txt
```

### Monitor Weather Changes

```bash
#!/bin/bash

PREV_WEATHER=$(zwea current London --json)
PREV_TEMP=$(echo $PREV_WEATHER | jq '.temperature.current')

# Wait and check again
sleep 3600

CURR_WEATHER=$(zwea current London --json)
CURR_TEMP=$(echo $CURR_WEATHER | jq '.temperature.current')

DIFF=$(echo "$CURR_TEMP - $PREV_TEMP" | bc)

if (( $(echo "$DIFF > 5" | bc -l) )); then
    echo "Temperature increased by $DIFF°C"
elif (( $(echo "$DIFF < -5" | bc -l) )); then
    echo "Temperature decreased by ${DIFF#-}°C"
fi
```

## Advanced Examples

### Create Weather Dashboard

```bash
#!/bin/bash

clear
echo "╔════════════════════════════════════════╗"
echo "║    WEATHER DASHBOARD                   ║"
echo "╚════════════════════════════════════════╝"
echo ""

for city in "London" "New York" "Tokyo"; do
    WEATHER=$(zwea current "$city" --json 2>/dev/null)
    if [ $? -eq 0 ]; then
        EMOJI=$(echo $WEATHER | jq -r '.weather.main')
        TEMP=$(echo $WEATHER | jq '.temperature.current')
        echo "📍 $city: $EMOJI | $TEMP°C"
    fi
done
```

### Integration with Other Tools

```bash
# With notify-send (Linux desktop notifications)
zwea current London --json | jq -r '.weather.description' | \
    xargs -I {} notify-send "Weather Update" "London: {}"

# With curl (send to server)
zwea current London --json | curl -X POST -d @- https://api.example.com/weather

# With awk (process multiple cities)
zwea current London --json | jq -r '.temperature | "\(.current)°C (feels \(.feelsLike)°C)"'
```

### Compare Cities

```bash
#!/bin/bash

LONDON=$(zwea current "London" --json)
PARIS=$(zwea current "Paris" --json)

echo "Temperature Comparison:"
echo "London: $(echo $LONDON | jq '.temperature.current')°C"
echo "Paris:  $(echo $PARIS | jq '.temperature.current')°C"

LONDON_TEMP=$(echo $LONDON | jq '.temperature.current')
PARIS_TEMP=$(echo $PARIS | jq '.temperature.current')

if (( $(echo "$LONDON_TEMP > $PARIS_TEMP" | bc -l) )); then
    echo "London is warmer"
else
    echo "Paris is warmer"
fi
```

### Weather History Logger

```bash
#!/bin/bash

LOG_FILE="$HOME/weather_log.txt"

# Append timestamp and weather
{
    echo "$(date '+%Y-%m-%d %H:%M:%S')"
    zwea current London --json | jq '{
        temp: .temperature.current,
        condition: .weather.main,
        humidity: .humidity,
        wind: .windSpeed
    }'
    echo "---"
} >> "$LOG_FILE"
```

## Caching and Performance

### Clear Cache When Needed

```bash
# Clear all cached data
zwea cache clear

# Then fetch fresh data
zwea current London

# Useful when running scripts that need latest data
zwea cache clear
WEATHER=$(zwea current London --json)
```

### Optimize Cache Settings

```bash
# Shorter cache for frequently changing locations
zwea config set cacheExpiry 300      # 5 minutes

# Longer cache for stable locations
zwea config set cacheExpiry 1800     # 30 minutes

# No cache (always fresh - slower)
zwea config set cacheExpiry 0
```

## Environment Setup

### Permanent Setup

```bash
# Add to ~/.bashrc or ~/.zshrc
export OPEN_WEATHER_API_KEY="your-api-key"
export ZWEA_DEFAULT_LOCATION="London"

# Optional: Create alias
alias weather="zwea current"
alias weather-now="zwea now"
```

### One-Time Setup

```bash
# Set environment variable for current session
export OPEN_WEATHER_API_KEY="your-api-key"

# Run commands
zwea current London
zwea forecast Paris
```

## Error Handling Examples

### Graceful Error Handling

```bash
#!/bin/bash

if zwea current London --json > /tmp/weather.json 2>/dev/null; then
    echo "Weather data fetched successfully"
    cat /tmp/weather.json | jq '.temperature.current'
else
    echo "Failed to fetch weather data"
    # Fallback to cached data or default
    echo "Using cached data..."
fi
```

### Validate Location Before Query

```bash
#!/bin/bash

LOCATION="$1"

if [ -z "$LOCATION" ]; then
    echo "Usage: $0 <location>"
    echo "Example: $0 London"
    exit 1
fi

zwea current "$LOCATION" || {
    echo "Could not find location: $LOCATION"
    exit 1
}
```

---

For more information, see README.md or run `zwea --help`
