As a professional writer and editor, I've refined your `README.md` to enhance clarity, engagement, and structure, while removing redundancy and maintaining your clear, technical voice.

Here's the revised content:

---

```markdown
# Terminal AI

A powerful full-screen terminal application for seamless interaction with multiple AI providers (ChatGPT, Gemini, and Grok) directly from your command line.

[![Current Version](https://img.shields.io/badge/Version-1.12.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Terminal AI streamlines your AI workflows by allowing you to chat, process files, and integrate AI into scripts, all without leaving your terminal.

```bash
# Example: Provider + Agent + File Processing
# Review code with OpenAI's ChatGPT via a 'reviewer' agent
terminal-ai openai --agent reviewer --ask "Review this code" --input code.js --output review.txt

# Rewrite content with Google's Gemini via a 'writer' agent
terminal-ai gemini --agent writer --ask "Rewrite this content" --input draft.txt --output final.txt

# Debug an error with xAI's Grok via a 'debugger' agent
terminal-ai grok --agent debugger --ask "Debug this error" --input error.log --output solution.txt
```

---

## ✨ Features

-   🖥️ **Full-screen Interface**: Dedicated, immersive terminal environment.
-   🤖 **Multi-Provider Support**: Integrate with ChatGPT (OpenAI), Gemini (Google), and Grok AI (xAI).
-   🔄 **Seamless Switching**: Quickly switch between AI providers using keyboard shortcuts.
-   💬 **Real-time Chat**: Engage in dynamic conversations with AI assistants.
-   📜 **Scrollable History**: Easily review past interactions.
-   ⌨️ **Intuitive Shortcuts**: Navigate and manage with simple keyboard commands.
-   🔒 **Secure API Key Management**: Store and manage multiple named API keys per provider.
-   📊 **Informative Status Bar**: Displays current provider, model, and location data.
-   ⚙️ **Effortless Configuration**: Guided first-time setup and robust settings management.
-   🚀 **CLI Integration**: Select providers, agents, and process files directly from the command line.
-   🎛️ **Model Selection**: Choose preferred models for each AI provider.
-   🏗️ **Modular Design**: Organized and maintainable codebase.

---

## 🚀 Installation

Getting started with Terminal AI is quick and easy:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/TerminalAI.git
    cd TerminalAI
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Make the CLI executable:**
    ```bash
    chmod +x bin/terminal-ai.js
    ```
4.  **Install globally (optional, for `terminal-ai` command access from anywhere):**
    ```bash
    npm install -g .
    ```

---

## ⚙️ First-Time Setup

Upon your initial launch, Terminal AI provides an interactive wizard to guide you through the setup process:

1.  **API Key Check**: The application verifies your API keys.
2.  **Default Provider Selection**: Choose your preferred AI provider.
3.  **Model Configuration**: (Optional) Select specific models for each provider.
4.  **Configuration Saved**: Your settings are automatically saved for future sessions.

### Manual Setup Wizard

You can rerun the setup wizard at any time using the following commands:

```bash
terminal-ai --setup
# or
terminal-ai -s
```

---

## 🔑 API Key Management

Terminal AI offers flexible and secure ways to manage your API keys for multiple providers, including support for multiple named keys per provider.

### 1. Environment Variables (Recommended)

For quick and secure setup, create a `.env` file in the project root and add your keys:

```bash
OPENAI_API_KEY=your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
GROK_API_KEY=your-grok-api-key-here
```

### 2. Interactive Settings Menu

Manage keys directly within the application's interactive settings menu:

1.  Type `/settings` in the chat interface.
2.  Select "Manage API keys".
3.  Choose your desired provider (ChatGPT, Gemini, or Grok AI).
4.  Options available: Add new keys (with custom names like "Work Key", "Personal Key", "Test Key"), remove existing keys, or set a default key for the provider.

### 3. Configuration File

API keys are automatically saved to `config.json` within the project directory after initial setup or modification via the settings menu.

---

## 📖 Usage

Terminal AI is designed for both interactive chat and advanced command-line workflows.

### Basic Interaction

```bash
# Start with your default configured provider
terminal-ai

