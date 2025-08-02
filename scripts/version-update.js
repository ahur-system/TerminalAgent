#!/usr/bin/env node

/**
 * Comprehensive version update script for TerminalAI
 * This script updates all version references and documentation
 */

const fs = require('fs');
const path = require('path');
const { updateReadmeVersion } = require('./update-readme-version.js');

function updateVersion(newVersion) {
  if (!newVersion) {
    console.error('❌ Please provide a version number');
    console.log('Usage: node scripts/version-update.js <new-version>');
    console.log('Example: node scripts/version-update.js 1.12.0');
    process.exit(1);
  }

  console.log(`🔄 Updating version to ${newVersion}...`);

  try {
    // 1. Update package.json
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`✅ Updated package.json to version ${newVersion}`);

    // 2. Update README.md
    updateReadmeVersion();
    console.log(`✅ Updated README.md to version ${newVersion}`);

    // 3. Update CHANGELOG.md with new version entry
    const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
    let changelogContent = fs.readFileSync(changelogPath, 'utf8');
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const newVersionEntry = `## [${newVersion}] - ${today}

### Added
- [DESCRIBE NEW FEATURES HERE]

### Changed
- [DESCRIBE CHANGES HERE]

### Fixed
- [DESCRIBE BUG FIXES HERE]

### Removed
- [DESCRIBE REMOVED FEATURES HERE]

`;

    // Insert new version entry at the top (after the first line)
    const lines = changelogContent.split('\n');
    lines.splice(1, 0, newVersionEntry);
    changelogContent = lines.join('\n');
    
    fs.writeFileSync(changelogPath, changelogContent);
    console.log(`✅ Added new version entry to CHANGELOG.md`);

    console.log(`\n🎉 Version update completed successfully!`);
    console.log(`📝 Next steps:`);
    console.log(`   1. Review the changes`);
    console.log(`   2. Commit your changes: git add . && git commit -m "Bump version to ${newVersion}"`);
    console.log(`   3. Create a git tag: git tag -a v${newVersion} -m "Release v${newVersion}"`);
    console.log(`   4. Push changes: git push origin main --tags`);
    console.log(`   5. Create a GitHub release for v${newVersion}`);

  } catch (error) {
    console.error('❌ Error updating version:', error.message);
    process.exit(1);
  }
}

// Run the update if this script is executed directly
if (require.main === module) {
  const newVersion = process.argv[2];
  updateVersion(newVersion);
}

module.exports = { updateVersion }; 