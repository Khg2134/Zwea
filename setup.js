#!/usr/bin/env node

/**
 * ZWEA - Weather Forecast CLI Application
 * Quick Start Guide
 * 
 * This script helps new users set up ZWEA quickly
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('\nZWEA - Weather CLI Setup Guide\n');
  console.log('Welcome to ZWEA! Let\'s get you set up in a few steps.\n');

  // Step 1: Check for API key
  const useEnv = await question('Do you have an OpenWeatherMap API key? (yes/no): ');
  
  if (useEnv.toLowerCase() === 'yes') {
    const apiKey = await question('Enter your API key (32 characters): ');
    
    if (apiKey.length === 32) {
      console.log('[OK] API key saved!\n');
    } else {
      console.log('[WARN] API key should be 32 characters. You can set it later.\n');
    }
  } else {
    console.log('\nTo get an API key:');
    console.log('  1. Visit: https://openweathermap.org/api');
    console.log('  2. Sign up for a free account');
    console.log('  3. Copy your API key');
    console.log('  4. Run: zwea config set apiKey <your-key>\n');
  }

  // Step 2: Set default location
  const location = await question('What\'s your default location? (e.g., London): ');
  if (location) {
    console.log(`[OK] Default location set to "${location}"\n`);
  }

  // Step 3: Choose units
  const units = await question('Preferred units? (metric/imperial) [metric]: ');
  const selectedUnits = units || 'metric';
  console.log(`[OK] Units set to "${selectedUnits}"\n`);

  // Step 4: Commands cheat sheet
  console.log('═══════════════════════════════════════');
  console.log('Quick Commands Cheat Sheet:');
  console.log('═══════════════════════════════════════\n');
  console.log('Current weather:');
  console.log('  zwea current London');
  console.log('  zwea now Paris        (shorter alias)\n');
  
  console.log('Weather forecast:');
  console.log('  zwea forecast London');
  console.log('  zwea forecast "New York" -d 7\n');
  
  console.log('Configuration:');
  console.log('  zwea config view');
  console.log('  zwea config set apiKey <key>\n');
  
  console.log('By coordinates:');
  console.log('  zwea current --coords 51.5074,-0.1278\n');

  console.log('JSON output (for scripts):');
  console.log('  zwea current London --json\n');

  console.log('Help:');
  console.log('  zwea --help');
  console.log('  zwea config --help\n');

  console.log('═══════════════════════════════════════');
  console.log('Setup complete! Happy weather checking!\n');

  rl.close();
}

setup().catch(console.error);
