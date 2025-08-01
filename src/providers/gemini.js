const axios = require('axios');
const debug = require('../debugger');
const RetryManager = require('../utils/retry');

class GeminiProvider {
  constructor(configManager = null) {
    this.name = 'Gemini (Google)';
    this.key = 'gemini';
    this.client = null;
    this.apiKey = null;
    this.model = configManager ? configManager.getModel('gemini') : 'gemini-2.0-flash';
    this.configManager = configManager;
    this.retryManager = new RetryManager();
  }

  // Initialize the provider with API key
  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    
    this.apiKey = apiKey;
    
    // Update model from config if available
    if (this.configManager) {
      this.model = this.configManager.getModel('gemini');
    }
  }

  // Update model for this provider
  updateModel(model) {
    this.model = model;
    if (this.configManager) {
      this.configManager.setModel('gemini', model);
    }
  }

  // Get available models
  getAvailableModels() {
    return [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro',
      'gemini-2.0-flash',
      'gemini-2.0-pro',
      'gemini-2.5-flash',
      'gemini-2.5-pro'
    ];
  }

  // Get default model
  getDefaultModel() {
    return 'gemini-2.0-flash';
  }

  // Send message to Gemini using direct API call with retry logic
  async sendMessage(message, history = [], onRetry = null) {
    if (!this.apiKey) {
      throw new Error('Gemini provider is not initialized');
    }

    return await this.retryManager.executeWithRetry(async () => {
      // Convert history to the exact format from your working curl
      // For chat conversations, we need to include role fields
      const contents = [];
      
      // Add history messages (only user messages)
      for (const msg of history) {
        if (msg.role === 'You') {
          contents.push({
            role: 'user',
            parts: [{ text: msg.content }]
          });
        }
      }
      
      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const url = `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent`;
      const headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': this.apiKey
      };
      const body = { contents: contents };

      debug.log('Gemini API Request', { model: this.model, messageLength: message.length, historyCount: contents.length });
      debug.logHttpRequest(url, 'POST', headers, body);

      const response = await axios.post(url, body, { headers });

      debug.success('Gemini API Request successful');
      debug.logHttpResponse(response.status, response.headers, response.data);
      
      // Extract the response text
      const responseText = response.data.candidates[0].content.parts[0].text;
      return responseText;
    }, onRetry);
  }

  // Check if provider is initialized
  isInitialized() {
    return this.apiKey !== null;
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

module.exports = GeminiProvider; 