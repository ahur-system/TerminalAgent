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
          return this.ensurePreBuiltAgents(migratedConfig);
        }
        
        return this.ensurePreBuiltAgents(config);
      }
    } catch (error) {
      console.error('Error loading config:', error.message);
    }
    
    // Default configuration
    return this.ensurePreBuiltAgents({
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
      agents: {
        default: 'general',
        list: {
          general: {
            name: 'General Assistant',
            instructions: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user questions.'
          }
        }
      },
      firstRun: true
    });
  }

  // Ensure pre-built agents are always available
  ensurePreBuiltAgents(config) {
    const preBuiltAgents = {
      programmer: {
        name: 'Code Assistant',
        instructions: 'You are an expert programmer and software developer. Help with coding, debugging, architecture, and technical questions. Provide code examples, explain concepts clearly, and suggest best practices. Always consider security, performance, and maintainability in your recommendations.'
      },
      writer: {
        name: 'Writing Assistant',
        instructions: 'You are a professional writer and editor. Help with writing, editing, grammar, style, and content creation. Provide clear, engaging, and well-structured content. Offer suggestions for improvement while maintaining the author\'s voice and intent.'
      },
      researcher: {
        name: 'Research Assistant',
        instructions: 'You are a thorough research assistant. Help gather information, analyze data, and provide well-sourced answers. Always cite sources when possible, present balanced perspectives, and distinguish between facts and opinions.'
      },
      teacher: {
        name: 'Educational Assistant',
        instructions: 'You are an experienced educator. Help explain complex topics in simple terms, create learning materials, and adapt explanations to different skill levels. Use analogies, examples, and step-by-step explanations to make concepts accessible.'
      },
      analyst: {
        name: 'Data Analyst',
        instructions: 'You are a skilled data analyst. Help interpret data, create visualizations, identify trends, and provide insights. Focus on practical analysis that leads to actionable recommendations.'
      },
      creative: {
        name: 'Creative Assistant',
        instructions: 'You are a creative professional. Help with brainstorming, ideation, artistic projects, and innovative solutions. Encourage creative thinking while providing practical guidance for bringing ideas to life.'
      },
      debugger: {
        name: 'Debugging Assistant',
        instructions: 'You are a debugging expert. Help identify and fix issues in code, troubleshoot problems, and optimize performance. Ask clarifying questions to understand the problem context and provide systematic debugging approaches.'
      },
      reviewer: {
        name: 'Code Reviewer',
        instructions: 'You are an experienced code reviewer. Analyze code for bugs, security issues, performance problems, and maintainability. Provide constructive feedback and suggest improvements while explaining the reasoning behind your recommendations.'
      },
      architect: {
        name: 'System Architect',
        instructions: 'You are a system architect and technical consultant. Help design software architectures, choose appropriate technologies, and plan system implementations. Consider scalability, security, performance, and maintainability in your recommendations.'
      }
    };

    // Ensure agents structure exists
    if (!config.agents) {
      config.agents = { default: 'general', list: {} };
    }
    if (!config.agents.list) {
      config.agents.list = {};
    }

    // Merge pre-built agents with existing agents (don't overwrite existing ones)
    Object.entries(preBuiltAgents).forEach(([id, agent]) => {
      if (!config.agents.list[id]) {
        config.agents.list[id] = agent;
      }
    });

    return config;
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
      if (!exportData) {
        console.error('❌ No configuration data to export');
        return false;
      }
      
      // Resolve the path to handle both absolute and relative paths
      const resolvedPath = path.resolve(filePath);
      const dir = path.dirname(resolvedPath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch (error) {
          console.error(`❌ Failed to create directory: ${dir}`);
          console.error(`Error: ${error.message}`);
          return false;
        }
      }
      
      // Check if we can write to the directory
      try {
        const testFile = path.join(dir, '.test-write');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
      } catch (error) {
        console.error(`❌ No write permission for directory: ${dir}`);
        console.error(`Error: ${error.message}`);
        return false;
      }
      
      // Write the configuration file
      fs.writeFileSync(resolvedPath, exportData);
      
      // Verify the file was written successfully
      if (!fs.existsSync(resolvedPath)) {
        console.error('❌ File was not created after write operation');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error exporting config to file:', error.message);
      return false;
    }
  }

  // Import configuration from JSON string
  importConfig(jsonString) {
    try {
      const importData = JSON.parse(jsonString);
      
      // Validate the imported data structure
      if (!importData || typeof importData !== 'object') {
        console.error('❌ Invalid configuration format: root must be an object');
        return false;
      }
      
      // Check if it's the new format with config wrapper
      let configData;
      if (importData.config) {
        configData = importData.config;
      } else if (importData.apiKeys || importData.models || importData.defaultProvider) {
        // Direct config format (legacy or direct)
        configData = importData;
      } else {
        console.error('❌ Invalid configuration format: missing config object or direct config properties');
        return false;
      }
      
      // Validate required fields
      const requiredFields = ['apiKeys', 'models', 'defaultProvider'];
      for (const field of requiredFields) {
        if (!configData[field]) {
          console.error(`❌ Missing required field: ${field}`);
          return false;
        }
      }

      // Validate API keys structure
      const validProviders = ['openai', 'gemini', 'grok'];
      for (const provider of validProviders) {
        if (configData.apiKeys[provider] && !Array.isArray(configData.apiKeys[provider])) {
          console.error(`❌ Invalid API keys format for ${provider}: must be an array`);
          return false;
        }
      }

      // Validate models structure
      for (const provider of validProviders) {
        if (configData.models[provider] && typeof configData.models[provider] !== 'string') {
          console.error(`❌ Invalid model format for ${provider}: must be a string`);
          return false;
        }
      }

      // Import the configuration
      this.config = {
        ...this.config, // Keep current defaults
        ...configData // Override with imported data
      };

      // Ensure pre-built agents are always available
      this.config = this.ensurePreBuiltAgents(this.config);

      // Save the imported configuration
      const saveResult = this.saveConfig();
      if (saveResult) {
        console.log('✅ Configuration imported and saved successfully');
      } else {
        console.error('❌ Failed to save imported configuration');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error importing config:', error.message);
      return false;
    }
  }

  // Import configuration from file
  importConfigFromFile(filePath) {
    try {
      // Resolve the path to handle both absolute and relative paths
      const resolvedPath = path.resolve(filePath);
      
      if (!fs.existsSync(resolvedPath)) {
        console.error(`❌ Configuration file not found: ${resolvedPath}`);
        return false;
      }
      
      // Check if it's a file and readable
      const stats = fs.statSync(resolvedPath);
      if (!stats.isFile()) {
        console.error(`❌ Path is not a file: ${resolvedPath}`);
        return false;
      }
      
      if (stats.size === 0) {
        console.error(`❌ Configuration file is empty: ${resolvedPath}`);
        return false;
      }
      
      // Read and parse the file
      let fileContent;
      try {
        fileContent = fs.readFileSync(resolvedPath, 'utf8');
      } catch (error) {
        console.error(`❌ Cannot read file: ${resolvedPath}`);
        console.error(`Error: ${error.message}`);
        return false;
      }
      
      // Validate JSON format
      try {
        JSON.parse(fileContent);
      } catch (error) {
        console.error(`❌ Invalid JSON format in file: ${resolvedPath}`);
        console.error(`Error: ${error.message}`);
        return false;
      }
      
      return this.importConfig(fileContent);
    } catch (error) {
      console.error(`❌ Error importing config from file: ${error.message}`);
      return false;
    }
  }

  // Get configuration file path
  getConfigPath() {
    return this.configPath;
  }

  // Agent management methods
  getAgents() {
    return this.config.agents || { default: 'general', list: {} };
  }

  getAgentList() {
    const agents = this.getAgents();
    return agents.list || {};
  }

  getDefaultAgent() {
    const agents = this.getAgents();
    return agents.default || 'general';
  }

  setDefaultAgent(agentId) {
    if (!this.config.agents) {
      this.config.agents = { default: 'general', list: {} };
    }
    this.config.agents.default = agentId;
    this.saveConfig();
  }

  getAgent(agentId) {
    const agents = this.getAgentList();
    return agents[agentId];
  }

  addAgent(agentId, name, instructions) {
    if (!this.config.agents) {
      this.config.agents = { default: 'general', list: {} };
    }
    if (!this.config.agents.list) {
      this.config.agents.list = {};
    }
    
    this.config.agents.list[agentId] = {
      name,
      instructions
    };
    this.saveConfig();
  }

  removeAgent(agentId) {
    if (this.config.agents && this.config.agents.list) {
      delete this.config.agents.list[agentId];
      
      // If we're removing the default agent, set a new default
      if (this.config.agents.default === agentId) {
        const remainingAgents = Object.keys(this.config.agents.list);
        if (remainingAgents.length > 0) {
          this.config.agents.default = remainingAgents[0];
        } else {
          // If no agents left, create a default one
          this.config.agents.list.general = {
            name: 'General Assistant',
            instructions: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user questions.'
          };
          this.config.agents.default = 'general';
        }
      }
      this.saveConfig();
    }
  }

  updateAgent(agentId, name, instructions) {
    if (this.config.agents && this.config.agents.list && this.config.agents.list[agentId]) {
      this.config.agents.list[agentId] = {
        name,
        instructions
      };
      this.saveConfig();
    }
  }

  getCurrentAgentInstructions() {
    const defaultAgent = this.getDefaultAgent();
    const agent = this.getAgent(defaultAgent);
    return agent ? agent.instructions : '';
  }
}

module.exports = ConfigManager; 