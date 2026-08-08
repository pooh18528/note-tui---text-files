#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const args = ['run', 'main.go', ...process.argv.slice(2)];

const child = spawn('go', args, { cwd: projectRoot, stdio: 'inherit' });

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code === null ? 0 : code);
  }
});