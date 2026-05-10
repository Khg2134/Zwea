const chalk = require('chalk');
const figlet = require('figlet');
const { table } = require('table');

// OpenWeatherMap icon codes mapping
// Format: "XYd" or "XYn" where XY is the icon number and d/n is day/night
const openWeatherIcons = {
  '01d': { name: 'clear sky', ascii: '   \\ | /   ', color: 'yellow' },
  '01n': { name: 'clear sky night', ascii: '    ●    ', color: 'cyan' },
  '02d': { name: 'few clouds', ascii: '   ☁ ☀    ', color: 'yellow' },
  '02n': { name: 'few clouds night', ascii: '   ☁ ●    ', color: 'cyan' },
  '03d': { name: 'scattered clouds', ascii: '   ☁ ☁    ', color: 'white' },
  '03n': { name: 'scattered clouds night', ascii: '   ☁ ☁    ', color: 'gray' },
  '04d': { name: 'broken clouds', ascii: '  ☁ ☁ ☁   ', color: 'gray' },
  '04n': { name: 'broken clouds night', ascii: '  ☁ ☁ ☁   ', color: 'gray' },
  '09d': { name: 'shower rain', ascii: '   ☁     ', color: 'blue' },
  '09n': { name: 'shower rain night', ascii: '   ☁     ', color: 'blue' },
  '10d': { name: 'rain', ascii: '   ☁ ↓ ↓  ', color: 'blue' },
  '10n': { name: 'rain night', ascii: '   ☁ ↓ ↓  ', color: 'blue' },
  '11d': { name: 'thunderstorm', ascii: '   ☁ ⚡   ', color: 'magenta' },
  '11n': { name: 'thunderstorm night', ascii: '   ☁ ⚡   ', color: 'magenta' },
  '13d': { name: 'snow', ascii: '   ☁ * *  ', color: 'cyan' },
  '13n': { name: 'snow night', ascii: '   ☁ * *  ', color: 'cyan' },
  '50d': { name: 'mist', ascii: '  ≈ ≈ ≈ ≈ ', color: 'gray' },
  '50n': { name: 'mist night', ascii: '  ≈ ≈ ≈ ≈ ', color: 'gray' }
};

class Formatter {
  formatTitle(text) {
    return figlet.textSync(text, {
      horizontalLayout: 'default',
      verticalLayout: 'default'
    });
  }

  // Get weather icon info from OpenWeatherMap icon code
  getWeatherIcon(iconCode) {
    return openWeatherIcons[iconCode] || {
      name: 'unknown',
      ascii: '   ?    ',
      color: 'white'
    };
  }

  // Get colored weather icon
  getColoredWeatherIcon(iconCode) {
    const icon = this.getWeatherIcon(iconCode);
    const colorFn = chalk[icon.color] || chalk.white;
    return colorFn(icon.ascii);
  }

  getWeatherAscii(iconCode) {
    const icon = this.getWeatherIcon(iconCode);
    const colorFn = chalk[icon.color] || chalk.white;
    return colorFn(icon.ascii);
  }

  // Get weather description
  getWeatherDescription(iconCode, description) {
    return description;
  }

