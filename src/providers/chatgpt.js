const OpenAI = require('openai');
const RetryManager = require('../utils/retry');

class ChatGPTProvider {
  constructor(configManager = null) {
    this.name = 'ChatGPT (OpenAI)';
    this.key = 'openai';
    this.client = null;
    this.apiKey = null;
    this.model = configManager ? configManager.getModel('openai') : 'gpt-3.5-turbo';
    this.configManager = configManager;
    this.retryManager = new RetryManager();
  }

  // Initialize the provider with API key
  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    this.client = new OpenAI({ apiKey });
    this.apiKey = apiKey;
    
    // Update model from config if available
    if (this.configManager) {
      this.model = this.configManager.getModel('openai');
    }
  }

  // Update model for this provider
  updateModel(model) {
    this.model = model;
    if (this.configManager) {
      this.configManager.setModel('openai', model);
    }
  }

  // Get available models
  getAvailableModels() {
    return [
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
      'gpt-4',
      'gpt-4-turbo',
      'gpt-4o',
      'gpt-4o-mini'
    ];
  }

  // Get default model
  getDefaultModel() {
    return 'gpt-3.5-turbo';
  }

  // Send message to ChatGPT with retry logic
  async sendMessage(message, history = [], onRetry = null) {
    if (!this.client) {
      throw new Error('ChatGPT provider is not initialized');
    }

    return await this.retryManager.executeWithRetry(async () => {
      const messages = [
        ...history.map(msg => ({
          role: msg.role === 'You' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 1000,
        temperature: 0.7
      });

      return completion.choices[0].message.content;
    }, onRetry);
  }

  // Check if provider is initialized
  isInitialized() {
    return this.client !== null;
  }

  // Get provider info
  getInfo() {
    return {
      name: this.name,
      key: this.key,
      model: this.model,
      initialized: this.isInitialized()
    };
  }
}

module.exports = ChatGPTProvider; 