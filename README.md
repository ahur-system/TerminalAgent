# Terminal Agent

A full-screen terminal application for chatting with multiple AI providers (ChatGPT, Gemini, and Grok) directly from your terminal.

> **Current Version**: 1.12.5
> 
> ✨ **Latest Release**: This version includes agent selection, file processing, and advanced workflows.

## Quick Start

```bash
terminal-agent openai --agent reviewer --ask "Review this code" --input code.js --output review.txt
terminal-agent gemini --agent writer --ask "Rewrite this content" --input draft.txt --output final.txt
terminal-agent grok --agent debugger --ask "Debug this error" --input error.log --output solution.txt
```

## Features

- 🖥️ Full-screen terminal interface
- 🤖 Multi-provider support (ChatGPT, Gemini, and Grok AI)
- 🎭 Agent selection with 10 specialized agents
- 📁 File processing with input/output capabilities
- 🔄 Easy provider switching with keyboard shortcuts
- 💬 Real-time chat with AI assistants
- 📜 Scrollable chat history
- ⌨️ Easy keyboard shortcuts
- 🔒 Secure API key management with multiple named keys per provider
- 📊 Status bar showing current provider and model
- ⚙️ Configuration management with first-time setup
- 🚀 Command-line provider selection
- 🎛️ Model selection for each provider
- 🔧 Settings menu for configuration management
- 🔑 API key management (add, remove, set default)
- 🏗️ Modular architecture with organized codebase

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Make the CLI executable:
   ```bash
   chmod +x bin/terminal-agent.js
   ```

4. Install globally (optional):
   ```bash
   npm install -g .
   ```

## First Time Setup

When you run the application for the first time, it will guide you through setup:

1. **Check for API keys** - The app will look for your API keys
2. **Select default provider** - Choose which AI provider to use by default
3. **Configure models** - Select models for each provider (optional)
4. **Configuration saved** - Your preferences are saved for future use

### Manual Setup

You can also run the setup wizard manually:

```bash
terminal-agent --setup
# or
terminal-agent -s
```

## API Keys Setup

The application supports multiple AI providers with the ability to manage multiple named API keys per provider. You can set up API keys in several ways:

### Method 1: Environment Variables (Recommended)

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
GROK_API_KEY=your-grok-api-key-here
```

### Method 2: Settings Menu

Use the `/settings` command to manage API keys through the interactive menu:

1. Type `/settings` in the chat
2. Select "Manage API keys"
3. Choose a provider (ChatGPT, Gemini, or Grok AI)
4. Add, remove, or set default keys

### Method 3: Configuration File

API keys are automatically saved to `config.json` in the project directory after setup.

## Usage

### Basic Usage

```bash
# Start with default provider
terminal-agent

# Start with specific provider
terminal-agent openai
terminal-agent gemini
terminal-agent grok

# Run setup wizard
terminal-agent --setup

# Show current configuration
terminal-agent --config

# Export configuration to file
terminal-agent --export config-backup.json

# Import configuration from file
terminal-agent --import config-backup.json
```

### Command Line Options

- `terminal-agent [provider]` - Start with specific provider (openai, gemini, grok)
- `terminal-agent --setup` or `-s` - Run setup wizard
- `terminal-agent --config` or `-c` - Show current configuration
- `terminal-agent --export [file]` or `-e [file]` - Export configuration to file
- `terminal-agent --import [file]` or `-i [file]` - Import configuration from file

### Advanced Usage with Agents and File Processing

Terminal Agent supports specialized agents and file processing for advanced workflows:

#### Agent Selection
```bash
# Use a specific agent for specialized tasks
terminal-agent --agent reviewer --ask "Review this code for best practices"
terminal-agent --agent writer --ask "Help me write a blog post"
terminal-agent --agent debugger --ask "Help me fix this error"
```

#### File Processing
```bash
# Process input files and save results
terminal-agent --ask "Summarize this content" --input document.txt --output summary.txt
terminal-agent --agent programmer --ask "Add comments to this code" --input script.py --output commented.py
```

#### Combined Usage
```bash
# Provider + Agent + File Processing
terminal-agent openai --agent reviewer --ask "Review this code" --input code.js --output review.txt
terminal-agent gemini --agent writer --ask "Rewrite this content" --input draft.txt --output final.txt
terminal-agent grok --agent debugger --ask "Debug this error" --input error.log --output solution.txt
```

#### Available Agents
- **`programmer`** - Code Assistant
- **`SEO`** - SEO Expert
- **`writer`** - Writing Assistant
- **`researcher`** - Research Assistant
- **`teacher`** - Educational Assistant
- **`analyst`** - Data Analyst
- **`creative`** - Creative Assistant
- **`debugger`** - Debugging Assistant
- **`reviewer`** - Code Reviewer
- **`architect`** - System Architect

#### Advanced Command Line Options
- `terminal-agent --agent [agentid]` - Select specific agent
- `terminal-agent --ask [message]` - Send direct message
- `terminal-agent --input [file]` - Process input file
- `terminal-agent --output [file]` - Save response to file
- `terminal-agent --debug` - Enable debug mode

### Controls

- **Type message**: Send message to AI
- **/switch**: Switch between providers
- **/settings**: Open settings menu
- **/help**: Show help
- **/clear**: Clear chat history
- **/exit**: Exit application

### Settings Menu

Access the settings menu by typing `/settings` in the chat:

- **Change default provider**: Switch your default AI provider
- **Change model for provider**: Select different models for each provider
- **Manage API keys**: Add, remove, and manage API keys for each provider
- **Import/Export configuration**: Backup, restore, and share configurations
- **Back to chat**: Return to the main chat interface

### API Key Management

Through the settings menu, you can:

- **Add new API keys**: Add multiple named keys for each provider
- **Remove API keys**: Delete keys you no longer need
- **Set default key**: Choose which key to use by default for each provider
- **View key status**: See how many keys are configured for each provider

Each API key can have a custom name (e.g., "Work Key", "Personal Key", "Test Key") and you can easily switch between them.

## Configuration Management

### Import/Export Configuration

You can backup, restore, and share your Terminal Agent configuration:

#### CLI Commands
```bash
# Export your current configuration
terminal-agent --export my-config.json

