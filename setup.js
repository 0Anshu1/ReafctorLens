#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up RefactorLens...\n');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Created logs directory');
}

// Create .env file if it doesn't exist
const envFile = path.join(__dirname, '.env');
const envExampleFile = path.join(__dirname, 'env.example');

if (!fs.existsSync(envFile) && fs.existsSync(envExampleFile)) {
  fs.copyFileSync(envExampleFile, envFile);
  console.log('✅ Created .env file from template');
  console.log('⚠️  Please update .env with your configuration');
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies:', error.message);
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, 'client') });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update .env file with your MongoDB and Redis connection details');
console.log('2. Start MongoDB and Redis services');
console.log('3. Run "npm run dev" to start the development servers');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n🔧 Available commands:');
console.log('- npm run dev     : Start both backend and frontend in development mode');
console.log('- npm run server  : Start only the backend server');
console.log('- npm run client  : Start only the frontend client');
console.log('- npm run build   : Build the frontend for production');
console.log('- npm test        : Run the test suite');

