# Changelog

All notable changes to this project will be documented in this file.

## [1.7.0] - 2024-12-19

### Fixed
- **Gemini Model Support**: Added `gemini-2.0-flash` and `gemini-2.0-pro` to available models list
- **API Compatibility**: Fixed 403 Forbidden errors when using newer Gemini models
- **Model Selection**: Ensured configured models are properly recognized by Google AI SDK

### Changed
- Updated default Gemini model support to include latest Gemini 2.0 series
- Enhanced model availability for better API compatibility

## [1.6.6] - 2024-12-19

### Fixed
- **Provider Selection**: Fixed broken provider selection in settings (now shows all providers)
- **Default Provider**: Changed default provider from openai to gemini
- **Provider Switching**: Fixed provider switching logic to use correct provider keys
- **Status Indicators**: Added status indicators for providers (✅ Ready / ⚠️ Needs API key)
- **Fallback Logic**: Fixed fallback logic when default provider isn't available
- **Error Resolution**: Resolved 'Provider openai is not initialized' errors

## [1.6.5] - 2024-12-19

### Fixed
- **Setup Flow UX**: Fixed major UX issue where app would exit if no API keys were configured
- **Chat Access**: Users can now enter chat page and access /settings even without API keys
- **Error Prevention**: App prevents chatting with AI when no keys are available but allows navigation
- **Status Bar**: Shows "No API Keys" status when no keys are configured
- **User Guidance**: Provides clear instructions to add keys via /settings

## [1.6.4] - 2024-12-19

### Fixed
- **Windows Compatibility**: Fixed `ERR_REQUIRE_ESM` error on Windows systems
- **Dependency Issue**: Downgraded `boxen` from v7.x to v6.1.1 for CommonJS compatibility
- **Package Dependencies**: Removed self-reference `terminal-agent` from dependencies
- **Cross-Platform**: Ensured proper functionality across Windows, macOS, and Linux

## [1.6.3] - 2024-12-19

### Added
- **Configuration Import/Export**: Added ability to import and export configurations
- **CLI Commands**: Added `--export [file]` and `--import [file]` options
- **Settings Menu**: Added "Import/Export configuration" option in settings
- **Version Tracking**: Export includes version and timestamp information
- **Validation**: Basic validation of imported configuration data
- **File Management**: Support for both CLI and UI-based configuration management

## [1.6.2] - 2024-12-19

### Added
- **IP and Location Detection**: Added automatic detection of user's public IP and location
- **Geolocation**: Shows city, region, country, and ISP information
- **Welcome Message**: Enhanced welcome message with location details
- **Loading Indicator**: Shows loading state while detecting location
- **Fallback Support**: Uses multiple IP detection services for reliability

## [1.6.1] - 2024-12-19

### Added
- **Grok AI Model Updates**: Added support for latest Grok models
- **Vision Models**: Added Grok-4V and Grok-4V-mini for image processing
- **Model Selection**: Updated default model to Grok-4 for better performance
- **Enhanced Models**: Added Grok-3 series and Grok-4 series models
- **Model Compatibility**: Improved model selection across all providers

## [1.4.0] - 2024-12-19

### Added
- **Multi-Provider Support**: Added support for ChatGPT, Gemini, and Grok AI
- **Dynamic Setup**: Interactive setup wizard for API key configuration
- **Provider Switching**: Ability to switch between AI providers during chat
- **Model Selection**: Choose different models for each provider
- **Settings Management**: Comprehensive settings menu for configuration
- **API Key Management**: Add, remove, and manage API keys for all providers 