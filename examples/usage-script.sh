#!/bin/bash

# TerminalAI Usage Script Examples
# This script demonstrates various ways to use TerminalAI with inline arguments

echo "🚀 TerminalAI Usage Examples"
echo "============================"
echo ""

# Check if TerminalAI is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Function to run example with description
run_example() {
    local description="$1"
    local command="$2"
    
    echo "📝 $description"
    echo "Command: $command"
    echo "---"
    eval "$command"
    echo ""
    echo "============================"
    echo ""
}

# Example 1: Check version
run_example "Check TerminalAI version" "node index.js --version"

# Example 2: Simple question
run_example "Ask a simple question" "node index.js --ask 'What is 2+2?'"

# Example 3: Code generation
run_example "Generate a Python function" "node index.js --ask 'Write a Python function to calculate factorial' --output factorial.py"

# Example 4: Debug mode
run_example "Debug mode with simple test" "node index.js --debug --ask 'Hello, this is a test message'"

# Example 5: Provider-specific
run_example "Ask ChatGPT specifically" "node index.js openai --ask 'What are the benefits of using TypeScript?'"

# Example 6: Configuration check
run_example "Check current configuration" "node index.js --config"

# Example 7: Complex query
run_example "Complex coding question" "node index.js --ask 'Create a JavaScript function that: 1) Takes an array of objects 2) Groups them by a specific property 3) Returns the grouped result' --output grouping_function.js"

# Example 8: Documentation generation
run_example "Generate API documentation" "node index.js --ask 'Create OpenAPI specification for a user management API with endpoints for: GET /users, POST /users, PUT /users/{id}, DELETE /users/{id}' --output api_spec.yaml"

# Example 9: Learning example
run_example "Learning Docker" "node index.js --ask 'Explain Docker containers, images, and volumes like I am a complete beginner' --output docker_tutorial.md"

# Example 10: Problem solving
run_example "Algorithm help" "node index.js --ask 'What is the most efficient algorithm to find the longest common subsequence between two strings?' --output lcs_algorithm.txt"

echo "✅ All examples completed!"
echo ""
echo "📁 Generated files:"
ls -la *.py *.js *.md *.txt *.yaml 2>/dev/null || echo "No files generated in this directory"
echo ""
echo "🎯 Tips:"
echo "- Use --debug flag for troubleshooting"
echo "- Use --output flag to save responses to files"
echo "- Use --ask flag for quick questions"
echo "- Use --config to check your setup"
echo "- Use --setup to configure API keys" 