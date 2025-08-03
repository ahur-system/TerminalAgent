# Terminal Agent

A powerful terminal application for chatting with multiple AI providers (ChatGPT, Gemini, and Grok) directly from your terminal.

**📖 Full Documentation: https://terminal-agent.khaleghi.info/**

## 🚀 Quick Start

### Installation

```bash
npm install -g terminal-agent
```

### Basic Usage

```bash
# Start chat with default provider
terminal-agent

# Use specific provider
terminal-agent openai
terminal-agent gemini
terminal-agent grok

# Send direct message
terminal-agent --ask "What is the capital of France?"
```

## 🎭 Agent System

Use specialized agents for different tasks:

```bash
# Code review
terminal-agent --agent reviewer --ask "Review this code"

# File analysis
terminal-agent --agent analyst --ask "Analyze this data" --input data.txt

# Content writing
terminal-agent --agent writer --ask "Write a blog post about AI"

# Debugging
terminal-agent --agent debugger --ask "Help me fix this error"
```

### Available Agents

- `programmer` - Code Assistant
- `reviewer` - Code Reviewer  
- `analyst` - Data Analyst
- `writer` - Writing Assistant
- `debugger` - Debugging Assistant
- `researcher` - Research Assistant
- `teacher` - Educational Assistant
- `SEO` - SEO Expert
- `creative` - Creative Assistant
- `architect` - System Architect

## 📁 File Processing

Process files with AI:

```bash
# Analyze a file
terminal-agent --agent analyst --ask "Summarize this content" --input document.txt

# Process and save output
terminal-agent --agent writer --ask "Rewrite this content" --input draft.txt --output final.txt

# Code review with file
terminal-agent openai --agent reviewer --ask "Review this code" --input script.py --output review.txt
```

## 🔧 Setup

First time setup:

```bash
terminal-agent --setup
```

## 🎯 Key Features

- **Multi-Provider Support**: ChatGPT, Gemini, Grok
- **Specialized Agents**: 10 different AI personalities
- **File Processing**: Input/output file support
- **Direct Commands**: Send messages without entering chat mode
- **Modern UI**: Beautiful terminal interface

## 🛠️ Development

```bash
# Clone and install
git clone https://github.com/ahur-system/TerminalAgent.git
cd TerminalAgent
npm install

# Run locally
node index.js
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Made with ❤️ by [Ali Khaleghi](https://github.com/ahur-system)** 