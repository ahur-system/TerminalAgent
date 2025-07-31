const axios = require('axios');

class GrokProvider {
  constructor(configManager = null) {
    this.name = 'Grok AI (xAI)';
    this.key = 'grok';
    this.client = null;
    this.apiKey = null;
    this.model = configManager ? configManager.getModel('grok') : 'grok-3';
    this.configManager = configManager;
    this.baseUrl = 'https://api.x.ai/v1';
  }

  // Initialize the provider with API key
  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('Grok AI API key is required');
    }
    
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Update model from config if available
    if (this.configManager) {
      this.model = this.configManager.getModel('grok');
    }
  }

  // Update model for this provider
  updateModel(model) {
    this.model = model;
    if (this.configManager) {
      this.configManager.setModel('grok', model);
    }
  }

  // Get available models
  getAvailableModels() {
    return [
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
    ];
  }

  // Get default model
  getDefaultModel() {
    return 'grok-3';
  }

  // Send message to Grok AI
  async sendMessage(message, history = []) {
    if (!this.client) {
      throw new Error('Grok AI provider is not initialized');
    }

    const messages = [
      ...history.map(msg => ({
        role: msg.role === 'You' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    try {
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages,
        max_tokens: 1000,
        temperature: 0.7
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response) {
        throw new Error(`Grok AI API error: ${error.response.data.error?.message || error.response.statusText}`);
      } else {
        throw new Error(`Grok AI request error: ${error.message}`);
      }
    }
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

module.exports = GrokProvider; 