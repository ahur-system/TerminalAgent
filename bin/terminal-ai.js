#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');

// Set up the CLI
program
  .name('terminal-agent')
  .description('A full-screen terminal application for chatting with multiple AI providers')
  .version('1.6.6')
  .argument('[provider]', 'Provider to use (openai, gemini, grok)')
  .option('-s, --setup', 'Run setup wizard')
  .option('-c, --config', 'Show current configuration')
  .option('--setup-dynamic', 'Run dynamic setup wizard')
  .option('-e, --export [file]', 'Export configuration to file')
  .option('-i, --import [file]', 'Import configuration from file')
  .parse();

const options = program.opts();
const provider = program.args[0];

// Start the application with provider selection
require('../index.js')(provider, options); 