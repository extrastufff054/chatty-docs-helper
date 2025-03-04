
const { spawn } = require('child_process');
const { join } = require('path');
const { platform } = require('os');

// Determine the command to use based on the OS
const npmCmd = platform() === 'win32' ? 'npm.cmd' : 'npm';

// Start the frontend development server
const frontend = spawn(npmCmd, ['run', 'vite:dev'], {
  stdio: 'inherit',
  shell: true
});

// Start the backend server
const backend = spawn('ts-node', ['--project', 'tsconfig.server.json', 'server.ts'], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down development servers...');
  frontend.kill();
  backend.kill();
  process.exit(0);
});

console.log('Development servers started!');
console.log('Frontend: http://localhost:8080');
console.log('Backend: http://localhost:5000');
