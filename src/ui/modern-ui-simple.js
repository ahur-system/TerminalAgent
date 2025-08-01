const chalk = require('chalk');
const boxen = require('boxen');
const inquirer = require('inquirer');
const gradient = require('gradient-string');
const Table = require('cli-table3');
const readline = require('readline');
const axios = require('axios');
const AIProvider = require('../providers/providers');
const ConfigManager = require('../config/config');

class ModernTerminalUISimple {
  constructor(inlineMode = false) {
    this.config = new ConfigManager();
    this.aiProvider = new AIProvider(this.config);
    this.chatHistory = [];
    this.inlineMode = inlineMode;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
  }

  // Clear screen with style
  clearScreen() {
    console.clear();
    console.log('\n');
  }

  // Show beautiful header
  showHeader() {
    const title = chalk.cyan('🚀 TERMINAL AI');
    const subtitle = chalk.gray('Agentic Multi-Provider AI Interface');
    const version = chalk.cyan('v1.9.6');
    const features = chalk.white('ChatGPT • Gemini • Grok');
    const agents = chalk.yellow('Multi-Behavior Agents • Model Switching');
    
    // Create a more compact, top-left aligned banner
    const bannerContent = `${title}\n${subtitle} | ${version}\n${features}\n${agents}`;
    
    console.log(boxen.default(bannerContent, {
      padding: { top: 0.5, bottom: 0.5, left: 1, right: 1 },
      margin: { top: 0, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: 'blue'
    }));
  }

  // Show status bar with location data
  showStatusBar(provider, model, ipInfo = null) {
    // Determine connection status based on IP availability
    const hasConnection = ipInfo && ipInfo.ip;
    const status = hasConnection ? 'Connected' : 'Disconnected';
    const statusColor = hasConnection ? 'green' : 'red';
    const statusIcon = hasConnection ? '🟢' : '🔴';
    
    // Create location string
    let locationString = 'Unknown location';
    if (ipInfo) {
      if (ipInfo.ip) {
        if (ipInfo.city && ipInfo.city !== 'Unknown') {
          locationString = `${ipInfo.ip} (${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country})`;
        } else if (ipInfo.country && ipInfo.country !== 'Unknown') {
          locationString = `${ipInfo.ip} (${ipInfo.country})`;
        } else {
          locationString = `${ipInfo.ip} (Unknown location)`;
        }
      }
    }
    
    const statusBar = boxen.default(
      `${statusIcon} ${chalk.cyan(provider)} | ${chalk.yellow(model)} | ${chalk[statusColor](status)}\n${chalk.gray('📍')} ${chalk.cyan(locationString)}`,
      {
        padding: 0.5,
        margin: { top: 0, bottom: 1 },
        borderStyle: 'round',
        borderColor: 'blue'
      }
    );
    
    console.log(statusBar);
  }

  // Show chat history
  showChatHistory() {
    if (this.chatHistory.length === 0) {
      console.log(chalk.white('No messages yet. Start the conversation!\n'));
      return;
    }

    console.log(chalk.cyan.bold('💬 Chat History:'));
    console.log(chalk.white('─'.repeat(50)));
    
    this.chatHistory.forEach((msg, index) => {
      const timestamp = chalk.white(`[${msg.timestamp}]`);
      const role = msg.role === 'You' ? chalk.blue('You') : chalk.green('Assistant');
      const content = msg.content;
      
      console.log(`${timestamp} ${role}: ${content}\n`);
    });
  }

  // Show input prompt
  showInputPrompt() {
    console.log(chalk.cyan('┌─ You:'));
    process.stdout.write(chalk.blue('└─ '));
  }

  // Show thinking message
  showThinking() {
    console.log(chalk.yellow('🤖 AI is thinking...'));
  }

  // Show provider selection
  async showProviderSelection() {
    const allProviders = this.aiProvider.getAllProviders();
    const availableProviders = this.aiProvider.getAvailableProviders();
    
    if (allProviders.length === 0) {
      console.log(chalk.yellow('⚠️  No providers available.'));
      return;
    }

    const choices = [
      ...allProviders.map(provider => {
        const isAvailable = availableProviders.some(ap => ap.key === provider.key);
        const status = isAvailable ? '✅ Ready' : '⚠️  Needs API key';
        return {
          name: `${provider.name} (${provider.model}) ${status}`,
          value: provider.key
        };
      }),
      { name: 'Cancel (ESC)', value: 'cancel' }
    ];

    try {
      const { selectedProvider } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedProvider',
          message: 'Choose your AI provider: (Press ESC to go back)',
          choices
        }
      ]);

