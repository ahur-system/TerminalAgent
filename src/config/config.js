const fs = require('fs');
const path = require('path');
const blessed = require('blessed');
const AIProvider = require('../providers/providers');

class ConfigManager {
  constructor() {
    this.configPath = path.join(process.cwd(), 'config.json');
    this.config = this.loadConfig();
  }

  // Load configuration from file
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf8');
        const config = JSON.parse(data);
        
        // Migrate old config format to new format
        if (config.apiKeys && typeof config.apiKeys === 'object' && !Array.isArray(config.apiKeys.openai)) {
                  // Convert old single key format to new multiple keys format
        const migratedConfig = {
          ...config,
          apiKeys: {
            openai: config.apiKeys.openai ? [{ name: 'Default', key: config.apiKeys.openai, isDefault: true }] : [],
            gemini: config.apiKeys.gemini ? [{ name: 'Default', key: config.apiKeys.gemini, isDefault: true }] : [],
            grok: config.apiKeys.grok ? [{ name: 'Default', key: config.apiKeys.grok, isDefault: true }] : []
          }
        };
          return migratedConfig;
        }
        
        return config;
      }
    } catch (error) {
      console.error('Error loading config:', error.message);
    }
    
    // Default configuration
    return {
      defaultProvider: 'gemini',
      apiKeys: {
        openai: [],
        gemini: [],
        grok: []
      },
      models: {
        openai: 'gpt-3.5-turbo',
        gemini: 'gemini-1.5-flash',
        grok: 'grok-3'
      },
      firstRun: true
    };
  }

  // Save configuration to file
  saveConfig() {
    try {
      const dir = path.dirname(this.configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving config:', error.message);
      return false;
    }
  }

  // Get API keys from environment or config
  getApiKeys() {
    // Check environment variables first
    const envKeys = {
      openai: process.env.OPENAI_API_KEY,
      gemini: process.env.GEMINI_API_KEY,
      grok: process.env.GROK_API_KEY
    };

    // Get default keys from config
    const configKeys = {
      openai: this.getDefaultApiKey('openai'),
      gemini: this.getDefaultApiKey('gemini'),
      grok: this.getDefaultApiKey('grok')
    };

    // Return environment keys if available, otherwise config keys
    return {
      openai: envKeys.openai || configKeys.openai,
      gemini: envKeys.gemini || configKeys.gemini,
      grok: envKeys.grok || configKeys.grok
    };
  }

  // Get all API keys for a provider
  getApiKeysForProvider(provider) {
    return this.config.apiKeys[provider] || [];
  }

  // Get default API key for a provider
  getDefaultApiKey(provider) {
    const keys = this.config.apiKeys[provider] || [];
    const defaultKey = keys.find(key => key.isDefault);
    return defaultKey ? defaultKey.key : null;
  }

  // Add new API key for a provider
  addApiKey(provider, name, key, isDefault = false) {
    if (!this.config.apiKeys[provider]) {
      this.config.apiKeys[provider] = [];
    }

    // If this is the new default, unset other defaults
    if (isDefault) {
      this.config.apiKeys[provider].forEach(k => k.isDefault = false);
    }

    this.config.apiKeys[provider].push({
      name,
      key,
      isDefault
    });

    this.saveConfig();
  }

  // Remove API key for a provider
  removeApiKey(provider, name) {
    if (!this.config.apiKeys[provider]) return false;

    const index = this.config.apiKeys[provider].findIndex(k => k.name === name);
    if (index !== -1) {
      const removedKey = this.config.apiKeys[provider][index];
      this.config.apiKeys[provider].splice(index, 1);

      // If we removed the default key and there are other keys, make the first one default
      if (removedKey.isDefault && this.config.apiKeys[provider].length > 0) {
        this.config.apiKeys[provider][0].isDefault = true;
      }

      this.saveConfig();
      return true;
    }
    return false;
  }

  // Set default API key for a provider
  setDefaultApiKey(provider, name) {
    if (!this.config.apiKeys[provider]) return false;

    // Unset all defaults first
    this.config.apiKeys[provider].forEach(k => k.isDefault = false);

    // Set the new default
    const key = this.config.apiKeys[provider].find(k => k.name === name);
    if (key) {
      key.isDefault = true;
      this.saveConfig();
      return true;
    }
    return false;
  }

  // Set API key (backward compatibility)
  setApiKey(provider, key) {
    this.addApiKey(provider, 'Default', key, true);
  }

  // Get model for provider
  getModel(provider) {
    return this.config.models[provider] || this.getDefaultModel(provider);
  }

  // Set model for provider
  setModel(provider, model) {
    this.config.models[provider] = model;
    this.saveConfig();
  }

  // Get default model for provider
  getDefaultModel(provider) {
    const defaultModels = {
      openai: 'gpt-3.5-turbo',
      gemini: 'gemini-1.5-flash',
      grok: 'grok-3'
    };
    return defaultModels[provider] || 'unknown';
  }

  // Get all available models for a provider
  getAvailableModels(provider) {
    const models = {
      openai: [
        // GPT-3.5 family
        'gpt-3.5-turbo',
        'gpt-3.5-turbo-16k',

        // GPT-4 family
        'gpt-4',
        'gpt-4-0314',          // legacy
        'gpt-4-0613',          // legacy
        'gpt-4-turbo',         // current standard
        'gpt-4-1106-preview',  // legacy turbo
        'gpt-4-0125-preview',  // legacy turbo

        // GPT-4o family (Omni)
        'gpt-4o',              // flagship multimodal
        'gpt-4o-mini',         // lightweight/cheaper
        'gpt-4o-mini-2024-06-15' // versioned release
      ],
      gemini: [
        'gemini-1.0',
        'gemini-1.0-vision',
        'gemini-1.0-pro',
        'gemini-1.0-pro-vision',
        'gemini-1.5-flash',
        'gemini-1.5-flash-002',
        'gemini-1.5-pro',
        'gemini-1.5-pro-002',
        'gemini-2.0-flash',
        'gemini-2.0-flash‑lite',
        'gemini-2.0-pro',
        'gemini-2.0-flash-thinking' ,  // agentic reasoning variant
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.5-flash‑lite'
      ],
      grok: [
        // Grok 4 series
        'grok-4-0709',
        'grok-4',
        'grok-4-latest',
        'grok-4-heavy',

        // Grok 3 series
        'grok-3',
        'grok-3-mini',
        'grok-3-fast',
        'grok-3-mini-fast',

        // Grok 2 series (vision and image generation)
        'grok-2-vision-1212',
        'grok-2-image-1212'
      ]
      
    };
    return models[provider] || [];
  }

  // Get default provider
  getDefaultProvider() {
    return this.config.defaultProvider;
  }

  // Set default provider
  setDefaultProvider(provider) {
    this.config.defaultProvider = provider;
    this.config.firstRun = false;
    this.saveConfig();
  }

  // Check if this is first run
  isFirstRun() {
    return this.config.firstRun;
  }

  // Get available providers based on API keys
  getAvailableProviders() {
    const apiKeys = this.getApiKeys();
    const providers = [];
    
    if (apiKeys.openai) {
      providers.push('openai');
    }
    if (apiKeys.gemini) {
      providers.push('gemini');
    }
    if (apiKeys.grok) {
      providers.push('grok');
    }
    
    return providers;
  }

  // Check if any API keys are available
  hasAnyApiKeys() {
    const apiKeys = this.getApiKeys();
    return apiKeys.openai || apiKeys.gemini || apiKeys.grok;
  }

  // Get provider names for display
  getProviderNames() {
    return {
      openai: 'ChatGPT (OpenAI)',
      gemini: 'Gemini (Google)',
      grok: 'Grok AI (xAI)'
    };
  }

  // Get current configuration summary
  getConfigSummary() {
    const apiKeys = this.getApiKeys();
    const summary = {
      defaultProvider: this.config.defaultProvider,
      providers: {}
    };

    // Show all providers, even those without API keys
    const allProviders = ['openai', 'gemini', 'grok'];
    
    allProviders.forEach(provider => {
      const hasKey = apiKeys[provider];
      const keyCount = this.config.apiKeys[provider] ? this.config.apiKeys[provider].length : 0;
      
      summary.providers[provider] = {
        name: this.getProviderNames()[provider],
        model: this.getModel(provider),
        hasKey: !!hasKey,
        keyCount: keyCount
      };
    });

    return summary;
  }

  // Export configuration to JSON string
  exportConfig() {
    try {
      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        config: {
          ...this.config,
          // Remove sensitive data for export (optional)
          // apiKeys: {} // Uncomment to exclude API keys from export
        }
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting config:', error.message);
      return null;
    }
  }

  // Export configuration to file
  exportConfigToFile(filePath) {
    try {
      const exportData = this.exportConfig();
      if (!exportData) return false;
      
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, exportData);
      return true;
    } catch (error) {
      console.error('Error exporting config to file:', error.message);
      return false;
    }
  }

  // Import configuration from JSON string
  importConfig(jsonString) {
    try {
      const importData = JSON.parse(jsonString);
      
      // Validate the imported data
      if (!importData.config || typeof importData.config !== 'object') {
        throw new Error('Invalid configuration format');
      }

      // Validate required fields
      const requiredFields = ['apiKeys', 'models', 'defaultProvider'];
      for (const field of requiredFields) {
        if (!importData.config[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate API keys structure
      const validProviders = ['openai', 'gemini', 'grok'];
      for (const provider of validProviders) {
        if (importData.config.apiKeys[provider] && !Array.isArray(importData.config.apiKeys[provider])) {
          throw new Error(`Invalid API keys format for ${provider}`);
        }
      }

      // Import the configuration
      this.config = {
        ...this.config, // Keep current defaults
        ...importData.config // Override with imported data
      };

      // Save the imported configuration
      return this.saveConfig();
    } catch (error) {
      console.error('Error importing config:', error.message);
      return false;
    }
  }

  // Import configuration from file
  importConfigFromFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('Configuration file not found');
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      return this.importConfig(fileContent);
    } catch (error) {
      console.error('Error importing config from file:', error.message);
      return false;
    }
  }

  // Get configuration file path
  getConfigPath() {
    return this.configPath;
  }
}

module.exports = ConfigManager; 