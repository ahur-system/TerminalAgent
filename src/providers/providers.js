const fs = require('fs');
const path = require('path');

// Auto-import all provider modules
const providersDir = __dirname;
const providerModules = {};

// Read all provider files and import them
fs.readdirSync(providersDir).forEach(file => {
  if (file.endsWith('.js') && file !== 'providers.js') {
    const providerName = path.basename(file, '.js');
    const providerKey = providerName === 'chatgpt' ? 'openai' : providerName;
    providerModules[providerKey] = require(`./${file}`);
  }
});

class AIProvider {
  constructor(configManager = null) {
    this.currentProvider = 'openai';
    this.configManager = configManager;
    this.providers = {};
    
    // Initialize all available providers
    this.initializeProviders();
  }

  // Initialize all available providers
  initializeProviders() {
    for (const [key, ProviderClass] of Object.entries(providerModules)) {
      this.providers[key] = new ProviderClass(this.configManager);
    }
  }

  // Initialize providers with API keys from config
  initialize() {
    if (!this.configManager) {
      console.warn('No config manager provided, cannot initialize providers');
      return;
    }

    // Get default API keys from config
    const apiKeys = this.configManager.getApiKeys();
    
    // Initialize each provider with its API key
    for (const [providerKey, provider] of Object.entries(this.providers)) {
      const defaultKey = this.configManager.getDefaultApiKey(providerKey);
      if (defaultKey) {
        try {
          provider.initialize(defaultKey);
        } catch (error) {
          console.warn(`Failed to initialize ${provider.name}: ${error.message}`);
        }
      }
    }
  }

  // Initialize providers with specific API keys (backward compatibility)
  initializeWithKeys(openaiKey, geminiKey, grokKey = null) {
    if (openaiKey && this.providers.openai) {
      try {
        this.providers.openai.initialize(openaiKey);
      } catch (error) {
        console.warn(`Failed to initialize OpenAI: ${error.message}`);
      }
    }
    
    if (geminiKey && this.providers.gemini) {
      try {
        this.providers.gemini.initialize(geminiKey);
      } catch (error) {
        console.warn(`Failed to initialize Gemini: ${error.message}`);
      }
    }

    if (grokKey && this.providers.grok) {
      try {
        this.providers.grok.initialize(grokKey);
      } catch (error) {
        console.warn(`Failed to initialize Grok: ${error.message}`);
      }
    }
  }

  // Reinitialize providers (useful after config changes)
  reinitialize() {
    // Clear existing clients
    for (const provider of Object.values(this.providers)) {
      provider.client = null;
    }
    
    // Reinitialize with current config
    this.initialize();
  }

  // Switch between providers
  switchProvider(providerName) {
    if (this.providers[providerName] && this.providers[providerName].isInitialized()) {
      this.currentProvider = providerName;
      return true;
    }
    return false;
  }

  // Get current provider info
  getCurrentProvider() {
    const provider = this.providers[this.currentProvider];
    if (!provider) {
      return null;
    }
    
    return {
      name: provider.name,
      key: this.currentProvider,
      model: provider.model
    };
  }

  // Get available providers
  getAvailableProviders() {
    const available = [];
    for (const [key, provider] of Object.entries(this.providers)) {
      if (provider.isInitialized()) {
        available.push({
          key,
          name: provider.name,
          model: provider.model
        });
      }
    }
    return available;
  }

  // Get all providers (including uninitialized ones)
  getAllProviders() {
    const all = [];
    for (const [key, provider] of Object.entries(this.providers)) {
      all.push({
        key,
        name: provider.name,
        model: provider.model,
        initialized: provider.isInitialized(),
        availableModels: provider.getAvailableModels(),
        defaultModel: provider.getDefaultModel()
      });
    }
    return all;
  }

  // Update model for a provider
  updateModel(provider, model) {
    if (this.providers[provider]) {
      this.providers[provider].updateModel(model);
    }
  }

  // Get available models for a provider
  getAvailableModels(provider) {
    if (this.providers[provider]) {
      return this.providers[provider].getAvailableModels();
    }
    return [];
  }

  // Get default model for a provider
  getDefaultModel(provider) {
    if (this.providers[provider]) {
      return this.providers[provider].getDefaultModel();
    }
    return null;
  }

  // Send message to current provider
  async sendMessage(message, history = []) {
    const provider = this.providers[this.currentProvider];
    
    if (!provider || !provider.isInitialized()) {
      throw new Error(`Provider ${this.currentProvider} is not initialized`);
    }

    try {
      // Get agent instructions if available
      let agentInstructions = '';
      if (this.configManager) {
        agentInstructions = this.configManager.getCurrentAgentInstructions();
      }

      // If this is the first message and we have agent instructions, prepend them
      let processedMessage = message;
      if (history.length === 0 && agentInstructions) {
        processedMessage = `${agentInstructions}\n\nUser: ${message}`;
      }

      return await provider.sendMessage(processedMessage, history);
    } catch (error) {
      throw new Error(`Error sending message to ${this.currentProvider}: ${error.message}`);
    }
  }

  // Get provider instance by key
  getProvider(providerKey) {
    return this.providers[providerKey] || null;
  }

  // Check if a provider is available
  isProviderAvailable(providerKey) {
    const provider = this.providers[providerKey];
    return provider && provider.isInitialized();
  }
}

module.exports = AIProvider; 