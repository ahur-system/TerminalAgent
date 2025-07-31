# Changelog

All notable changes to this project will be documented in this file.

## [1.6.4] - 2024-12-19

### Fixed
- **Windows Compatibility**: Fixed ES module compatibility issues
  - Updated boxen dependency to version 6.1.1 for CommonJS compatibility
  - Removed self-reference in package.json dependencies
  - Fixed ERR_REQUIRE_ESM error on Windows systems
  - Ensured compatibility with Node.js v20.12.0 and PowerShell

## [1.6.3] - 2024-12-19

### Added
- **Configuration Import/Export**: Added ability to import and export configurations
  - Export configuration to JSON file with version and timestamp
  - Import configuration from JSON file with validation
  - CLI commands: `--export [file]` and `--import [file]`
  - UI-based import/export through settings menu
  - Configuration validation and error handling
  - Backup and restore functionality for settings
  - Support for sharing configurations between installations

### Changed
- **Settings Menu**: Added "Import/Export configuration" option
  - Export configuration to file with custom path
  - Import configuration from file with confirmation
  - Show current configuration in JSON format
  - Recursive menu for configuration management

## [1.6.2] - 2024-12-19

### Added
- **IP and Location Detection**: Added IP address and location information to welcome message
  - Shows user's public IP address
  - Displays city, region, and country information
  - Shows ISP (Internet Service Provider) information
  - Includes loading indicator while detecting location
  - Fallback mechanism if primary IP service is unavailable
  - Graceful error handling for network issues

## [1.6.1] - 2024-12-19

### Changed
- **Grok AI Models**: Updated Grok AI model list to include latest models
  - Added Grok 4 series: grok-4-0709, grok-4, grok-4-latest, grok-4-heavy
  - Added Grok 3 series: grok-3, grok-3-mini, grok-3-fast, grok-3-mini-fast
  - Added Grok 2 vision models: grok-2-vision-1212, grok-2-image-1212
  - Updated default Grok model from grok-beta to grok-3
  - Removed deprecated grok-beta and grok-2 models

## [1.6.0] - 2024-12-19

### Added
- **Grok AI Support**: Added support for Grok AI (xAI) as a new provider
  - New Grok AI provider with support for grok-beta, grok-2, and grok-2-vision models
  - Auto-import system for all providers (ChatGPT, Gemini, Grok AI)
  - Modular provider architecture with individual provider files
  - Updated configuration system to support Grok AI API keys
  - Enhanced provider management with unified interface
- **Provider Reorganization**: Restructured provider system for better maintainability
  - Moved providers to individual files: `chatgpt.js`, `gemini.js`, `grok.js`
  - Auto-import system in `providers.js` that automatically loads all provider modules
  - Unified provider interface with consistent methods across all providers
  - Enhanced error handling and provider initialization

### Changed
- **Architecture**: Reorganized provider structure for better modularity
  - Each provider now has its own dedicated file with consistent interface
  - Auto-import system eliminates manual provider registration
  - Improved error handling and provider state management
  - Enhanced configuration management for multiple providers
- **CLI**: Updated command-line interface to support Grok AI provider
  - Added grok as a valid provider option in CLI arguments
  - Updated version to 1.6.0 across package.json and CLI

### Fixed
- No fixes yet

## [1.5.0-alpha.1] - 2024-12-19

### Added
- **API Key Management**: Added support for multiple named API keys per provider
  - Users can now add, remove, and manage multiple API keys for each provider
  - Each key can have a custom name (e.g., "Work Key", "Personal Key")
  - Users can set a default key for each provider
  - Keys are securely stored in the configuration file
  - Migration support for existing single-key configurations
- **Enhanced Settings Menu**: Added "Manage API keys" option to settings
  - Interactive menu for adding new API keys with validation
  - Ability to remove existing keys with confirmation
  - Option to set default key for each provider
  - Display of key count in provider status
- **Improved Configuration**: Updated config structure to support multiple keys
  - Backward compatibility with existing configurations
  - Automatic migration from old single-key format
  - Enhanced configuration summary with key counts

### Changed
- Updated configuration format to support multiple named API keys
- Enhanced settings menu with new API key management options
- Improved README documentation for API key management features

### Alpha Release Notes
- ⚠️ **This is an alpha release** - The API key management feature is implemented and tested
- **Testing Status**: All core functionality has been tested and verified
- **Migration**: Existing configurations will be automatically migrated to the new format
- **Backward Compatibility**: Fully compatible with existing single-key configurations

## [1.5.0] - 2024-12-19

### Added
- **API Key Management**: Added support for multiple named API keys per provider
  - Users can now add, remove, and manage multiple API keys for each provider
  - Each key can have a custom name (e.g., "Work Key", "Personal Key")
  - Users can set a default key for each provider
  - Keys are securely stored in the configuration file
  - Migration support for existing single-key configurations
- **Enhanced Settings Menu**: Added "Manage API keys" option to settings
  - Interactive menu for adding new API keys with validation
  - Ability to remove existing keys with confirmation
  - Option to set default key for each provider
  - Display of key count in provider status
- **Improved Configuration**: Updated config structure to support multiple keys
  - Backward compatibility with existing configurations
  - Automatic migration from old single-key format
  - Enhanced configuration summary with key counts

### Changed
- Updated configuration format to support multiple named API keys
- Enhanced settings menu with new API key management options
- Improved README documentation for API key management features

## [1.4.0] - 2024-12-19

### Added
- Initial release of Terminal AI
- Full-screen terminal interface
- Multi-provider support (ChatGPT, Gemini, and Grok)
- Real-time chat with AI assistants
- Provider switching with keyboard shortcuts
- Model selection for each provider
- Configuration management with first-time setup
- Command-line provider selection
- Settings menu for configuration management
- Secure API key management
- Scrollable chat history
- Status bar showing current provider and model
- Modular architecture with organized codebase 