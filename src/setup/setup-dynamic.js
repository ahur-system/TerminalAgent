const fs = require('fs');
const path = require('path');
const readline = require('readline');
const ConfigManager = require('../config/config');

class DynamicSetupManager {
  constructor() {
    this.config = new ConfigManager();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // Clear console with animation
  clearConsole() {
    console.clear();
  }

  // Animated loading effect
  async showLoading(message, duration = 2000) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    
    const interval = setInterval(() => {
      process.stdout.write(`\r${frames[i]} ${message}`);
      i = (i + 1) % frames.length;
    }, 100);

    return new Promise(resolve => {
      setTimeout(() => {
        clearInterval(interval);
        process.stdout.write('\r' + ' '.repeat(message.length + 10) + '\r');
        resolve();
      }, duration);
    });
  }

  // Animated text typing effect
  async typeText(text, speed = 50) {
    for (let i = 0; i < text.length; i++) {
      process.stdout.write(text[i]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    console.log();
  }

  // Show colorful welcome screen
  async showWelcome() {
    this.clearConsole();
    
    const colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m'
    };

    console.log(`${colors.cyan}╔══════════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}${colors.bright}${colors.magenta}                    🚀 TERMINAL AGENT SETUP 🚀                    ${colors.reset}${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}╠══════════════════════════════════════════════════════════════════════════════╣${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}${colors.yellow}  Welcome to the future of terminal agents! Let's get you set up in no time.        ${colors.reset}${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}                                                                              ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}${colors.green}  ✨ Features you'll love:${colors.reset}                                              ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}${colors.white}    • Multi-provider AI support (ChatGPT, Gemini & Grok)${colors.reset}                ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}${colors.white}    • Full-screen terminal interface${colors.reset}                               ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}${colors.white}    • Real-time chat with AI assistants${colors.reset}                            ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}${colors.white}    • Easy provider switching${colors.reset}                                    ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}                                                                              ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}╚══════════════════════════════════════════════════════════════════════════════╝${colors.reset}`);
    console.log('');

    await this.showLoading('Initializing setup wizard', 1500);
    console.log(`${colors.green}✅ Setup wizard ready!${colors.reset}\n`);
  }

  // Dynamic API key check with progress
  async checkApiKeys() {
    const colors = {
      reset: '\x1b[0m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      red: '\x1b[31m',
      blue: '\x1b[34m'
    };

    console.log(`${colors.blue}🔍 Checking your API configuration...${colors.reset}\n`);

    const apiKeys = this.config.getApiKeys();
    const checks = [
      { name: 'OpenAI API Key', key: apiKeys.openai, icon: '🤖' },
      { name: 'Gemini API Key', key: apiKeys.gemini, icon: '🧠' },
      { name: 'Grok AI API Key', key: apiKeys.grok, icon: '🚀' }
    ];

    let foundKeys = 0;
    const missingKeys = [];

    for (const check of checks) {
      process.stdout.write(`${check.icon} ${check.name}: `);
      
      if (check.key) {
        console.log(`${colors.green}✅ Found${colors.reset}`);
        foundKeys++;
      } else {
        console.log(`${colors.yellow}⚠️  Missing${colors.reset}`);
        missingKeys.push(check.name);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n${colors.blue}📊 Summary: ${foundKeys}/${checks.length} API keys configured${colors.reset}\n`);

    if (missingKeys.length > 0) {
      await this.showApiKeyHelp(missingKeys);
    }

    return foundKeys > 0;
  }

  // Interactive API key help
  async showApiKeyHelp(missingKeys) {
    const colors = {
      reset: '\x1b[0m',
      yellow: '\x1b[33m',
      cyan: '\x1b[36m',
      green: '\x1b[32m'
    };

    console.log(`${colors.yellow}📝 API Keys Required${colors.reset}`);
    console.log('');
    console.log(`You're missing ${missingKeys.length} API key(s):`);
    missingKeys.forEach(key => console.log(`  • ${key}`));
    console.log('');

    console.log(`${colors.cyan}💡 How to get your API keys:${colors.reset}`);
    console.log('');
    console.log('1. OpenAI API Key:');
    console.log('   • Visit: https://platform.openai.com/api-keys');
    console.log('   • Create a new API key');
    console.log('   • Set: export OPENAI_API_KEY="your-key"');
    console.log('');
    console.log('2. Gemini API Key:');
    console.log('   • Visit: https://makersuite.google.com/app/apikey');
    console.log('   • Create a new API key');
    console.log('   • Set: export GEMINI_API_KEY="your-key"');
    console.log('');
    console.log('3. Grok AI API Key:');
    console.log('   • Visit: https://console.x.ai/');
    console.log('   • Create a new API key');
    console.log('   • Set: export GROK_API_KEY="your-key"');
    console.log('');

    const answer = await this.prompt(`${colors.green}Press Enter to continue (you can add keys later)...${colors.reset}`);
  }

  // Dynamic provider selection
  async selectDefaultProvider() {
    const colors = {
      reset: '\x1b[0m',
      green: '\x1b[32m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      yellow: '\x1b[33m',
      red: '\x1b[31m'
    };

    const availableProviders = this.config.getAvailableProviders();
    const allProviders = ['openai', 'gemini', 'grok'];
    
    if (availableProviders.length === 0) {
      console.log(`${colors.yellow}⚠️  No API Keys Found${colors.reset}`);
      console.log('');
      console.log('You can still continue to the chat interface and add API keys later.');
      console.log('');
      console.log('To add API keys:');
      console.log('  • Use /settings in the chat');
      console.log('  • Select "Manage API keys"');
      console.log('  • Add keys for your preferred providers');
      console.log('');
      const continueChoice = await this.prompt('Continue to chat interface? (y/n): ');
      if (continueChoice.toLowerCase() !== 'y' && continueChoice.toLowerCase() !== 'yes') {
        console.log('');
        console.log('Setup cancelled. You can restart anytime with: terminal-agent --setup');
        process.exit(0);
      }
      
      // Set a default provider even without API keys
      // Default to Gemini as requested
      this.config.setDefaultProvider('gemini');
      console.log('');
      console.log(`${colors.green}✅ Continuing to chat interface...${colors.reset}`);
      console.log('');
      return;
    }

    if (availableProviders.length === 1) {
      const provider = availableProviders[0];
      this.config.setDefaultProvider(provider);
      const providerNames = this.config.getProviderNames();
      
      console.log(`${colors.green}🎯 Auto-selected your provider!${colors.reset}`);
      console.log('');
      console.log(`${colors.magenta}${providerNames[provider]}${colors.reset} will be your default provider.`);
      console.log('');
      console.log('You can switch providers later using Ctrl+P in the app.');
      console.log('');
      await this.prompt('Press Enter to continue...');
      return;
    }

    // Show all providers, including those without API keys
    await this.showProviderSelection(allProviders, availableProviders);
  }

  // Interactive provider selection
  async showProviderSelection(allProviders, availableProviders) {
    const colors = {
      reset: '\x1b[0m',
      green: '\x1b[32m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      yellow: '\x1b[33m',
      cyan: '\x1b[36m'
    };

    const providerNames = this.config.getProviderNames();
    const providerInfo = {
      openai: {
        name: 'ChatGPT (OpenAI)',
        description: 'Powerful language model with excellent reasoning',
        features: ['Fast responses', 'Great reasoning', 'Wide knowledge'],
        icon: '🤖'
      },
      gemini: {
        name: 'Gemini (Google)',
        description: 'Google\'s latest AI model with free tier',
        features: ['Free tier available', 'Good performance', 'Google integration'],
        icon: '🧠'
      },
      grok: {
        name: 'Grok AI (xAI)',
        description: 'Elon Musk\'s AI model with real-time knowledge',
        features: ['Real-time knowledge', 'Controversial responses', 'xAI integration'],
        icon: '🚀'
      }
    };
    
    console.log(`${colors.cyan}🤖 Choose Your AI Companion${colors.reset}`);
    console.log('');
    console.log('Select your default AI provider:');
    console.log('');

    allProviders.forEach((provider, index) => {
      const info = providerInfo[provider];
      const hasApiKey = availableProviders.includes(provider);
      const status = hasApiKey ? `${colors.green}✅ Ready${colors.reset}` : `${colors.yellow}⚠️  Needs API key${colors.reset}`;
      
      console.log(`${colors.yellow}${index + 1}.${colors.reset} ${info.icon} ${colors.magenta}${info.name}${colors.reset} ${status}`);
      console.log(`    ${colors.blue}${info.description}${colors.reset}`);
      console.log(`    ${colors.green}Features:${colors.reset} ${info.features.join(', ')}`);
      console.log('');
    });

    const answer = await this.prompt(`${colors.cyan}Enter your choice (1-${allProviders.length}): ${colors.reset}`);
    const choice = parseInt(answer);

    if (choice >= 1 && choice <= allProviders.length) {
      const selectedProvider = allProviders[choice - 1];
      const hasApiKey = availableProviders.includes(selectedProvider);
      
      if (!hasApiKey) {
        console.log('');
        console.log(`${colors.yellow}⚠️  ${providerInfo[selectedProvider].name} requires an API key.${colors.reset}`);
        console.log('');
        console.log('You can add API keys later using the settings menu (/settings).');
        console.log('');
        const continueChoice = await this.prompt(`${colors.cyan}Continue with this provider? (y/n): ${colors.reset}`);
        if (continueChoice.toLowerCase() !== 'y' && continueChoice.toLowerCase() !== 'yes') {
          return await this.showProviderSelection(allProviders, availableProviders);
        }
      }
      this.config.setDefaultProvider(selectedProvider);
      const info = providerInfo[selectedProvider];
      
      console.log('');
      console.log(`${colors.green}✅ Excellent choice!${colors.reset}`);
      console.log('');
      console.log(`${info.icon} ${colors.magenta}${info.name}${colors.reset} is now your default provider.`);
      console.log('');
      console.log('You can switch providers anytime using Ctrl+P in the app.');
      console.log('');
    } else {
      console.log('');
      console.log(`${colors.yellow}⚠️  Invalid choice. Using first available provider.${colors.reset}`);
      const firstAvailable = availableProviders.length > 0 ? availableProviders[0] : allProviders[0];
      this.config.setDefaultProvider(firstAvailable);
      console.log('');
    }
  }

  // Show model selection for a provider
  async showModelSelection(provider) {
    const colors = {
      reset: '\x1b[0m',
      green: '\x1b[32m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      yellow: '\x1b[33m',
      cyan: '\x1b[36m'
    };

    const availableModels = this.config.getAvailableModels(provider);
    const currentModel = this.config.getModel(provider);
    const providerName = this.config.getProviderNames()[provider];

    console.log('');
    console.log(`${colors.cyan}🤖 Model Selection for ${providerName}${colors.reset}`);
    console.log('');
    console.log('Available models:');
    console.log('');

    availableModels.forEach((model, index) => {
      const isCurrent = model === currentModel;
      const marker = isCurrent ? `${colors.green}✓${colors.reset}` : ' ';
      const name = isCurrent ? `${colors.green}${model} (current)${colors.reset}` : model;
      console.log(`${marker} ${colors.yellow}${index + 1}.${colors.reset} ${name}`);
    });

    console.log('');
    const answer = await this.prompt(`${colors.cyan}Select model (1-${availableModels.length}) or press Enter for current: ${colors.reset}`);
    
    if (answer.trim()) {
      const choice = parseInt(answer);
      if (choice >= 1 && choice <= availableModels.length) {
        const selectedModel = availableModels[choice - 1];
        this.config.setModel(provider, selectedModel);
        console.log('');
        console.log(`${colors.green}✅ Model updated to ${selectedModel}${colors.reset}`);
      } else {
        console.log('');
        console.log(`${colors.yellow}⚠️  Invalid choice. Keeping current model.${colors.reset}`);
      }
    } else {
      console.log('');
      console.log(`${colors.blue}Keeping current model: ${currentModel}${colors.reset}`);
    }
  }

  // Show completion screen
  async showCompletion() {
    const colors = {
      reset: '\x1b[0m',
      green: '\x1b[32m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      yellow: '\x1b[33m'
    };

    console.log('');
    console.log(`${colors.green}🎉 Setup Complete!${colors.reset}`);
    console.log('');
    console.log(`${colors.blue}Your Terminal Agent is ready to use!${colors.reset}`);
    console.log('');
    console.log(`${colors.yellow}Next steps:${colors.reset}`);
    console.log(`  ${colors.yellow}•${colors.reset} Run: ${colors.magenta}terminal-agent${colors.reset}`);
    console.log('');
    console.log('Controls:');
    console.log(`  ${colors.yellow}•${colors.reset} ${colors.magenta}Ctrl+S${colors.reset}: Send message`);
    console.log(`  ${colors.yellow}•${colors.reset} ${colors.magenta}Ctrl+P${colors.reset}: Switch providers`);
    console.log(`  ${colors.yellow}•${colors.reset} ${colors.magenta}Ctrl+C${colors.reset}: Exit`);
    console.log('');
    console.log(`${colors.green}Happy chatting! 🚀${colors.reset}`);
    console.log('');
  }

  // Run the complete dynamic setup
  async runSetup() {
    // Always run setup when explicitly called, regardless of firstRun status
    try {
      await this.showWelcome();
      const hasKeys = await this.checkApiKeys();
      await this.selectDefaultProvider();
      
      // Add model selection for all providers
      const allProviders = ['openai', 'gemini', 'grok'];
      const availableProviders = this.config.getAvailableProviders();
      
      console.log('');
      console.log('Would you like to configure models for your providers?');
      const modelSetup = await this.prompt('Press Enter to continue or "n" to skip: ');
      
      if (modelSetup.toLowerCase() !== 'n') {
        for (const provider of allProviders) {
          const hasApiKey = availableProviders.includes(provider);
          if (!hasApiKey) {
            console.log('');
            console.log(`⚠️  ${this.config.getProviderNames()[provider]} has no API key configured.`);
            const skipChoice = await this.prompt('Skip model configuration for this provider? (y/n): ');
            if (skipChoice.toLowerCase() === 'y' || skipChoice.toLowerCase() === 'yes') {
              continue;
            }
          }
          await this.showModelSelection(provider);
        }
      }
      
      await this.showCompletion();
      
      this.rl.close();
      return this.config.getDefaultProvider();
    } catch (error) {
      console.error('Setup error:', error.message);
      this.rl.close();
      throw error;
    }
  }

  // Check if setup is required (for automatic setup)
  isSetupRequired() {
    return this.config.isFirstRun() || !this.config.hasAnyApiKeys();
  }

  // Simple prompt function
  prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }
}

module.exports = DynamicSetupManager; 