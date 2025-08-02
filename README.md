# Terminal AI

A full-screen terminal application for chatting with multiple AI providers (ChatGPT, Gemini, and Grok) directly from your terminal.

> **Current Version**: 1.12.2
> 
> ✨ **Latest Release**: This version includes enhanced status bar with location data, unified styling, and improved UI.

```bash
# Provider + Agent + File Processing
terminal-ai openai --agent reviewer --ask "Review this code" --input code.js --output review.txt
terminal-ai gemini --agent writer --ask "Rewrite this content" --input draft.txt --output final.txt
terminal-ai grok --agent debugger --ask "Debug this error" --input error.log --output solution.txt
```

## Features

- 🖥️ Full-screen terminal interface
- 🤖 Multi-provider support (ChatGPT, Gemini, and Grok AI)
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
   chmod +x bin/terminal-ai.js
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
terminal-ai --setup
# or
terminal-ai -s
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
terminal-ai

# Start with specific provider
terminal-ai openai
terminal-ai gemini
terminal-ai grok

# Run setup wizard
terminal-ai --setup

# Show current configuration
terminal-ai --config

# Export configuration to file
terminal-ai --export config-backup.json

# Import configuration from file
terminal-ai --import config-backup.json
```

### Command Line Options

- `terminal-ai [provider]` - Start with specific provider (openai, gemini, grok)
- `terminal-ai --setup` or `-s` - Run setup wizard
- `terminal-ai --config` or `-c` - Show current configuration
- `terminal-ai --export [file]` or `-e [file]` - Export configuration to file
- `terminal-ai --import [file]` or `-i [file]` - Import configuration from file

### Advanced Usage with Agents and File Processing

TerminalAI supports specialized agents and file processing for advanced workflows:

#### Agent Selection
```bash
# Use a specific agent for specialized tasks
terminal-ai --agent reviewer --ask "Review this code for best practices"
terminal-ai --agent writer --ask "Help me write a blog post"
terminal-ai --agent debugger --ask "Help me fix this error"
```

#### File Processing
```bash
# Process input files and save results
terminal-ai --ask "Summarize this content" --input document.txt --output summary.txt
terminal-ai --agent programmer --ask "Add comments to this code" --input script.py --output commented.py
```

#### Combined Usage
```bash
# Provider + Agent + File Processing
terminal-ai openai --agent reviewer --ask "Review this code" --input code.js --output review.txt
terminal-ai gemini --agent writer --ask "Rewrite this content" --input draft.txt --output final.txt
terminal-ai grok --agent debugger --ask "Debug this error" --input error.log --output solution.txt
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
- `terminal-ai --agent [agentid]` - Select specific agent
- `terminal-ai --ask [message]` - Send direct message
- `terminal-ai --input [file]` - Process input file
- `terminal-ai --output [file]` - Save response to file
- `terminal-ai --debug` - Enable debug mode

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

You can backup, restore, and share your Terminal AI configuration:

#### CLI Commands
```bash
# Export your current configuration
terminal-ai --export my-config.json

# Import a configuration file
terminal-ai --import my-config.json
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
- Model selections
- Default provider setting
- Version and timestamp information

```json
{
  "version": "1.0",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "config": {
    "defaultProvider": "openai",
    "apiKeys": { ... },
    "models": { ... },
    "firstRun": false
  }
}
```

### Use Cases
- **Backup**: Export before making changes
- **Migration**: Move settings between computers
- **Sharing**: Share configurations with team members
- **Testing**: Import test configurations

## Supported Providers

### ChatGPT (OpenAI)
- **Available Models**: gpt-3.5-turbo, gpt-3.5-turbo-16k, gpt-4, gpt-4-turbo, gpt-4o, gpt-4o-mini
- **Default Model**: gpt-3.5-turbo
- **API**: OpenAI API
- **Setup**: Requires OpenAI API key

### Gemini (Google)
- **Available Models**: gemini-1.5-flash, gemini-1.5-pro, gemini-1.0-pro, gemini-2.5-flash, gemini-2.5-pro
- **Default Model**: gemini-1.5-flash
- **API**: Google AI API
- **Setup**: Requires Google AI API key

### Grok AI (xAI)
- **Available Models**: grok-beta, grok-2, grok-2-vision
- **Default Model**: grok-beta
- **API**: xAI API
- **Setup**: Requires xAI API key

## Configuration

The application stores configuration in `config.json` in the project directory:

```json
{
  "defaultProvider": "openai",
  "apiKeys": {
    "openai": [
      {
        "name": "Work Key",
        "key": "sk-...",
        "isDefault": true
      },
      {
        "name": "Personal Key",
        "key": "sk-...",
        "isDefault": false
      }
    ],
    "gemini": [
      {
        "name": "Default",
        "key": "AIza...",
        "isDefault": true
      }
    ],
    "grok": [
      {
        "name": "Default",
        "key": "xai...",
        "isDefault": true
      }
    ]
  },
  "models": {
    "openai": "gpt-3.5-turbo",
    "gemini": "gemini-1.5-flash",
    "grok": "grok-3"
  },
  "firstRun": false
}
```

### Model Configuration

You can configure different models for each provider:

- **During Setup**: The setup wizard will ask you to select models for each provider
- **In Settings**: Use `/settings` command to change models anytime
- **Manual Edit**: Edit `config.json` directly to change models

### API Key Configuration

Each provider can have multiple named API keys:

- **Named Keys**: Give each key a descriptive name (e.g., "Work", "Personal", "Test")
- **Default Selection**: Choose which key to use by default for each provider
- **Easy Management**: Add, remove, and switch between keys through the settings menu
- **Secure Storage**: Keys are stored locally in the configuration file

### Default Settings

- **ChatGPT**: gpt-3.5-turbo, 1000 max tokens, 0.7 temperature
- **Gemini**: gemini-1.5-flash model (free tier)
- **Grok AI**: grok-beta model

You can modify these settings in `providers.js`.

## Project Structure

```
TerminalAI/
├── src/
│   ├── ui/              # User interface components
│   │   └── modern-ui-simple.js
│   ├── providers/       # AI provider implementations
│   │   └── providers.js
│   ├── config/          # Configuration management
│   │   └── config.js
│   └── setup/           # Setup and initialization logic
│       └── setup-dynamic.js
├── bin/                 # CLI executable
│   └── terminal-ai.js
├── index.js             # Main application entry point
├── package.json         # Project configuration
├── README.md           # Documentation
└── CHANGELOG.md        # Version history
```

## Dependencies

- `blessed`: Terminal UI library
- `blessed-contrib`: Additional UI components
- `openai`: OpenAI API client
- `@google/generative-ai`: Google AI API client
- `axios`: HTTP client for Grok AI API
- `dotenv`: Environment variable management
- `commander`: CLI argument parsing
- `inquirer`: Interactive command line interface
- `chalk`: Terminal styling
- `boxen`: Terminal boxes
- `gradient-string`: Gradient text effects
- `cli-table3`: Terminal tables

## Development

To run in development mode with auto-restart:

```bash
npm run dev
```

## Version History

- **1.5.0-alpha.1**: API key management with multiple named keys per provider
- **1.4.0**: Project restructuring and improved code organization
- **1.3.0-beta.1**: Model selection and settings menu
- **1.2.0**: Multi-provider support and modern UI
- **1.1.0**: Basic ChatGPT integration
- **1.0.0**: Initial project setup

## License

MIT 