          if (selectedProvider === 'cancel') {
      console.log(chalk.yellow('\n👋 Cancelled provider selection...'));
      return;
    }
    
    const isAvailable = availableProviders.some(ap => ap.key === selectedProvider);
    
    if (isAvailable) {
      if (this.aiProvider.switchProvider(selectedProvider)) {
        const provider = this.aiProvider.getCurrentProvider();
        console.log(chalk.green(`✅ Switched to ${provider.name} (${provider.model})`));
        this.config.setDefaultProvider(selectedProvider);
        
        // Update status bar with new provider
        const ipInfo = await this.getIpAndLocation();
        this.showStatusBar(provider.name, provider.model, ipInfo);
      }
    } else {
      console.log(chalk.yellow(`⚠️  ${this.config.getProviderNames()[selectedProvider]} needs an API key`));
      console.log(chalk.white('Add an API key via /settings -> Manage API keys'));
      this.config.setDefaultProvider(selectedProvider);
    }
    
    // Add a small delay to show the success message
    await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled provider selection...'));
        return;
      }
      throw error;
    }
  }

  // Show model selection for a provider
  async showModelSelection(provider) {
    const availableModels = this.config.getAvailableModels(provider);
    const currentModel = this.config.getModel(provider);
    
    if (availableModels.length === 0) {
      console.log(chalk.yellow(`⚠️  No models available for ${provider}`));
      return;
    }

    const choices = [
      ...availableModels.map(model => ({
        name: model === currentModel ? `${model} (current)` : model,
        value: model
      })),
      { name: 'Cancel (ESC)', value: 'cancel' }
    ];

    try {
      const { selectedModel } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedModel',
          message: `Choose model for ${this.config.getProviderNames()[provider]}: (Press ESC to go back)`,
          choices
        }
      ]);

          if (selectedModel === 'cancel') {
      console.log(chalk.yellow('\n👋 Cancelled model selection...'));
      return;
    }
    
    this.config.setModel(provider, selectedModel);
    this.aiProvider.updateModel(provider, selectedModel);
    console.log(chalk.green(`✅ Model updated to ${selectedModel}`));
    
    // Update status bar with new model
    const currentProvider = this.aiProvider.getCurrentProvider();
    if (currentProvider && currentProvider.key === provider) {
      const ipInfo = await this.getIpAndLocation();
      this.showStatusBar(currentProvider.name, selectedModel, ipInfo);
    }
    
    // Add a small delay to show the success message
    await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled model selection...'));
        return;
      }
      throw error;
    }
  }

  // Show settings menu
  async showSettings() {
    while (true) {
      const configSummary = this.config.getConfigSummary();
      
      console.log(chalk.cyan.bold('⚙️  Settings:'));
      console.log(chalk.white('─'.repeat(50)));
      
      if (configSummary.defaultProvider) {
        console.log(chalk.white(`Default Provider: ${chalk.cyan(configSummary.defaultProvider)}`));
      }
      
      const defaultAgent = this.config.getDefaultAgent();
      const agents = this.config.getAgentList();
      const currentAgent = agents[defaultAgent];
      if (currentAgent) {
        console.log(chalk.white(`Current Agent: ${chalk.cyan(currentAgent.name)}`));
      }
      
      Object.entries(configSummary.providers).forEach(([key, provider]) => {
        if (provider.hasKey) {
          const keyInfo = provider.keyCount > 0 ? ` (${provider.keyCount} keys)` : ' (no keys)';
          console.log(chalk.white(`${provider.name}: ${chalk.yellow(provider.model)}${keyInfo}`));
        } else {
          console.log(chalk.white(`${provider.name}: ${chalk.yellow(provider.model)} ${chalk.red('(no API key)')}`));
        }
      });
      
      console.log(chalk.white('─'.repeat(50)));
      
      const choices = [
        { name: 'Change default provider', value: 'provider' },
        { name: 'Change model for provider', value: 'model' },
        { name: 'Manage API keys', value: 'keys' },
        { name: 'Manage Agents', value: 'agents' },
        { name: 'Import/Export configuration', value: 'config' },
        { name: 'Cancel (ESC)', value: 'cancel' },
        { name: 'Back to chat', value: 'back' }
      ];

      try {
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices
          }
        ]);

        if (action === 'provider') {
          await this.showProviderSelection();
          // Continue showing settings menu after provider selection
          continue;
        } else if (action === 'model') {
          const availableProviders = this.config.getAvailableProviders();
          if (availableProviders.length === 0) {
            console.log(chalk.yellow('⚠️  No providers available.'));
            continue;
          }
          
          try {
            const { selectedProvider } = await inquirer.prompt([
              {
                type: 'list',
                name: 'selectedProvider',
                message: 'Choose provider to change model:',
                choices: availableProviders.map(p => ({
                  name: this.config.getProviderNames()[p],
                  value: p
                }))
              }
            ]);
            
            await this.showModelSelection(selectedProvider);
            // Continue showing settings menu after model selection
            continue;
          } catch (error) {
            // ESC key pressed or other interruption
            if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
              console.log(chalk.yellow('\n👋 Cancelled model selection...'));
              continue;
            }
            throw error;
          }
        } else if (action === 'keys') {
          await this.showApiKeyManagement();
          // Continue showing settings menu after key management
          continue;
        } else if (action === 'agents') {
          await this.showAgentManagement();
          // Continue showing settings menu after agent management
          continue;
        } else if (action === 'config') {
          await this.showConfigManagement();
          // Continue showing settings menu after config management
          continue;
        } else if (action === 'cancel') {
          // Return to main chat interface
          break;
        } else if (action === 'back') {
          // Return to main chat interface
          break;
        }
      } catch (error) {
        // Any error - return to chat
        console.log(chalk.yellow('\n👋 Returning to chat...'));
        break;
      }
    }
    
    // Clean up after settings operations
    this.cleanupAfterSettings();
  }

  // Show API key management menu
  async showApiKeyManagement() {
    while (true) {
      const providers = ['openai', 'gemini', 'grok'];
      
      console.log(chalk.cyan.bold('🔑 API Key Management:'));
      console.log(chalk.white('─'.repeat(50)));
      
      const choices = [
        ...providers.map(p => ({
          name: `${this.config.getProviderNames()[p]} - Manage keys`,
          value: p
        })),
        { name: 'Cancel (ESC)', value: 'cancel' },
        { name: 'Back to settings', value: 'back' }
      ];

      try {
        const { selectedProvider } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedProvider',
            message: 'Choose provider to manage API keys:',
            choices
          }
        ]);

        if (selectedProvider === 'cancel') {
          console.log(chalk.yellow('\n👋 Cancelled key management...'));
          return;
        } else if (selectedProvider === 'back') {
          return;
        }

        await this.showProviderKeyManagement(selectedProvider);
      } catch (error) {
        // ESC key pressed or other interruption
        if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
          console.log(chalk.yellow('\n👋 Returning to settings...'));
          return;
        }
        throw error;
      }
    }
  }

  // Show provider-specific key management
  async showProviderKeyManagement(provider) {
    while (true) {
      const providerName = this.config.getProviderNames()[provider];
      const keys = this.config.getApiKeysForProvider(provider);
      
      console.log(chalk.cyan.bold(`🔑 ${providerName} API Keys:`));
      console.log(chalk.white('─'.repeat(50)));
      
      if (keys.length === 0) {
        console.log(chalk.yellow('No API keys configured for this provider.'));
      } else {
        keys.forEach((key, index) => {
          const defaultIndicator = key.isDefault ? chalk.green(' (Default)') : '';
          const maskedKey = key.key.substring(0, 8) + '...' + key.key.substring(key.key.length - 4);
          console.log(chalk.white(`${index + 1}. ${key.name}: ${chalk.cyan(maskedKey)}${defaultIndicator}`));
        });
      }
      
      console.log(chalk.white('─'.repeat(50)));
      
      const choices = [
        { name: 'Add new API key', value: 'add' },
        ...(keys.length > 0 ? [
          { name: 'Remove API key', value: 'remove' },
          { name: 'Set default API key', value: 'default' }
        ] : []),
        { name: 'Cancel (ESC)', value: 'cancel' },
        { name: 'Back to key management', value: 'back' }
      ];

      try {
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices
          }
        ]);

        if (action === 'add') {
          await this.addApiKey(provider);
        } else if (action === 'remove') {
          await this.removeApiKey(provider);
        } else if (action === 'default') {
          await this.setDefaultApiKey(provider);
        } else if (action === 'cancel') {
          console.log(chalk.yellow('\n👋 Cancelled key management...'));
          return;
        } else if (action === 'back') {
          return;
        }
      } catch (error) {
        // ESC key pressed or other interruption
        if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
          console.log(chalk.yellow('\n👋 Returning to key management...'));
          return;
        }
        throw error;
      }
    }
  }

  // Add new API key
  async addApiKey(provider) {
    const providerName = this.config.getProviderNames()[provider];
    
    try {
      const { name, key, isDefault } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: `Enter a name for this ${providerName} API key:`,
          validate: (input) => {
            if (!input.trim()) return 'Name is required';
            const existingKeys = this.config.getApiKeysForProvider(provider);
            const exists = existingKeys.some(k => k.name === input.trim());
            if (exists) return 'A key with this name already exists';
            return true;
          }
        },
        {
          type: 'password',
          name: 'key',
          message: `Enter your ${providerName} API key:`,
          validate: (input) => {
            if (!input.trim()) return 'API key is required';
            return true;
          }
        },
        {
          type: 'confirm',
          name: 'isDefault',
          message: 'Set this as the default key for this provider?',
          default: false
        }
      ]);

      this.config.addApiKey(provider, name.trim(), key.trim(), isDefault);
      console.log(chalk.green(`✅ API key "${name}" added successfully!`));
      
      // Add a small delay to show the success message
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled adding API key...'));
        return;
      }
      throw error;
    }
  }

  // Remove API key
  async removeApiKey(provider) {
    const keys = this.config.getApiKeysForProvider(provider);
    
    if (keys.length === 0) {
      console.log(chalk.yellow('No keys to remove.'));
      return;
    }

    try {
      const choices = keys.map(key => ({
        name: `${key.name}${key.isDefault ? ' (Default)' : ''}`,
        value: key.name
      }));

      const { keyName } = await inquirer.prompt([
        {
          type: 'list',
          name: 'keyName',
          message: 'Select key to remove:',
          choices
        }
      ]);

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to remove "${keyName}"?`,
          default: false
        }
      ]);

      if (confirm) {
        const success = this.config.removeApiKey(provider, keyName);
        if (success) {
          console.log(chalk.green(`✅ API key "${keyName}" removed successfully!`));
        } else {
          console.log(chalk.red('❌ Failed to remove API key.'));
        }
      }
      
      // Add a small delay to show the success message
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled removing API key...'));
        return;
      }
      throw error;
    }
  }

  // Set default API key
  async setDefaultApiKey(provider) {
    const keys = this.config.getApiKeysForProvider(provider);
    
    if (keys.length === 0) {
      console.log(chalk.yellow('No keys available.'));
      return;
    }

    try {
      const choices = keys.map(key => ({
        name: `${key.name}${key.isDefault ? ' (Current Default)' : ''}`,
        value: key.name
      }));

      const { keyName } = await inquirer.prompt([
        {
          type: 'list',
          name: 'keyName',
          message: 'Select key to set as default:',
          choices
        }
      ]);

      const success = this.config.setDefaultApiKey(provider, keyName);
      if (success) {
        console.log(chalk.green(`✅ "${keyName}" set as default key!`));
      } else {
        console.log(chalk.red('❌ Failed to set default key.'));
      }
      
      // Add a small delay to show the success message
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled setting default key...'));
        return;
      }
      throw error;
    }
  }

  // Show help
  showHelp() {
    const helpTable = new Table({
      head: [chalk.cyan('Command'), chalk.cyan('Description')],
      colWidths: [20, 40]
    });

    helpTable.push(
      ['Type message', 'Send message to AI'],
      ['/switch', 'Switch AI provider'],
      ['/settings', 'Open settings menu (includes Agents)'],
      ['/help', 'Show this help'],
      ['/clear', 'Clear chat history'],
      ['/exit', 'Exit the application']
    );

    console.log(chalk.cyan.bold('📖 Commands:'));
    console.log(helpTable.toString());
  }

  // Get IP address and location
  async getIpAndLocation() {
    try {
      const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
      const data = response.data;
      
      return {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        isp: data.org
      };
    } catch (error) {
      // Fallback to a simpler IP service if the first one fails
      try {
        const response = await axios.get('https://api.ipify.org?format=json', { timeout: 3000 });
        return {
          ip: response.data.ip,
          city: 'Unknown',
          region: 'Unknown',
          country: 'Unknown',
          isp: 'Unknown'
        };
      } catch (fallbackError) {
        return null;
      }
    }
  }

  // Show welcome message
  async showWelcome() {
    console.log(chalk.green('✨ Welcome to Terminal AI!'));
    console.log(chalk.white('Type your message or /help for commands.\n'));
  }

  // Process user input
  async processInput(input) {
    const trimmedInput = input.trim();
    
    if (!trimmedInput) return;

    // Handle commands
    if (trimmedInput.startsWith('/')) {
      await this.handleCommand(trimmedInput);
      return;
    }

    // Add user message to history
    const timestamp = new Date().toLocaleTimeString();
    this.chatHistory.push({
      role: 'You',
      content: trimmedInput,
      timestamp
    });

    // Check if current provider is available
    const currentProvider = this.aiProvider.getCurrentProvider();
    if (!currentProvider || !this.aiProvider.isProviderAvailable(this.aiProvider.currentProvider)) {
      console.log(chalk.yellow('⚠️  No API keys configured for current provider'));
      console.log(chalk.white('To chat with AI, add API keys using /settings'));
      console.log(chalk.white('Available commands: /settings, /help, /exit\n'));
      return;
    }

    // Show thinking message
    this.showThinking();

    try {
      // Get AI response
      const response = await this.aiProvider.sendMessage(trimmedInput, this.chatHistory.slice(0, -1));
      
      // Add AI response to history
      this.chatHistory.push({
        role: 'Assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString()
      });

      console.log(chalk.green('✅ Response received!'));
      
      // Show the response
      console.log(chalk.green(`\n🤖 Assistant: ${response}\n`));
      
    } catch (error) {
      console.log(chalk.red('❌ Error getting response'));
      console.log(chalk.red(`❌ Error: ${error.message}\n`));
    }
  }

  // Handle commands
  async handleCommand(command) {
    switch (command.toLowerCase()) {
      case '/switch':
        await this.showProviderSelection();
        break;
      case '/settings':
        await this.showSettings();
        break;
      case '/help':
        this.showHelp();
        break;
      case '/clear':
        this.chatHistory = [];
        console.log(chalk.green('✅ Chat history cleared\n'));
        break;
      case '/exit':
        console.log(chalk.yellow('👋 Goodbye!'));
        this.rl.close();
        process.exit(0);
        break;
      default:
        console.log(chalk.red(`❌ Unknown command: ${command}`));
        console.log(chalk.white('Type /help for available commands\n'));
    }
  }

  // Main chat loop
  async startChat() {
    if (!this.inlineMode) {
      this.clearScreen();
      this.showHeader();
    }
    
    // Initialize AI provider with config
    this.aiProvider.initialize();
    
    // Get IP and location information
    const ipInfo = await this.getIpAndLocation();
    
    const defaultProvider = this.config.getDefaultProvider() || 'openai';
    const availableProviders = this.config.getAvailableProviders();
    
    if (availableProviders.length === 0) {
      // No API keys available
      if (!this.inlineMode) {
        this.showStatusBar('No API Keys', 'Add keys via /settings', ipInfo);
      }
    } else {
      // Try to switch to default provider, if not available, use first available
      let providerSwitched = this.aiProvider.switchProvider(defaultProvider);
      if (!providerSwitched && availableProviders.length > 0) {
        // Default provider not available, switch to first available
        const firstAvailableKey = availableProviders[0].key;
        providerSwitched = this.aiProvider.switchProvider(firstAvailableKey);
      }
      
      if (providerSwitched) {
        const provider = this.aiProvider.getCurrentProvider();
        if (!this.inlineMode) {
          this.showStatusBar(provider.name, provider.model, ipInfo);
        }
      } else {
        if (!this.inlineMode) {
          this.showStatusBar('No API Keys', 'Add keys via /settings', ipInfo);
        }
      }
    }
    
    if (!this.inlineMode) {
      await this.showWelcome();
      this.showChatHistory();
    }
    
    // Prevent unexpected exits
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n👋 Goodbye!'));
      this.rl.close();
      process.exit(0);
    });
    
    // Start input loop
    this.promptUser();
  }

  // Prompt for user input
  promptUser() {
    this.showInputPrompt();
    
    this.rl.question('', async (input) => {
      try {
        console.log(''); // Add newline after input
        await this.processInput(input);
      } catch (error) {
        console.log(chalk.red(`❌ Error: ${error.message}\n`));
      }
      
      // Continue the loop
      this.promptUser();
    });
  }

  // Show configuration import/export management
  async showConfigManagement() {
    while (true) {
      console.log(chalk.cyan.bold('📁 Configuration Management:'));
      console.log(chalk.white('─'.repeat(50)));
      
      const choices = [
        { name: 'Export configuration to file', value: 'export' },
        { name: 'Import configuration from file', value: 'import' },
        { name: 'Show current configuration', value: 'show' },
        { name: 'Cancel (ESC)', value: 'cancel' },
        { name: 'Back to settings', value: 'back' }
      ];

      try {
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices
          }
        ]);

        if (action === 'export') {
          await this.exportConfiguration();
        } else if (action === 'import') {
          await this.importConfiguration();
        } else if (action === 'show') {
          await this.showCurrentConfiguration();
        } else if (action === 'cancel') {
          console.log(chalk.yellow('\n👋 Cancelled config management...'));
          return;
        } else if (action === 'back') {
          return;
        }
      } catch (error) {
        // ESC key pressed or other interruption
        if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
          console.log(chalk.yellow('\n👋 Returning to settings...'));
          return;
        }
        throw error;
      }
    }
  }

  // Show agent management
  async showAgentManagement() {
    while (true) {
      console.log(chalk.cyan.bold('🤖 Agent Management:'));
      console.log(chalk.white('─'.repeat(50)));
      
      const agents = this.config.getAgentList();
      const defaultAgent = this.config.getDefaultAgent();
      
      console.log(chalk.white(`Default Agent: ${chalk.cyan(agents[defaultAgent]?.name || 'None')}`));
      console.log(chalk.white('─'.repeat(50)));
      
      const choices = [
        { name: 'Change default agent', value: 'default' },
        { name: 'Add new agent', value: 'add' },
        { name: 'Edit agent', value: 'edit' },
        { name: 'Remove agent', value: 'remove' },
        { name: 'View agent instructions', value: 'view' },
        { name: 'Cancel (ESC)', value: 'cancel' },
        { name: 'Back to settings', value: 'back' }
      ];

      try {
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices
          }
        ]);

        if (action === 'default') {
          await this.showDefaultAgentSelection();
        } else if (action === 'add') {
          await this.addNewAgent();
        } else if (action === 'edit') {
          await this.editAgent();
        } else if (action === 'remove') {
          await this.removeAgent();
        } else if (action === 'view') {
          await this.viewAgentInstructions();
        } else if (action === 'cancel') {
          console.log(chalk.yellow('\n👋 Cancelled agent management...'));
          return;
        } else if (action === 'back') {
          return;
        }
      } catch (error) {
        // ESC key pressed or other interruption
        if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
          console.log(chalk.yellow('\n👋 Returning to settings...'));
          return;
        }
        throw error;
      }
    }
  }

  // Show default agent selection
  async showDefaultAgentSelection() {
    const agents = this.config.getAgentList();
    const agentChoices = Object.entries(agents).map(([id, agent]) => ({
      name: `${agent.name} (${id})`,
      value: id
    }));

    if (agentChoices.length === 0) {
      console.log(chalk.yellow('⚠️  No agents available.'));
      return;
    }

    try {
      const { selectedAgent } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedAgent',
          message: 'Choose default agent:',
          choices: agentChoices
        }
      ]);

      this.config.setDefaultAgent(selectedAgent);
      console.log(chalk.green(`✅ Default agent set to: ${agents[selectedAgent].name}`));
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled agent selection...'));
        return;
      }
      throw error;
    }
  }

  // Add new agent
  async addNewAgent() {
    try {
      const { agentId } = await inquirer.prompt([
        {
          type: 'input',
          name: 'agentId',
          message: 'Enter agent ID (e.g., "programmer", "writer"):',
          validate: (input) => {
            if (!input.trim()) return 'Agent ID cannot be empty';
            if (this.config.getAgent(input.trim())) return 'Agent ID already exists';
            return true;
          }
        }
      ]);

      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter agent name:',
          validate: (input) => input.trim() ? true : 'Agent name cannot be empty'
        }
      ]);

      const { instructions } = await inquirer.prompt([
        {
          type: 'editor',
          name: 'instructions',
          message: 'Enter agent instructions (will open in editor):',
          default: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user questions.'
        }
      ]);

      this.config.addAgent(agentId.trim(), name.trim(), instructions.trim());
      console.log(chalk.green(`✅ Agent "${name}" added successfully!`));
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled adding agent...'));
        return;
      }
      throw error;
    }
  }

  // Edit agent
  async editAgent() {
    const agents = this.config.getAgentList();
    const agentChoices = Object.entries(agents).map(([id, agent]) => ({
      name: `${agent.name} (${id})`,
      value: id
    }));

    if (agentChoices.length === 0) {
      console.log(chalk.yellow('⚠️  No agents available to edit.'));
      return;
    }

    try {
      const { selectedAgent } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedAgent',
          message: 'Choose agent to edit:',
          choices: agentChoices
        }
      ]);

      const agent = agents[selectedAgent];

      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter new agent name:',
          default: agent.name,
          validate: (input) => input.trim() ? true : 'Agent name cannot be empty'
        }
      ]);

      const { instructions } = await inquirer.prompt([
        {
          type: 'editor',
          name: 'instructions',
          message: 'Enter new agent instructions (will open in editor):',
          default: agent.instructions
        }
      ]);

      this.config.updateAgent(selectedAgent, name.trim(), instructions.trim());
      console.log(chalk.green(`✅ Agent "${name}" updated successfully!`));
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled editing agent...'));
        return;
      }
      throw error;
    }
  }

  // Remove agent
  async removeAgent() {
    const agents = this.config.getAgentList();
    const defaultAgent = this.config.getDefaultAgent();
    const agentChoices = Object.entries(agents).map(([id, agent]) => ({
      name: `${agent.name} (${id})${id === defaultAgent ? ' (DEFAULT)' : ''}`,
      value: id
    }));

    if (agentChoices.length === 0) {
      console.log(chalk.yellow('⚠️  No agents available to remove.'));
      return;
    }

    try {
      const { selectedAgent } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedAgent',
          message: 'Choose agent to remove:',
          choices: agentChoices
        }
      ]);

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to remove "${agents[selectedAgent].name}"?`,
          default: false
        }
      ]);

      if (confirm) {
        this.config.removeAgent(selectedAgent);
        console.log(chalk.green(`✅ Agent "${agents[selectedAgent].name}" removed successfully!`));
      } else {
        console.log(chalk.yellow('❌ Agent removal cancelled.'));
      }
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled removing agent...'));
        return;
      }
      throw error;
    }
  }

  // View agent instructions
  async viewAgentInstructions() {
    const agents = this.config.getAgentList();
    const agentChoices = Object.entries(agents).map(([id, agent]) => ({
      name: `${agent.name} (${id})`,
      value: id
    }));

    if (agentChoices.length === 0) {
      console.log(chalk.yellow('⚠️  No agents available.'));
      return;
    }

    try {
      const { selectedAgent } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedAgent',
          message: 'Choose agent to view:',
          choices: agentChoices
        }
      ]);

      const agent = agents[selectedAgent];
      console.log(chalk.cyan.bold(`\n📋 Instructions for "${agent.name}":`));
      console.log(chalk.white('─'.repeat(50)));
      console.log(chalk.white(agent.instructions));
      console.log(chalk.white('─'.repeat(50)));
      
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continue',
          message: 'Press Enter to continue...'
        }
      ]);
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled viewing agent...'));
        return;
      }
      throw error;
    }
  }

  // Export configuration
  async exportConfiguration() {
    try {
      const { filePath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'filePath',
          message: 'Enter file path to export configuration:',
          default: './terminal-ai-config.json'
        }
      ]);

      const success = this.config.exportConfigToFile(filePath);
      if (success) {
        console.log(chalk.green(`✅ Configuration exported to: ${filePath}`));
      } else {
        console.log(chalk.red('❌ Failed to export configuration'));
      }
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled export...'));
        return;
      }
      throw error;
    }
  }

  // Import configuration
  async importConfiguration() {
    try {
      const { filePath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'filePath',
          message: 'Enter file path to import configuration from:',
          default: './terminal-ai-config.json'
        }
      ]);

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'This will overwrite your current configuration. Continue?',
          default: false
        }
      ]);

      if (!confirm) {
        console.log(chalk.yellow('⚠️  Import cancelled'));
        return;
      }

      const success = this.config.importConfigFromFile(filePath);
      if (success) {
        console.log(chalk.green('✅ Configuration imported successfully'));
        console.log(chalk.yellow('⚠️  You may need to restart the application for changes to take effect'));
      } else {
        console.log(chalk.red('❌ Failed to import configuration'));
      }
    } catch (error) {
      // ESC key pressed or other interruption
      if (error.isTtyError || error.message === 'User force closed the prompt with 0 null') {
        console.log(chalk.yellow('\n👋 Cancelled import...'));
        return;
      }
      throw error;
    }
  }

  // Show current configuration
  async showCurrentConfiguration() {
    try {
      const configData = this.config.exportConfig();
      if (configData) {
        console.log(chalk.cyan.bold('📋 Current Configuration:'));
        console.log(chalk.white('─'.repeat(50)));
        console.log(chalk.white(configData));
        console.log(chalk.white('─'.repeat(50)));
      } else {
        console.log(chalk.red('❌ Failed to export configuration'));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  // Clean up after settings operations
  cleanupAfterSettings() {
    // Reinitialize providers after settings changes
    this.aiProvider.reinitialize();
    
    // Clear any buffered input
    process.stdin.resume();
    process.stdin.setRawMode(false);
    
    // Add a small delay to ensure clean state
    setTimeout(() => {
      // Continue with the next prompt
    }, 100);
  }




}

module.exports = ModernTerminalUISimple; 