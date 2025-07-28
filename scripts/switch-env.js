#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '..', '.env.local');
const exampleFile = path.join(__dirname, '..', 'env.example');

function switchEnvironment(env) {
  if (!['development', 'production'].includes(env)) {
    console.error('❌ Invalid environment. Use "development" or "production"');
    process.exit(1);
  }

  const envContent = `# Environment Configuration
# Set to 'development' for localhost:3000 or 'production' for 13.201.19.41:3003
NEXT_PUBLIC_ENV=${env}

# Development Environment (localhost:3000)
# NEXT_PUBLIC_ENV=development

# Production Environment (13.201.19.41:3003)
# NEXT_PUBLIC_ENV=production
`;

  try {
    fs.writeFileSync(envFile, envContent);
    console.log(`✅ Environment switched to: ${env}`);
    
    const urls = {
      development: 'http://localhost:3000/api',
      production: 'http://13.201.19.41:3003/api'
    };
    
    console.log(`🌐 API URL: ${urls[env]}`);
    console.log('🔄 Restart your development server for changes to take effect');
  } catch (error) {
    console.error('❌ Error writing environment file:', error.message);
    process.exit(1);
  }
}

// Get environment from command line argument
const env = process.argv[2];

if (!env) {
  console.log('Usage: node scripts/switch-env.js <environment>');
  console.log('Environments: development, production');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/switch-env.js development');
  console.log('  node scripts/switch-env.js production');
  process.exit(1);
}

switchEnvironment(env); 