  formatCurrentWeather(data) {
    const weather = data.weather.main;
    const iconCode = data.weather.icon || '';
    const coloredAscii = this.getColoredWeatherIcon(iconCode);

    const output = [];
    output.push(chalk.cyan.bold('\n Location Information'));
    output.push(chalk.gray('─'.repeat(50)));
    output.push(`  ${chalk.white('Location:')} ${chalk.yellow(data.location)}`);
    output.push(`  ${chalk.white('Coordinates:')} ${chalk.yellow(`${data.coordinates.lat.toFixed(2)}°, ${data.coordinates.lon.toFixed(2)}°`)}`);
    output.push(`  ${chalk.white('Timezone:')} ${chalk.yellow(`UTC${data.timezone >= 0 ? '+' : ''}${data.timezone / 3600}`)}`);
    output.push(`  ${chalk.white('Last Updated:')} ${chalk.yellow(data.timestamp.toLocaleString())}`);

    output.push(chalk.cyan.bold('\n Temperature'));
    output.push(chalk.gray('─'.repeat(50)));
    const units = data.temperature.current > 50 ? '°F' : '°C';
    output.push(`  ${chalk.white('Current:')} ${chalk.yellow(data.temperature.current.toFixed(1) + units)} ${coloredAscii}`);
    output.push(`  ${chalk.white('Feels Like:')} ${chalk.yellow(data.temperature.feelsLike.toFixed(1) + units)}`);
    output.push(`  ${chalk.white('Min / Max:')} ${chalk.yellow(data.temperature.min.toFixed(1) + units)} / ${chalk.yellow(data.temperature.max.toFixed(1) + units)}`);

    output.push(chalk.cyan.bold('\n Weather Conditions'));
    output.push(chalk.gray('─'.repeat(50)));
    const iconInfo = this.getWeatherIcon(iconCode);
    output.push(`  ${chalk.white('Condition:')} ${coloredAscii} ${chalk.yellow(data.weather.main)} - ${chalk.gray(data.weather.description)}`);
    output.push(`  ${chalk.white('Icon Code:')} ${chalk.gray(iconCode)} (${iconInfo.name})`);
    output.push(`  ${chalk.white('Humidity:')} ${chalk.yellow(data.humidity + '%')}`);
    output.push(`  ${chalk.white('Pressure:')} ${chalk.yellow(data.pressure + ' hPa')}`);
    output.push(`  ${chalk.white('Visibility:')} ${chalk.yellow((data.visibility / 1000).toFixed(2) + ' km')}`);
    output.push(`  ${chalk.white('Cloud Coverage:')} ${chalk.yellow(data.clouds + '%')}`);

    if (data.precipitation > 0 || data.snow > 0) {
      output.push(chalk.cyan.bold('\n Precipitation'));
      output.push(chalk.gray('─'.repeat(50)));
      if (data.precipitation > 0) {
        output.push(`  ${chalk.white('Rain:')} ${chalk.yellow(data.precipitation + ' mm')}`);
      }
      if (data.snow > 0) {
        output.push(`  ${chalk.white('Snow:')} ${chalk.yellow(data.snow + ' mm')}`);
      }
    }

    output.push(chalk.cyan.bold('\n Wind'));
    output.push(chalk.gray('─'.repeat(50)));
    output.push(`  ${chalk.white('Speed:')} ${chalk.yellow(data.windSpeed + ' m/s')}`);
    if (data.windGust) {
      output.push(`  ${chalk.white('Gust:')} ${chalk.yellow(data.windGust + ' m/s')}`);
    }
    output.push(`  ${chalk.white('Direction:')} ${chalk.yellow(this.getWindDirection(data.windDegree) + ` (${data.windDegree}°)`)}`);

    output.push(chalk.cyan.bold('\n Sun Times'));
    output.push(chalk.gray('─'.repeat(50)));
    output.push(`  ${chalk.white('Sunrise:')} ${chalk.yellow(data.sunrise.toLocaleTimeString())}`);
    output.push(`  ${chalk.white('Sunset:')} ${chalk.yellow(data.sunset.toLocaleTimeString())}`);

    return output.join('\n');
  }

  formatForecast(data) {
    const output = [];
    output.push(chalk.cyan.bold('\n Location: ' + data.location));
    output.push(chalk.gray('─'.repeat(100)));

    const tableData = [];
    tableData.push([
      chalk.bold('Time'),
      chalk.bold('Weather'),
      chalk.bold('Temp'),
      chalk.bold('Feels Like'),
      chalk.bold('Humidity'),
      chalk.bold('Wind'),
      chalk.bold('Clouds'),
      chalk.bold('Visibility')
    ]);

    // Group by day
    const days = {};
    data.forecasts.forEach(forecast => {
      const date = forecast.timestamp.toLocaleDateString();
      if (!days[date]) {
        days[date] = [];
      }
      days[date].push(forecast);
    });

    for (const [date, forecasts] of Object.entries(days)) {
      output.push(chalk.yellow.bold(`\n${date}`));
      tableData.push([chalk.yellow(date), '', '', '', '', '', '', '']);

      forecasts.forEach(forecast => {
        const time = forecast.timestamp.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        const iconCode = forecast.icon || '';
        const coloredAscii = this.getColoredWeatherIcon(iconCode);

        tableData.push([
          time,
          coloredAscii + ' ' + forecast.weather,
          forecast.temperature.toFixed(1) + '°',
          forecast.feelsLike.toFixed(1) + '°',
          forecast.humidity + '%',
          forecast.windSpeed + ' m/s',
          forecast.clouds + '%',
          (forecast.visibility / 1000).toFixed(2) + ' km'
        ]);
      });
    }

    output.push(table(tableData));
    return output.join('\n');
  }

  getWindDirection(degree) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
  }

  formatError(message) {
    return chalk.red.bold('[ERROR] ') + chalk.red(message);
  }

  formatSuccess(message) {
    return chalk.green.bold('[OK] ') + chalk.green(message);
  }

  formatWarning(message) {
    return chalk.yellow.bold('[WARN] ') + chalk.yellow(message);
  }

  formatInfo(message) {
    return chalk.blue.bold('[INFO] ') + chalk.blue(message);
  }

  formatConfig(config) {
    const output = [];
    output.push(chalk.cyan.bold('\n Configuration'));
    output.push(chalk.gray('─'.repeat(50)));

    Object.entries(config).forEach(([key, value]) => {
      const displayValue = key === 'apiKey' && value ? '***' + value.slice(-4) : value;
      output.push(`  ${chalk.white(key + ':')} ${chalk.yellow(displayValue)}`);
    });

    return output.join('\n');
  }
}

module.exports = new Formatter();
