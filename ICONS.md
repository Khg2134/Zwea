# 🎨 OpenWeatherMap Icon Integration Guide

## Icon Code System

The application now fully supports OpenWeatherMap weather icon codes for enhanced visual representation.

### How It Works

**Icon Codes Format:**
- Format: `XYd` or `XYn` (where `XY` = icon number, `d` = day, `n` = night)
- Example: `01d` = clear sky (day), `02n` = few clouds (night)

### Complete Icon Code Mapping

| Code | Emoji | Name | ASCII Visual | Time |
|------|-------|------|--------------|------|
| 01d | ☀️ | Clear Sky | `\ \| /` | Day |
| 01n | 🌙 | Clear Sky | `●` | Night |
| 02d | 🌤️ | Few Clouds | `☁ ☀️` | Day |
| 02n | 🌤️ | Few Clouds | `☁ ●` | Night |
| 03d | ☁️ | Scattered Clouds | `☁ ☁` | Day |
| 03n | ☁️ | Scattered Clouds | `☁ ☁` | Night |
| 04d | ☁️ | Broken Clouds | `☁ ☁ ☁` | Day |
| 04n | ☁️ | Broken Clouds | `☁ ☁ ☁` | Night |
| 09d | 🌧️ | Shower Rain | `☁↓↓` | Day |
| 09n | 🌧️ | Shower Rain | `☁↓↓` | Night |
| 10d | 🌦️ | Rain | `☁ ↓ ↓` | Day |
| 10n | 🌧️ | Rain | `☁ ↓ ↓` | Night |
| 11d | ⛈️ | Thunderstorm | `☁ ⚡` | Day |
| 11n | ⛈️ | Thunderstorm | `☁ ⚡` | Night |
| 13d | ❄️ | Snow | `☁ * *` | Day |
| 13n | ❄️ | Snow | `☁ * *` | Night |
| 50d | 🌫️ | Mist | `≈ ≈ ≈` | Day |
| 50n | 🌫️ | Mist | `≈ ≈ ≈` | Night |

## Features Added

### 1. **Colored Emoji Display**
Each weather icon has its own color:
- ☀️ Yellow - Clear/sunny
- 🌙 Cyan - Night/clear night
- ☁️ White/Gray - Cloudy conditions
- 🌧️ Blue - Rain conditions
- ⛈️ Magenta - Thunderstorms
- ❄️ Cyan - Snow
- 🌫️ Gray - Mist/fog

### 2. **Icon Code Display**
The current weather output now shows:
```
Condition: 🌦️ Clear - clear sky
Icon Code: 01d (clear sky)
```

### 3. **Forecast Enhancements**
Forecast tables now display color-coded icons for each time period:
```
Time     | Weather    | Temp | Feels Like | Humidity | Wind
---------|------------|------|------------|----------|------
12:00 AM | ☀️ Clear   | 15°  | 14°        | 65%      | 3.2 m/s
03:00 AM | ☁️ Clouds  | 13°  | 12°        | 72%      | 3.8 m/s
```

## API Integration

### Icon Code from OpenWeatherMap

When fetching weather data, the API returns icon codes in the response:

```javascript
{
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"  // ← This is used for visual display
    }
  ]
}
```

The application automatically:
1. ✅ Captures the icon code from the API
2. ✅ Maps it to the visual representation
3. ✅ Applies appropriate colors
4. ✅ Displays it in output

## Formatter Methods

### New Methods Added

```javascript
// Get icon information from code
getWeatherIcon(iconCode)
// Returns: { emoji, name, ascii, color }

// Get colored emoji
getColoredEmoji(iconCode)
// Returns: colored emoji from chalk

// Get ASCII art representation
getWeatherAscii(iconCode)
// Returns: ASCII art with color

// Get weather description with icon
getWeatherDescription(iconCode, description)
// Returns: formatted description with emoji
```

## Usage Examples

### Current Weather with Icons
```bash
node bin/index.js current London
```

Output includes:
```
🌡️ Temperature
──────────────────────────────────────────────────
  Current: 15.2°C ☀️
  Feels Like: 14.8°C
  Min / Max: 12.5°C / 18.3°C

🌦️ Weather Conditions
──────────────────────────────────────────────────
  Condition: ☀️ Clear - clear sky
  Icon Code: 01d (clear sky)
  Humidity: 65%
  Pressure: 1013 hPa
```

### Forecast with Icons
```bash
node bin/index.js forecast London -d 3
```

Shows table with color-coded icons for each forecast entry.

### JSON Output (Includes Icon)
```bash
node bin/index.js current London --json
```

Returns:
```json
{
  "weather": {
    "main": "Clear",
    "description": "clear sky",
    "icon": "01d"
  },
  ...
}
```

## Color Mapping

Icons are displayed with contextual colors:

| Color | Used For | Examples |
|-------|----------|----------|
| Yellow | Sunny conditions | ☀️ Clear (day) |
| Cyan | Night/cool | 🌙 Clear (night), ❄️ Snow |
| White | Neutral clouds | ☁️ Scattered clouds |
| Gray | Heavy overcast | ☁️ Broken clouds |
| Blue | Rain/wet | 🌧️ Rain, 🌦️ Drizzle |
| Magenta | Severe | ⛈️ Thunderstorm |

## Time-Based Icons

Icons automatically change based on time:

**Day Icons (d suffix):**
- Show sun or sun-based conditions
- Brighter colors
- Example: `01d`, `02d`, `10d`

**Night Icons (n suffix):**
- Show moon or night-based conditions
- Cooler colors
- Example: `01n`, `02n`, `10n`

## Fallback System

The application uses a smart fallback system:

```
Priority Order:
1. OpenWeatherMap icon code → getWeatherIcon()
2. Weather main category → weatherEmojis{}
3. Default emoji → 🌡️
```

This ensures icons are always displayed even if one system fails.

## Data Flow

```
OpenWeatherMap API
        ↓
   icon code (e.g., "01d")
        ↓
   weather.formatWeatherData()
        ↓
   { weather: { icon: "01d" } }
        ↓
   formatter.getWeatherIcon("01d")
        ↓
   { emoji: ☀️, name: "clear sky", ... }
        ↓
   Display with color and ASCII art
```

## Advantages

✅ **More Accurate** - Uses OpenWeatherMap's official codes  
✅ **Time-Aware** - Different icons for day/night  
✅ **Color-Coded** - Visual context for conditions  
✅ **Fallback Support** - Works even with partial data  
✅ **ASCII Art** - Terminal-friendly representations  
✅ **Extensible** - Easy to add more icons  

## Future Enhancements

Could add:
- 256-color terminal support
- Custom icon themes
- Icon animation support
- Weather alerts based on icon severity
- Historical icon tracking

## Technical Details

### Icon Code Categories

**OpenWeatherMap Groups:**
- 1xx: Thunderstorm
- 2xx: Drizzle
- 3xx: Rain
- 4xx: (Reserved)
- 5xx: Rain (additional)
- 6xx: Snow
- 7xx: Atmosphere (Mist, Fog, etc.)
- 8xx: Clouds
- 80x: Clear

### Implementation

The icon mapping is stored in `lib/formatter.js`:

```javascript
const openWeatherIcons = {
  '01d': { emoji: '☀️', name: 'clear sky', ... },
  '01n': { emoji: '🌙', name: 'clear sky night', ... },
  // ... 18 total icon mappings
}
```

Easy to modify or extend with new icons!

---

**Status:** ✅ Fully Integrated  
**API Support:** ✅ OpenWeatherMap v2.5  
**Terminal Support:** ✅ All modern terminals  
**Tested:** ✅ With various weather conditions
