const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const nodeCmd = process.execPath;

const processes = [];
let shuttingDown = false;

function startProcess(name, command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    windowsHide: true,
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return;
    }

    const exitCode = typeof code === 'number' ? code : 1;
    console.error(`\n${name} exited${signal ? ` (${signal})` : ''}.\n`);
    shutdown(exitCode);
  });

  processes.push(child);
}

function shutdown(code) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

startProcess('backend', nodeCmd, ['src/index.js'], path.join(rootDir, 'backend'));
startProcess(
  'frontend',
  'cmd.exe',
  ['/d', '/s', '/c', 'npm run start --workspace frontend'],
  rootDir
);
