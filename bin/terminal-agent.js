#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');

// Get version dynamically from package.json directly for CLI
let version = '1.11.1'; // fallback
try {
  const packageJson = require('../package.json');
  version = packageJson.version;
} catch (error) {
  console.warn('Warning: Could not read package.json for version, using fallback');
}

// Set up the CLI
program
  .name('terminal-agent')
  .description('A full-screen terminal application for chatting with multiple AI providers')
  .version(version)
  .argument('[provider]', 'AI provider to use (openai, gemini, grok)')
  .option('--setup', 'Run the setup wizard')
  .option('--config', 'Show current configuration')
  .option('--export [file]', 'Export configuration to file')
  .option('--import [file]', 'Import configuration from file')
  .option('--debug', 'Enable debug mode for troubleshooting')
  .option('--ask <message>', 'Send a direct message to AI and get response')
  .option('--agent <agentid>', 'Select specific agent for the conversation')
  .option('--input <file>', 'Input file to process with AI')
  .option('-o, --output <file>', 'Output file for AI response')
  .parse();

const options = program.opts();
const provider = program.args[0] || null;

// Start the application by calling the main function
const main = require('../index.js');
main(provider, options).catch(console.error); 