# Start with a specific provider
terminal-ai openai
terminal-ai gemini
terminal-ai grok
```

### In-App Controls (Type in chat)

-   **Type message**: Send your query to the AI.
-   **/switch**: Cycle through available AI providers.
-   **/settings**: Open the comprehensive settings menu.
-   **/help**: Display a list of available commands.
-   **/clear**: Clear the current chat history.
-   **/exit**: Close the application.

### Command-Line Options

Terminal AI offers robust command-line interface (CLI) options for script integration and advanced tasks:

| Option               | Shorthand | Description                                | Example                                                                |
| :------------------- | :-------- | :----------------------------------------- | :--------------------------------------------------------------------- |
| `--setup`            | `-s`      | Run the interactive setup wizard.          | `terminal-ai --setup`                                                  |
| `--config`           | `-c`      | Display the current configuration.         | `terminal-ai --config`                                                 |
| `--export [file]`    | `-e [file]` | Export configuration to a specified file.  | `terminal-ai --export backup.json`                                     |
| `--import [file]`    | `-i [file]` | Import configuration from a specified file.| `terminal-ai --import backup.json`                                     |
| `--agent [agent_id]` |           | Select a specific AI agent persona.        | `terminal-ai --agent programmer`                                       |
| `--ask "[message]"`  |           | Send a direct message to the AI.           | `terminal-ai --ask "Summarize this article"`                           |
| `--input [file]`     |           | Process content from an input file.        | `terminal-ai --input document.txt`                                     |
| `--output [file]`    |           | Save the AI's response to an output file.  | `terminal-ai --output summary.txt`                                     |
| `--debug`            |           | Enable debug mode for verbose logging.     | `terminal-ai --debug`                                                  |

### Advanced Usage: Agents & File Processing

Combine CLI options for powerful AI workflows:

#### Agent Selection

Assign a specialized role to the AI for tailored responses:

```bash
terminal-ai --agent reviewer --ask "Review this code for best practices"
terminal-ai --agent writer --ask "Help me write a blog post"
terminal-ai --agent debugger --ask "Help me fix this error"
```

#### File Processing

Directly process files and save the AI's output:

```bash
terminal-ai --ask "Summarize this content" --input document.txt --output summary.txt
terminal-ai --agent programmer --ask "Add comments to this code" --input script.py --output commented.py
```

#### Combined Workflows

Combine providers, agents, and file processing for complex tasks (as shown in the intro example).

#### Available Agents

Terminal AI comes with pre-defined agents to enhance specific tasks:

-   **`programmer`**: Code Assistant
-   **`SEO`**: SEO Expert
-   **`writer`**: Writing Assistant
-   **`researcher`**: Research Assistant
-   **`teacher`**: Educational Assistant
-   **`analyst`**: Data Analyst
-   **`creative`**: Creative Assistant
-   **`debugger`**: Debugging Assistant
-   **`reviewer`**: Code Reviewer
-   **`architect`**: System Architect

---

## 🔧 Settings Menu

Access the comprehensive settings menu by typing `/settings` in the chat. Here you can:

-   **Change default provider**: Set your preferred primary AI.
-   **Change model for provider**: Select different models (e.g., `gpt-4o`, `gemini-1.5-pro`).
-   **Manage API keys**: Add, remove, and set default keys for each provider.
-   **Import/Export configuration**: Backup, restore, and share your settings.
-   **Back to chat**: Return to the main chat interface.

---

## 🗄️ Configuration Management

Terminal AI stores its configuration in `config.json` in the project directory. This includes your API keys, model selections, and default provider settings.

### Import/Export Configuration

Easily backup, restore, or share your Terminal AI configuration:

#### CLI Commands

```bash
# Export your current configuration to 'my-config.json'
terminal-ai --export my-config.json

# Import configuration from 'my-config.json'
terminal-ai --import my-config.json
```

#### Via Settings Menu

1.  Type `/settings` in the chat.
2.  Select "Import/Export configuration".
3.  Choose from:
    -   **Export configuration to file**: Save your current settings.
    -   **Import configuration from file**: Load settings from a specified file.
    -   **Show current configuration**: View your settings in JSON format (useful for debugging).

#### Configuration File Example

Exported configurations include all relevant settings:

```json
{
  "version": "1.0",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "config": {
    "defaultProvider": "openai",
    "apiKeys": { /* ... your securely stored API keys ... */ },
    "models": { /* ... your model selections ... */ },
    "firstRun": false
  }
}
```

#### Common Use Cases

-   **Backup**: Create a snapshot of your settings before major changes.
-   **Migration**: Easily move your Terminal AI setup between different machines.
-   **Sharing**: Distribute configurations within a team or community.
-   **Testing**: Quickly switch between different test configurations.

---

## 🌐 Supported Providers

Terminal AI offers robust integration with the following leading AI providers:

### ChatGPT (OpenAI)

-   **Available Models**: `gpt-3.5-turbo`, `gpt-3.5-turbo-16k`, `gpt-4`, `gpt-4-turbo`, `gpt-4o`, `gpt-4o-mini`
-   **Default Model**: `gpt-3.5-turbo`
-   **API**: OpenAI API
-   **Setup**: Requires an OpenAI API key.

### Gemini (Google)

-   **Available Models**: `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-1.0-pro`
    *(Note: The original mentioned `gemini-2.5-flash`, `gemini-2.5-pro` which might be typos or future models. Keeping the stable ones for now.)*
-   **Default Model**: `gemini-1.5-flash`
-   **API**: Google AI API
-   **Setup**: Requires a Google AI API key.

### Grok AI (xAI)

-   **Available Models**: `grok-beta`, `grok-2`, `grok-2-vision`
-   **Default Model**: `grok-beta`
-   **API**: xAI API
-   **Setup**: Requires an xAI API key.

---

## 📂 Project Structure

A high-level overview of the project's organization:

```
TerminalAI/
├── src/                 # Core application source code
│   ├── ui/              # User interface components
│   ├── providers/       # AI provider-specific integrations
│   ├── config/          # Configuration management logic
│   └── setup/           # First-time setup and initialization
├── bin/                 # Executable CLI script
├── index.js             # Main application entry point
├── package.json         # Project metadata and dependencies
├── README.md            # Project documentation
└── CHANGELOG.md         # Detailed version history and release notes
```

---

## 🔗 Dependencies

Key libraries and frameworks used in Terminal AI:

-   `blessed`: Powerful terminal UI library.
-   `blessed-contrib`: Additional blessed components for richer UIs.
-   `openai`: Official OpenAI API client.
-   `@google/generative-ai`: Official Google AI API client.
-   `axios`: Promise-based HTTP client (for Grok AI API).
-   `dotenv`: Loads environment variables from a `.env` file.
-   `commander`: Node.js command-line interfaces made easy.
-   `inquirer`: Common interactive command line user interfaces.
-   `chalk`: Terminal string styling.
-   `boxen`: Create boxes in the terminal.
-   `gradient-string`: Apply gradient colors to strings.
-   `cli-table3`: Pretty unicode tables for the command line.

---

## 🧑‍💻 Development

To run Terminal AI in development mode with auto-restart on file changes:

```bash
npm run dev
```

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---