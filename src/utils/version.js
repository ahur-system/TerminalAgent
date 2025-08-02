/**
 * Version utility for Terminal Agent
 * Centralizes version retrieval from package.json
 */

const fs = require('fs');
const path = require('path');

/**
 * Get the current version from package.json
 * @param {string} relativePath - Relative path to package.json (default: '../../package.json')
 * @returns {string} The version string
 */
function getVersion(relativePath = '../../package.json') {
  let version = '1.11.0'; // fallback version
  
  try {
    // Try to read package.json from the specified path
    const packageJsonPath = path.resolve(__dirname, relativePath);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    version = packageJson.version;
  } catch (error) {
    // If the first path fails, try alternative paths
    const alternativePaths = [
      '../package.json',
      '../../package.json',
      '../../../package.json',
      './package.json'
    ];
    
    for (const altPath of alternativePaths) {
      try {
        const packageJsonPath = path.resolve(__dirname, altPath);
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        version = packageJson.version;
        break; // Found it, exit the loop
      } catch (altError) {
        // Continue to next alternative path
        continue;
      }
    }
    
    // If all paths fail, log a warning but keep the fallback version
    console.warn('Warning: Could not read package.json for version, using fallback version:', version);
  }
  
  return version;
}

/**
 * Get the version with 'v' prefix for display
 * @param {string} relativePath - Relative path to package.json
 * @returns {string} The version string with 'v' prefix
 */
function getVersionWithPrefix(relativePath = '../../package.json') {
  return `v${getVersion(relativePath)}`;
}

/**
 * Get the full application name with version
 * @param {string} relativePath - Relative path to package.json
 * @returns {string} The full application name with version
 */
function getFullAppName(relativePath = '../../package.json') {
  return `Terminal Agent v${getVersion(relativePath)}`;
}

module.exports = {
  getVersion,
  getVersionWithPrefix,
  getFullAppName
}; 