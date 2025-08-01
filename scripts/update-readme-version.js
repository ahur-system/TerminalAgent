#!/usr/bin/env node

/**
 * Script to update version in README.md
 * This script reads the current version from package.json and updates README.md
 */

const fs = require('fs');
const path = require('path');
const { getVersion } = require('../src/utils/version');

function updateReadmeVersion() {
  try {
    // Get current version
    const currentVersion = getVersion();
    
    // Read README.md
    const readmePath = path.join(__dirname, '..', 'README.md');
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Update the version line
    const versionRegex = /> \*\*Current Version\*\*: \d+\.\d+\.\d+/;
    const newVersionLine = `> **Current Version**: ${currentVersion}`;
    
    if (versionRegex.test(readmeContent)) {
      readmeContent = readmeContent.replace(versionRegex, newVersionLine);
      
      // Write back to README.md
      fs.writeFileSync(readmePath, readmeContent, 'utf8');
      
      console.log(`✅ Updated README.md version to ${currentVersion}`);
    } else {
      console.log('⚠️  Could not find version line in README.md');
      console.log('Expected format: > **Current Version**: X.X.X');
    }
  } catch (error) {
    console.error('❌ Error updating README.md version:', error.message);
    process.exit(1);
  }
}

// Run the update if this script is executed directly
if (require.main === module) {
  updateReadmeVersion();
}

module.exports = { updateReadmeVersion }; 