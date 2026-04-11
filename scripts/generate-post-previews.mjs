import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const scriptPath = resolve('scripts', 'generate-post-previews.ps1');
const rawArgs = process.argv.slice(2);
const translatedArgs = [];

for (const arg of rawArgs) {
  if (arg === 'force') {
    translatedArgs.push('-Force');
    continue;
  }

  if (arg.startsWith('maxWidth=')) {
    translatedArgs.push('-MaxWidth', arg.slice('maxWidth='.length));
    continue;
  }

  if (arg.startsWith('quality=')) {
    translatedArgs.push('-Quality', arg.slice('quality='.length));
    continue;
  }

  translatedArgs.push(arg);
}

const args = [
  '-ExecutionPolicy',
  'Bypass',
  '-File',
  scriptPath,
  ...translatedArgs,
];

const child = spawn('powershell', args, {
  stdio: 'inherit',
  shell: false,
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});

child.on('error', (error) => {
  console.error('Falha ao executar o gerador de previews:', error.message);
  process.exit(1);
});
