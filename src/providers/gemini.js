const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiProvider {
  constructor(configManager = null) {
    this.name = 'Gemini (Google)';
    this.key = 'gemini';
    this.client = null;
    this.apiKey = null;
    this.model = configManager ? configManager.getModel('gemini') : 'gemini-1.5-flash';
    this.configManager = configManager;
  }

  // Initialize the provider with API key
  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    
    this.client = new GoogleGenerativeAI(apiKey);
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
      'gemini-2.5-flash',
      'gemini-2.5-pro'
    ];
  }

  // Get default model
  getDefaultModel() {
    return 'gemini-1.5-flash';
  }

  // Send message to Gemini
  async sendMessage(message, history = []) {
    if (!this.client) {
      throw new Error('Gemini provider is not initialized');
    }

    const model = this.client.getGenerativeModel({
      model: this.model
    });

    // Convert history to Gemini format
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'You' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
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

module.exports = GeminiProvider; 