const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run a command and return its output
function runCommand(command) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

console.log('Starting build test...');

// Check Node and npm versions
console.log('Node version:', process.version);
const npmVersion = runCommand('npm -v');
console.log('npm version:', npmVersion.success ? npmVersion.output.trim() : 'Error');

// Check React and ReactDOM versions
try {
  const react = require('react');
  const reactDom = require('react-dom');
  console.log('React version:', react.version);
  console.log('ReactDOM version:', reactDom.version);
} catch (error) {
  console.error('Error loading React:', error.message);
}

// Check if index.js is using the correct React DOM API
try {
  const indexJs = fs.readFileSync(path.join(__dirname, 'src', 'index.js'), 'utf8');
  console.log('index.js is using:', 
    indexJs.includes('ReactDOM.createRoot') ? 'React 18 createRoot API' : 'React 17 render API');
} catch (error) {
  console.error('Error reading index.js:', error.message);
}

// Try to run the build
console.log('\nAttempting to build...');
const buildResult = runCommand('npx react-scripts build');
console.log('Build result:', buildResult.success ? 'Success' : 'Failed');
if (!buildResult.success) {
  console.error('Build error:', buildResult.error);
}

console.log('Build test completed.');
