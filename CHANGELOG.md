# Changelog

All notable changes to this project will be documented in this file.

## [1.8.1] - 2024-12-19

### Fixed
- **CLI Execution**: Fixed incomplete CLI code that was missing argument parsing
- **Global Installation**: Restored proper CLI functionality for global npm installations
- **Command Line Interface**: Added missing `.parse()` and main function call

## [1.8.0] - 2024-12-19

### Added
- **Professional Debugger System**: Added comprehensive debugging framework (`src/debugger.js`)
- **Debug CLI Option**: Added `--debug` flag for troubleshooting
- **Smart Error Reporting**: Enhanced error extraction and sanitization
- **HTTP Request/Response Logging**: Detailed API call monitoring
- **Sensitive Data Protection**: Automatic API key and token masking

### Fixed
- **Gemini Chat History**: Fixed 400 errors in multi-message conversations
- **Role Field Support**: Added required `role: 'user'` fields for chat API
- **Request Format**: Corrected Gemini API request structure for conversations
- **Debug Output**: Replaced verbose `[Object]` with useful, sanitized information

### Changed
- **Debug Output**: Clean, focused debugging with timestamps and structured data
- **Error Handling**: Improved error messages with relevant context
- **API Compatibility**: Enhanced Gemini provider for proper chat conversations
- **CLI Interface**: Added debug mode for development and troubleshooting

## [1.7.1] - 2024-12-19

### Fixed
- **Critical Gemini API Fix**: Replaced Google AI SDK with direct axios implementation
- **403 Forbidden Resolution**: Fixed API compatibility issues with Gemini 2.0 models
- **Request Format**: Eliminated problematic SDK headers and fields
- **Direct API Calls**: Now uses exact same request format as working curl examples
- **API Compatibility**: Resolved conflicts between SDK and API key permissions

### Changed
- **Gemini Provider**: Completely rewritten to use direct HTTP requests
- **Request Headers**: Removed `x-goog-api-client` header that caused 403 errors
- **Request Body**: Removed `role` field that was incompatible with API
- **Error Handling**: Enhanced debugging and error reporting for API issues

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