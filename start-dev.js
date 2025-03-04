
const { spawn } = require('child_process');
const { platform } = require('os');

// Determine npm or npx command based on platform
const npmCmd = platform() === 'win32' ? 'npm.cmd' : 'npm';

// Start the frontend
const frontend = spawn(npmCmd, ['run', 'dev:frontend'], { stdio: 'inherit', shell: true });

// Start the backend
const backend = spawn(npmCmd, ['run', 'dev:backend'], { stdio: 'inherit', shell: true });

// Handle process termination
const cleanup = () => {
  frontend.kill();
  backend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log('Development servers started. Press Ctrl+C to stop.');
