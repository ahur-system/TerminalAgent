const ModernTerminalUISimple = require('./src/ui/modern-ui-simple');
const DynamicSetupManager = require('./src/setup/setup-dynamic');
const debug = require('./src/debugger');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main(selectedProvider = null, options = {}) {
  // Handle version flag
  if (options.version) {
    console.log('Terminal AI v1.11.0');
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

  // Handle inline ask requests
  if (options.ask) {
    await handleInlineRequest(selectedProvider, options);
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

// Handle inline requests (--ask option)
async function handleInlineRequest(selectedProvider, options) {
  const config = require('./src/config/config');
  const configManager = new config();
  const AIProvider = require('./src/providers/providers');
  
  // Run setup if needed
  const setup = new DynamicSetupManager();
  if (setup.isSetupRequired()) {
    console.log('⚠️  First-time setup required. Please run: terminal-agent --setup');
    process.exit(1);
  }

  // Initialize AI provider
  const aiProvider = new AIProvider(configManager);
  aiProvider.initialize();

  // Switch to selected provider or use default
  let providerKey = selectedProvider || configManager.getDefaultProvider() || 'openai';
  const availableProviders = configManager.getAvailableProviders();
  
  if (availableProviders.length === 0) {
    console.log('❌ No API keys configured. Please run: terminal-agent --setup');
    process.exit(1);
  }

  // Try to switch to the requested provider
  if (!aiProvider.switchProvider(providerKey)) {
    // If requested provider not available, use first available
    providerKey = availableProviders[0].key;
    aiProvider.switchProvider(providerKey);
  }

  const currentProvider = aiProvider.getCurrentProvider();
  console.log(`🤖 Using ${currentProvider.name} (${currentProvider.model})`);

  // Get the message to ask
  let message = options.ask;
  
  // Check if the message is a file path
  if (message.startsWith('./') || message.startsWith('/') || message.startsWith('.\\') || message.startsWith('C:\\')) {
    try {
      if (!fs.existsSync(message)) {
        console.log(`❌ File not found: ${message}`);
        process.exit(1);
      }
      message = fs.readFileSync(message, 'utf8').trim();
      console.log(`📄 Reading prompt from: ${options.ask}`);
    } catch (error) {
      console.log(`❌ Error reading file: ${error.message}`);
      process.exit(1);
    }
  }

  console.log(`💬 Sending: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);
  console.log('');

  try {
    // Send the message
    const response = await aiProvider.sendMessage(message);
    
    // Output the response
    if (options.output) {
      try {
        fs.writeFileSync(options.output, response);
        console.log(`✅ Response saved to: ${path.resolve(options.output)}`);
      } catch (error) {
        console.log(`❌ Error writing to file: ${error.message}`);
        console.log('\n📝 Response:');
        console.log(response);
      }
    } else {
      console.log('📝 Response:');
      console.log(response);
    }
    
    // Exit after successful response
    process.exit(0);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    process.exit(1);
  }
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
    } else if (arg === '--ask') {
      options.ask = true;
      // Check if next argument is the message
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        options.ask = args[i + 1];
        i++; // Skip the next argument
      }
    } else if (arg === '--output' || arg === '-o') {
      // Check if next argument is a file path
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        options.output = args[i + 1];
        i++; // Skip the next argument
      }
    } else if (!arg.startsWith('-') && !provider) {
      // First non-option argument is the provider
      provider = arg;
    }
  }
  
  main(provider, options).catch(console.error);
}

module.exports = main; 