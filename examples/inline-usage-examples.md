# Terminal Agent Inline Usage Examples

This file demonstrates various ways to use Terminal Agent with inline arguments and different command-line options.

## 🚀 **Basic Usage Examples**

### **1. Simple Chat with Default Provider**
```bash
# Start chat with default provider
node index.js

# Or using the CLI
terminal-agent
```

### **2. Direct Message with Inline Arguments**
```bash
# Send a single message and get response
node index.js --ask "What is the capital of France?"

# Using CLI
terminal-agent --ask "Explain quantum computing in simple terms"
```

### **3. Provider-Specific Usage**
```bash
# Start with specific provider
node index.js openai
node index.js gemini
node index.js grok

# Using CLI
terminal-agent openai
terminal-agent gemini
terminal-agent grok
```

## 🔧 **Configuration and Setup Examples**

### **4. Setup and Configuration**
```bash
# Run setup wizard
node index.js --setup
terminal-agent --setup

# Show current configuration
node index.js --config
terminal-agent --config
```

### **5. Import/Export Configuration**
```bash
# Export configuration to file
node index.js --export my-config.json
terminal-agent --export backup-config.json

# Import configuration from file
node index.js --import my-config.json
terminal-agent --import backup-config.json
```

## 🐛 **Debugging and Troubleshooting**

### **6. Debug Mode**
```bash
# Enable debug mode for troubleshooting
node index.js --debug
terminal-agent --debug

# Debug with specific provider
node index.js --debug openai
terminal-agent --debug gemini
```

### **7. Version Information**
```bash
# Check version
node index.js --version
terminal-agent --version

# Show help
node index.js --help
terminal-agent --help
```

## 📝 **Advanced Usage Examples**

### **8. Output to File**
```bash
# Send message and save response to file
node index.js --ask "Write a Python function to calculate fibonacci" --output response.txt
terminal-agent --ask "Explain machine learning" --output ml-explanation.txt
```

### **9. Complex Queries**
```bash
# Multi-line queries (use quotes for complex messages)
node index.js --ask "Create a JavaScript function that: 1) Takes an array of numbers 2) Returns the sum of even numbers 3) Handles edge cases"

# Code generation
terminal-agent --ask "Write a React component for a todo list with add/delete functionality"
```

### **10. Provider-Specific Prompts**
```bash
# Ask ChatGPT specifically
node index.js openai --ask "What are the latest developments in AI?"

# Ask Gemini specifically
node index.js gemini --ask "Explain the differences between Python and JavaScript"

# Ask Grok specifically
node index.js grok --ask "What are the implications of quantum computing for cryptography?"
```

## 🎯 **Real-World Use Cases**

### **11. Code Review and Analysis**
```bash
# Review code snippet
node index.js --ask "Review this code for best practices: function calculateSum(arr) { return arr.reduce((a,b) => a+b, 0); }"

# Debug code
terminal-agent --ask "Help me debug this error: TypeError: Cannot read property 'length' of undefined"
```

### **12. Documentation and Writing**
```bash
# Generate documentation
node index.js --ask "Write documentation for a REST API endpoint that handles user registration"

# Create README
terminal-agent --ask "Create a README.md for a Node.js project called 'weather-app'"
```

### **13. Learning and Education**
```bash
# Learn a new concept
node index.js --ask "Explain Docker containers like I'm a beginner"

# Practice coding
terminal-agent --ask "Give me 5 coding challenges for practicing JavaScript arrays"
```

### **14. Problem Solving**
```bash
# Algorithm help
node index.js --ask "What's the most efficient way to find duplicates in an array?"

# System design
terminal-agent --ask "Design a scalable chat application architecture"
```

## 🔄 **Workflow Examples**

### **15. Development Workflow**
```bash
# Quick code review
node index.js --ask "Review this function for potential issues" --output review.txt

# Generate test cases
terminal-agent --ask "Generate unit tests for a function that validates email addresses"

# Refactor suggestions
node index.js --ask "Suggest improvements for this code: [paste code here]"
```

### **16. Documentation Workflow**
```bash
# Generate API docs
node index.js --ask "Create OpenAPI specification for a user management API"

# Write commit messages
terminal-agent --ask "Write a conventional commit message for: Added user authentication feature"
```

### **17. Learning Workflow**
```bash
# Study sessions
node index.js --ask "Create a study plan for learning React hooks"

# Practice problems
terminal-agent --ask "Give me 3 coding problems to practice recursion"
```

## ⚙️ **Configuration Examples**

### **18. Environment Variables**
```bash
# Set API keys via environment variables
export OPENAI_API_KEY="sk-your-key-here"
export GEMINI_API_KEY="AIza-your-key-here"
export GROK_API_KEY="sk-proj-your-key-here"

# Then run
node index.js
```

### **19. Configuration File**
```bash
# Export current config
node index.js --export config.json

# Edit config.json manually, then import
node index.js --import config.json
```

## 🎨 **UI and Display Examples**

### **20. Different Display Modes**
```bash
# Normal mode (full-screen UI)
node index.js

# Inline mode (for scripts)
node index.js --ask "Quick question" --output response.txt

# Debug mode (with detailed logging)
node index.js --debug --ask "Test message"
```

## 📊 **Output Examples**

### **21. File Output Examples**
```bash
# Save response to file
node index.js --ask "Write a Python script to parse CSV files" --output csv_parser.py

# Save multiple responses
terminal-agent --ask "Create 3 different sorting algorithms" --output sorting_algorithms.txt
```

### **22. Console Output Examples**
```bash
# Direct console output
node index.js --ask "What's 2+2?"
# Output: 4

# With debug info
node index.js --debug --ask "Test message"
# Output: [Debug info] + response
```

## 🔍 **Troubleshooting Examples**

### **23. Common Issues**
```bash
# Check if API keys are configured
node index.js --config

# Test specific provider
node index.js --debug openai --ask "Test message"

# Verify version
node index.js --version
```

### **24. Error Handling**
```bash
# Test with invalid API key
node index.js --debug --ask "Test message"
# Will show detailed error information

# Test connection
terminal-agent --debug --ask "Simple test"
# Will show connection status and retry attempts
```

## 🚀 **Quick Reference**

### **Most Common Commands:**
```bash
# Start chat
node index.js

# Quick question
node index.js --ask "Your question here"

# Debug mode
node index.js --debug

# Check version
node index.js --version

# Setup
node index.js --setup

# Export config
node index.js --export config.json
```

### **Provider-Specific:**
```bash
# ChatGPT
node index.js openai --ask "Question"

# Gemini
node index.js gemini --ask "Question"

# Grok
node index.js grok --ask "Question"
```

### **File Operations:**
```bash
# Save response to file
node index.js --ask "Question" --output file.txt

# Import configuration
node index.js --import config.json

# Export configuration
node index.js --export config.json
```

---

## 📝 **Notes**

- All examples work with both `node index.js` and `terminal-agent` (if installed globally)
- Use quotes around complex messages with spaces or special characters
- The `--debug` flag provides detailed logging for troubleshooting
- Configuration is automatically saved and persists between sessions
- API keys can be set via environment variables or through the settings menu 