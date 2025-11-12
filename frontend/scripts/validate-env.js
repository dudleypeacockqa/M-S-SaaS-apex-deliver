#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Ensures all required environment variables are set before build
 * Run: node scripts/validate-env.js
 */

const requiredVars = [
  'VITE_API_URL',
  'VITE_CLERK_PUBLISHABLE_KEY',
];

const optionalVars = [
  'VITE_ENABLE_MASTER_ADMIN',
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'VITE_SENTRY_DSN',
  'VITE_GA_TRACKING_ID',
];

function validateEnvironment() {
  console.log('🔍 Validating environment variables...\n');

  let hasErrors = false;
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredVars.forEach((varName) => {
    const value = process.env[varName];
    if (!value || value.includes('[GET_FROM') || value.includes('your_key_here')) {
      missing.push(varName);
      hasErrors = true;
    } else {
      console.log(`✅ ${varName}: ${maskValue(value)}`);
    }
  });

  // Check optional variables
  optionalVars.forEach((varName) => {
    const value = process.env[varName];
    if (!value) {
      warnings.push(varName);
    } else {
      console.log(`✅ ${varName}: ${maskValue(value)}`);
    }
  });

  // Report results
  console.log('');
  if (hasErrors) {
    console.error('❌ Missing required environment variables:\n');
    missing.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\n📋 Set these variables in:');
    console.error('   1. Render Dashboard → Environment tab (for production)');
    console.error('   2. frontend/.env.local (for local development)');
    console.error('   3. CI/CD secrets (for automated deployments)\n');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Optional variables not set (using defaults):\n');
    warnings.forEach((varName) => {
      console.warn(`   - ${varName}`);
    });
    console.warn('');
  }

  console.log('✅ Environment validation passed!\n');
}

function maskValue(value) {
  if (!value || value.length < 8) return '***';
  return value.substring(0, 8) + '***' + value.substring(value.length - 4);
}

validateEnvironment();