# Import a configuration file
terminal-agent --import my-config.json
```

#### Settings Menu
1. Type `/settings` in the chat
2. Select "Import/Export configuration"
3. Choose from:
   - **Export configuration to file**: Save your current settings
   - **Import configuration from file**: Load settings from a file
   - **Show current configuration**: View your settings in JSON format

#### Configuration File Format
Exported configurations include:
- API keys for all providers
- Model selections for each provider
- Default provider setting
- Agent configurations
- Version and timestamp information

Example configuration:
```json
{
  "defaultProvider": "openai",
  "apiKeys": {
    "openai": [{"name": "Work Key", "key": "sk-...", "isDefault": true}],
    "gemini": [{"name": "Personal Key", "key": "AIza...", "isDefault": true}],
    "grok": [{"name": "Test Key", "key": "sk-proj-...", "isDefault": true}]
  },
  "models": {
    "openai": "gpt-3.5-turbo",
    "gemini": "gemini-2.0-flash",
    "grok": "grok-3"
  },
  "agents": {
    "default": "reviewer",
    "list": {
      "programmer": {"name": "Code Assistant", "instructions": "..."},
      "reviewer": {"name": "Code Reviewer", "instructions": "..."}
    }
  }
}
```

## Examples

### Code Review Workflow
```bash
# Review code with specialized agent
terminal-agent --agent reviewer --ask "Review this code for best practices" --input app.js --output review.txt

# Fix issues found in review
terminal-agent --agent debugger --ask "Fix the issues mentioned in the review" --input review.txt --output fixed-code.js
```

### Content Creation Workflow
```bash
# Research topic
terminal-agent --agent researcher --ask "Research this topic thoroughly" --input topic.txt --output research.txt

# Write content based on research
terminal-agent --agent writer --ask "Write an article based on this research" --input research.txt --output article.md

# Optimize for SEO
terminal-agent --agent SEO --ask "Optimize this content for SEO" --input article.md --output seo-optimized.md
```

### Learning and Education
```bash
# Create study materials
terminal-agent --agent teacher --ask "Create study materials for this topic" --input topic.txt --output study-guide.md

# Practice problems
terminal-agent --agent programmer --ask "Create coding exercises for this concept" --input concept.txt --output exercises.txt
```

## Troubleshooting

### Common Issues

1. **API Key Errors**: Run `terminal-agent --config` to check your API keys
2. **Connection Issues**: Use `terminal-agent --debug` to see detailed error information
3. **Setup Problems**: Run `terminal-agent --setup` to reconfigure your settings

### Debug Mode

Enable debug mode for detailed logging:

```bash
terminal-agent --debug
```

This will show:
- HTTP requests and responses
- Error details
- Configuration information
- Provider connection status

## Development

### Project Structure
```
Terminal Agent/
├── bin/
│   └── terminal-agent.js
├── src/
│   ├── config/
│   │   └── config.js
│   ├── providers/
│   │   ├── chatgpt.js
│   │   ├── gemini.js
│   │   ├── grok.js
│   │   └── providers.js
│   ├── setup/
│   │   └── setup-dynamic.js
│   ├── ui/
│   │   └── modern-ui-simple.js
│   └── utils/
│       └── version.js
├── examples/
│   ├── inline-usage-examples.md
│   ├── advanced-usage-examples.md
│   └── usage-script.sh
├── scripts/
│   ├── version-update.js
│   └── update-readme-version.js
├── package.json
├── README.md
└── CHANGELOG.md
```

### Running in Development

To run Terminal Agent in development mode with auto-restart on file changes:

```bash
npm run dev
```

### Building

To build the project:

```bash
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: Check the examples/ directory for usage patterns
- **Configuration**: Use `terminal-agent --config` to view current settings 