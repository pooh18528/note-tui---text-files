#!/usr/bin/env node
import { build } from 'esbuild';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist', '.dev');
fs.mkdirSync(distDir, { recursive: true });

const outfile = path.join(distDir, 'note-tui.mjs');

await build({
	entryPoints: [path.join(root, 'src', 'cli.jsx')],
	bundle: true,
	platform: 'node',
	format: 'esm',
	packages: 'external',
	outfile,
	logLevel: 'warning',
});

await import(pathToFileURL(outfile).href);