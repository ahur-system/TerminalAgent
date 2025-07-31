const axios = require('axios');

class GeminiProvider {
  constructor(configManager = null) {
    this.name = 'Gemini (Google)';
    this.key = 'gemini';
    this.client = null;
    this.apiKey = null;
    this.model = configManager ? configManager.getModel('gemini') : 'gemini-2.0-flash';
    this.configManager = configManager;
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

  // Send message to Gemini using direct API call (exactly like your working curl)
  async sendMessage(message, history = []) {
    if (!this.apiKey) {
      throw new Error('Gemini provider is not initialized');
    }

    try {
      // Convert history to the exact format from your working curl
      const contents = [];
      
      // Add history messages (without role field)
      for (const msg of history) {
        contents.push({
          parts: [{ text: msg.content }]
        });
      }
      
      // Add current message (without role field)
      contents.push({
        parts: [{ text: message }]
      });

      console.log(`🔍 Debug: Using model: ${this.model}`);
      console.log(`🔍 Debug: API Key: ${this.apiKey.substring(0, 10)}...`);
      console.log(`🔍 Debug: Sending request to Gemini API...`);

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent`,
        {
          contents: contents
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': this.apiKey
          }
        }
      );

      console.log(`✅ Debug: Request successful`);
      
      // Extract the response text
      const responseText = response.data.candidates[0].content.parts[0].text;
      return responseText;
      
    } catch (error) {
      console.log(`❌ Debug: Request failed with error: ${error.message}`);
      if (error.response) {
        console.log(`🔍 Debug: Response status: ${error.response.status}`);
        console.log(`🔍 Debug: Response data:`, error.response.data);
      }
      throw new Error(`Gemini API Error: ${error.message}`);
    }
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