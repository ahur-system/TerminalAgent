# TerminalAI Advanced Usage Examples

This file demonstrates the advanced usage patterns for TerminalAI, including agent selection and file processing capabilities.

## 🎭 **Agent Selection Examples**

### **1. Basic Agent Usage**
```bash
# Use a specific agent for the conversation
node index.js --agent reviewer --ask "What is your role?"

# Using CLI
terminal-agent --agent writer --ask "Help me write a blog post"
```

### **2. Available Agents**
Based on the current configuration, these agents are available:

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

### **3. Agent-Specific Tasks**
```bash
# Code review with reviewer agent
node index.js --agent reviewer --ask "Review this code for best practices" --input code.js --output review.txt

# Writing help with writer agent
terminal-agent --agent writer --ask "Improve this text" --input draft.txt --output improved.txt

# SEO analysis with SEO agent
node index.js --agent SEO --ask "Analyze this content for SEO" --input content.txt --output seo-analysis.txt

# Debugging with debugger agent
terminal-agent --agent debugger --ask "Help me fix this error" --input error.log --output solution.txt
```

## 📁 **File Processing Examples**

### **4. Input File Processing**
```bash
# Process a text file
node index.js --ask "Summarize this content" --input document.txt --output summary.txt

# Process code file
terminal-agent --agent programmer --ask "Add comments to this code" --input script.py --output commented.py

# Process multiple files (combine content)
node index.js --ask "Compare these two files" --input file1.txt file2.txt --output comparison.txt
```

### **5. Different File Types**
```bash
# Process Python code
node index.js --agent reviewer --ask "Review this Python code" --input main.py --output review.txt

# Process JavaScript code
terminal-agent --agent debugger --ask "Find bugs in this code" --input app.js --output bugs.txt

# Process Markdown content
node index.js --agent writer --ask "Improve this documentation" --input README.md --output improved-README.md

# Process JSON data
terminal-agent --agent analyst --ask "Analyze this JSON data" --input data.json --output analysis.txt
```

## 🔄 **Combined Usage Examples**

### **6. Provider + Agent + File Processing**
```bash
# Use ChatGPT with Code Reviewer agent
node index.js openai --agent reviewer --ask "Review this code" --input code.js --output review.txt

# Use Gemini with Writer agent
terminal-agent gemini --agent writer --ask "Rewrite this content" --input draft.txt --output final.txt

# Use Grok with Debugger agent
node index.js grok --agent debugger --ask "Debug this error" --input error.log --output solution.txt
```

### **7. Complex Workflows**
```bash
# Code review workflow
node index.js --agent reviewer --ask "Review this code for: 1) Security issues 2) Performance problems 3) Best practices" --input app.js --output code-review.txt

# Content creation workflow
terminal-agent --agent writer --ask "Create a blog post about this topic" --input topic.txt --output blog-post.md

# Data analysis workflow
node index.js --agent analyst --ask "Analyze this data and provide insights" --input data.csv --output analysis-report.txt
```

## 🎯 **Real-World Use Cases**

### **8. Code Review Pipeline**
```bash
# Review new code
node index.js --agent reviewer --ask "Perform a comprehensive code review" --input new-feature.js --output review-feedback.txt

# Fix issues found in review
terminal-agent --agent debugger --ask "Fix the issues mentioned in the review" --input review-feedback.txt --output fixed-code.js
```

### **9. Content Creation Pipeline**
```bash
# Research topic
node index.js --agent researcher --ask "Research this topic thoroughly" --input topic.txt --output research.txt

# Write content based on research
terminal-agent --agent writer --ask "Write an article based on this research" --input research.txt --output article.md

# Optimize for SEO
node index.js --agent SEO --ask "Optimize this content for SEO" --input article.md --output seo-optimized.md
```

### **10. Learning and Education**
```bash
# Create study materials
node index.js --agent teacher --ask "Create study materials for this topic" --input topic.txt --output study-guide.md

# Practice problems
terminal-agent --agent programmer --ask "Create coding exercises for this concept" --input concept.txt --output exercises.txt
```

## 📊 **Output Examples**

### **11. Different Output Formats**
```bash
# Save as text file
node index.js --agent writer --ask "Rewrite this content" --input draft.txt --output final.txt

# Save as Markdown
terminal-agent --agent teacher --ask "Create documentation" --input notes.txt --output docs.md

# Save as JSON
node index.js --agent analyst --ask "Analyze and format as JSON" --input data.txt --output analysis.json

# Save as HTML
terminal-agent --agent creative --ask "Create HTML version" --input content.txt --output webpage.html
```

### **12. Multiple Outputs**
```bash
# Generate multiple files from one input
node index.js --agent writer --ask "Create: 1) Summary 2) Detailed analysis 3) Recommendations" --input report.txt --output summary.txt analysis.txt recommendations.txt
```

## 🔧 **Configuration Examples**

### **13. Agent Configuration**
```bash
# Check available agents
node index.js --config

# List agents in configuration
cat config.json | grep -A 20 '"agents"'
```

### **14. Provider + Agent Combinations**
```bash
# ChatGPT with different agents
node index.js openai --agent reviewer --ask "Code review"
node index.js openai --agent writer --ask "Content writing"
node index.js openai --agent debugger --ask "Debugging help"

# Gemini with different agents
terminal-agent gemini --agent analyst --ask "Data analysis"
terminal-agent gemini --agent teacher --ask "Educational content"
terminal-agent gemini --agent creative --ask "Creative ideas"

# Grok with different agents
node index.js grok --agent architect --ask "System design"
node index.js grok --agent programmer --ask "Code generation"
node index.js grok --agent researcher --ask "Research assistance"
```

## 🚀 **Quick Reference**

### **Basic Syntax:**
```bash
node index.js [provider] --agent [agentid] --ask [query] --input [input-file] --output [output-file]
```

### **Common Patterns:**
```bash
# Simple agent usage
node index.js --agent reviewer --ask "Your question"

# File processing
node index.js --ask "Process this" --input file.txt --output result.txt

# Provider + Agent + File
node index.js openai --agent writer --ask "Rewrite this" --input draft.txt --output final.txt

# Complex workflow
terminal-agent gemini --agent analyst --ask "Analyze and summarize" --input data.txt --output report.txt
```

### **Available Agents:**
- `programmer` - Code Assistant
- `SEO` - SEO Expert
- `writer` - Writing Assistant
- `researcher` - Research Assistant
- `teacher` - Educational Assistant
- `analyst` - Data Analyst
- `creative` - Creative Assistant
- `debugger` - Debugging Assistant
- `reviewer` - Code Reviewer
- `architect` - System Architect

### **File Processing:**
- `--input` - Specify input file to process
- `--output` - Specify output file for results
- Supports any text-based file format
- Can combine input file with ask message

---

## 📝 **Notes**

- Agents provide specialized instructions for different tasks
- Input files are read and combined with the ask message
- Output files are created in the current directory
- Provider selection works with all agents
- Debug mode (`--debug`) works with all combinations
- Configuration is automatically saved and persists 