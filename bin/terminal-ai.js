#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');

// Set up the CLI
program
  .name('terminal-agent')
  .description('A full-screen terminal application for chatting with multiple AI providers')
  .version('1.8.0')
  .option('--setup', 'Run the setup wizard')
  .option('--config', 'Show current configuration')
  .option('--export [file]', 'Export configuration to file')
  .option('--import [file]', 'Import configuration from file')
  .option('--debug', 'Enable debug mode for troubleshooting')
  .parse();

const options = program.opts();

// Start the application
require('../index.js')(null, options); 