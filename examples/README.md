# TerminalAI Examples

This directory contains examples and usage patterns for TerminalAI.

## 📁 **Files in this Directory**

### **1. `inline-usage-examples.md`**
Comprehensive documentation showing all types of inline usage with TerminalAI, including:
- Basic usage examples
- Configuration and setup
- Debugging and troubleshooting
- Advanced usage patterns
- Real-world use cases
- Workflow examples
- Quick reference guide

### **2. `usage-script.sh`**
Executable shell script demonstrating practical usage examples:
- Version checking
- Simple questions
- Code generation
- Debug mode
- Provider-specific queries
- Configuration checks
- Complex queries
- Documentation generation
- Learning examples
- Problem solving

## 🚀 **Quick Start**

### **Run the Example Script**
```bash
# Make sure you're in the TerminalAI directory
cd /path/to/TerminalAI

# Run the example script
./examples/usage-script.sh
```

### **Try Individual Examples**
```bash
# Check version
node index.js --version

# Ask a simple question
node index.js --ask "What is 2+2?"

# Generate code and save to file
node index.js --ask "Write a Python function to calculate factorial" --output factorial.py

# Debug mode
node index.js --debug --ask "Test message"
```

## 📋 **Example Categories**

### **Basic Usage**
- Simple chat interface
- Direct message queries
- Provider-specific usage
- Version and help commands

### **Configuration**
- Setup wizard
- Configuration management
- Import/export settings
- Environment variables

### **Advanced Features**
- File output
- Complex queries
- Provider-specific prompts
- Debug mode

### **Real-World Use Cases**
- Code review and analysis
- Documentation generation
- Learning and education
- Problem solving
- Development workflows

## 🎯 **Common Patterns**

### **Quick Questions**
```bash
node index.js --ask "Your question here"
```

### **Save Response to File**
```bash
node index.js --ask "Your question" --output filename.txt
```

### **Debug Mode**
```bash
node index.js --debug --ask "Test message"
```

### **Provider-Specific**
```bash
node index.js openai --ask "Question for ChatGPT"
node index.js gemini --ask "Question for Gemini"
node index.js grok --ask "Question for Grok"
```

### **Configuration**
```bash
node index.js --config          # Show current config
node index.js --setup           # Run setup wizard
node index.js --export file.json # Export config
node index.js --import file.json # Import config
```

## 📝 **Notes**

- All examples assume you're running from the TerminalAI root directory
- API keys need to be configured for full functionality
- Use quotes around complex messages with spaces
- The `--debug` flag provides detailed logging
- File outputs are saved in the current directory
- Configuration is automatically saved and persists

## 🔧 **Troubleshooting**

If examples don't work:

1. **Check API keys**: Run `node index.js --config`
2. **Run setup**: `node index.js --setup`
3. **Enable debug**: Add `--debug` flag to see detailed logs
4. **Check version**: `node index.js --version`

## 📚 **More Information**

- See `inline-usage-examples.md` for comprehensive examples
- Run `./examples/usage-script.sh` for interactive demonstrations
- Check the main README.md for installation and setup instructions 