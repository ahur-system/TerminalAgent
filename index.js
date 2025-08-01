const ModernTerminalUISimple = require('./src/ui/modern-ui-simple');
const DynamicSetupManager = require('./src/setup/setup-dynamic');
const debug = require('./src/debugger');
require('dotenv').config();

async function main(selectedProvider = null, options = {}) {
  // Handle version flag
  if (options.version) {
    console.log('Terminal AI v1.9.1');
    return;
  }

  // Enable debug mode if requested
  if (options.debug) {
    debug.enable('verbose');
    debug.log('Debug mode enabled via CLI option');
  }

  // Handle CLI options
  if (options.setup || options.setupDynamic) {
    const setup = new DynamicSetupManager();
    await setup.runSetup();
    return;
  }
  
  if (options.config) {
    const config = require('./src/config/config');
    const configManager = new config();
    const summary = configManager.getConfigSummary();
    
    console.log('Current Configuration:');
    console.log('Default Provider:', summary.defaultProvider || 'None');
    console.log('Available Providers:');
    
    Object.entries(summary.providers).forEach(([key, provider]) => {
      console.log(`  • ${provider.name}: ${provider.model}`);
    });
    
    console.log('Config File:', configManager.configPath);
    return;
  }

  if (options.export) {
    const config = require('./src/config/config');
    const configManager = new config();
    const fs = require('fs');
    const path = require('path');
    
    const exportPath = options.exportPath || './terminal-ai-config.json';
    const success = configManager.exportConfigToFile(exportPath);
    
    if (success) {
      console.log(`✅ Configuration exported to: ${path.resolve(exportPath)}`);
    } else {
      console.log('❌ Failed to export configuration');
      process.exit(1);
    }
    return;
  }

  if (options.import) {
    const config = require('./src/config/config');
    const configManager = new config();
    const fs = require('fs');
    const path = require('path');
    
    const importPath = options.importPath || './terminal-ai-config.json';
    
    if (!fs.existsSync(importPath)) {
      console.log(`❌ Configuration file not found: ${importPath}`);
      process.exit(1);
    }
    
    const success = configManager.importConfigFromFile(importPath);
    
    if (success) {
      console.log(`✅ Configuration imported from: ${path.resolve(importPath)}`);
      console.log('⚠️  You may need to restart the application for changes to take effect');
    } else {
      console.log('❌ Failed to import configuration');
      process.exit(1);
    }
    return;
  }

  // Run first-time setup if needed
  const setup = new DynamicSetupManager();
  if (setup.isSetupRequired()) {
    selectedProvider = await setup.runSetup();
    
    // Don't exit if no providers configured - let the UI handle it
    // The setup will set a default provider even without API keys
  }

  // Start modern UI
  const ui = new ModernTerminalUISimple();
  await ui.startChat();
}

// Export for CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  let provider = null;
  const options = {};
  
  // Parse arguments manually to handle provider vs options
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--setup' || arg === '-s') {
      options.setup = true;
    } else if (arg === '--config' || arg === '-c') {
      options.config = true;
    } else if (arg === '--setup-dynamic') {
      options.setupDynamic = true;
    } else if (arg === '--export' || arg === '-e') {
      options.export = true;
      // Check if next argument is a file path
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        options.exportPath = args[i + 1];
        i++; // Skip the next argument
      }
    } else if (arg === '--import' || arg === '-i') {
      options.import = true;
      // Check if next argument is a file path
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        options.importPath = args[i + 1];
        i++; // Skip the next argument
      }
    } else if (arg === '--debug' || arg === '-d') {
      options.debug = true;
    } else if (arg === '--version' || arg === '-v') {
      options.version = true;
    } else if (!arg.startsWith('-') && !provider) {
      // First non-option argument is the provider
      provider = arg;
    }
  }
  
  main(provider, options).catch(console.error);
}

module.exports = main; 