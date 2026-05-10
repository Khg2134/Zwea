#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const weather = require('../lib/weather');
const formatter = require('../lib/formatter');
const config = require('../lib/config');
const cache = require('../lib/cache');
const utils = require('../lib/utils');

const program = new Command();

program
  .name('zwea')
  .description('A full-featured CLI weather forecast application')
  .version('1.0.0', '-v, --version')
  .usage('[command] [options]');

// Display welcome banner
program.on('--help', () => {
  console.log('\n' + chalk.cyan(figlet.textSync('ZWEA', { horizontalLayout: 'default' })));
  console.log(chalk.yellow('Weather Forecast CLI - Get instant weather information from your terminal!\n'));
  console.log(chalk.green('Examples:'));
  console.log('  $ zwea current London');
  console.log('  $ zwea forecast New York');
  console.log('  $ zwea current --coords 51.5074,-0.1278');
  console.log('  $ zwea config set apiKey your-api-key');
  console.log('  $ zwea config view\n');
});

// Current weather command
program
  .command('current [location]')
  .description('Get current weather for a location')
  .option('-c, --coords <lat,lon>', 'Get weather by coordinates (latitude,longitude)')
  .option('--json', 'Output in JSON format')
  .action(async (location, options) => {
    try {
      let data;

      if (options.coords) {
        const [lat, lon] = options.coords.split(',');
        if (!utils.isValidCoords(lat, lon)) {
          console.log(formatter.formatError('Invalid coordinates. Use: lat,lon (e.g., 51.5074,-0.1278)'));
          process.exit(1);
        }
        data = await utils.withSpinner(
          'Fetching weather by coordinates...',
          () => weather.getWeatherByCoords(lat, lon)
        );
      } else {
        const loc = location || config.get('defaultLocation');
        if (!utils.isValidLocation(loc)) {
          console.log(formatter.formatError('Please provide a location or set a default location'));
          process.exit(1);
        }
        data = await utils.withSpinner(
          `Fetching weather for ${loc}...`,
          () => weather.getCurrentWeather(loc)
        );
      }

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(formatter.formatCurrentWeather(data));
      }
    } catch (error) {
      console.log(formatter.formatError(error.message));
      process.exit(1);
    }
  });

// Forecast command
program
  .command('forecast [location]')
  .description('Get weather forecast for a location')
  .option('-d, --days <number>', 'Number of days to forecast (default: 5)', '5')
  .option('--json', 'Output in JSON format')
  .action(async (location, options) => {
    try {
      const days = Math.min(Math.max(parseInt(options.days), 1), 40);
      const loc = location || config.get('defaultLocation');

      if (!utils.isValidLocation(loc)) {
        console.log(formatter.formatError('Please provide a location or set a default location'));
        process.exit(1);
      }

      const data = await utils.withSpinner(
        `Fetching ${days}-day forecast for ${loc}...`,
        () => weather.getForecast(loc, days)
      );

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(formatter.formatForecast(data));
      }
    } catch (error) {
      console.log(formatter.formatError(error.message));
      process.exit(1);
    }
  });

// Configuration management
program
  .command('config <action> [key] [value]')
  .description('Manage application configuration')
  .action((action, key, value) => {
    try {
      switch (action) {
        case 'view':
          console.log(formatter.formatConfig(config.getAll()));
          break;

        case 'set':
          if (!key || !value) {
            console.log(formatter.formatError('Usage: zwea config set <key> <value>'));
            process.exit(1);
          }
          config.set(key, value);
          console.log(formatter.formatSuccess(`Configuration updated: ${key} = ${key === 'apiKey' ? '***' : value}`));
          break;

        case 'get':
          if (!key) {
            console.log(formatter.formatError('Usage: zwea config get <key>'));
            process.exit(1);
          }
          const val = config.get(key);
          console.log(`${key}: ${key === 'apiKey' && val ? '***' : val}`);
          break;

        case 'reset':
          config.setAll({});
          console.log(formatter.formatSuccess('Configuration reset to defaults'));
          break;

        default:
          console.log(formatter.formatError(`Unknown action: ${action}`));
          console.log('Available actions: view, set, get, reset');
          process.exit(1);
      }
    } catch (error) {
      console.log(formatter.formatError(error.message));
      process.exit(1);
    }
  });

// Cache management
program
  .command('cache <action>')
  .description('Manage application cache')
  .action((action) => {
    try {
      switch (action) {
        case 'clear':
          cache.clearAll();
          console.log(formatter.formatSuccess('Cache cleared'));
          break;

        default:
          console.log(formatter.formatError(`Unknown cache action: ${action}`));
          console.log('Available actions: clear');
          process.exit(1);
      }
    } catch (error) {
      console.log(formatter.formatError(error.message));
      process.exit(1);
    }
  });

// Alias commands
program
  .command('now [location]')
  .description('Alias for current weather')
  .option('--coords <lat,lon>', 'Get weather by coordinates')
  .option('--json', 'Output in JSON format')
  .action(async (location, options) => {
    program.parse(['', '', 'current', location, ...(options.coords ? ['--coords', options.coords] : []), ...(options.json ? ['--json'] : [])]);
  });

program
  .command('next [location]')
  .description('Alias for forecast')
  .option('-d, --days <number>', 'Number of days')
  .option('--json', 'Output in JSON format')
  .action(async (location, options) => {
    program.parse(['', '', 'forecast', location, ...(options.days ? ['-d', options.days] : []), ...(options.json ? ['--json'] : [])]);
  });

// Help for specific commands
program.on('command:*', function () {
  console.log(formatter.formatError('Invalid command: ' + program.args.join(' ')));
  console.log('Run zwea --help for usage information');
  process.exit(1);
});

// Show banner and help if no arguments
if (process.argv.length === 2) {
  console.log('\n' + chalk.cyan.bold(figlet.textSync('ZWEA', { horizontalLayout: 'default' })));
  console.log(chalk.yellow('Weather Forecast CLI'));
  console.log(chalk.gray('Get instant weather information from your terminal!\n'));
  program.outputHelp();
  process.exit(0);
}

program.parse();
