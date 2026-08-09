#!/usr/bin/env node
import { parseArgs } from 'node:util';
import React from 'react';
import { render } from 'ink';
import { App } from './app.jsx';
import { Storage } from './storage.js';

const HELP = `note-tui v2.0.0 - โน้ตง่ายๆ บันทึก text files

Simple text-file note taking in your terminal.

Usage:
  note-tui [options]

Options:
  --dir <path>   Directory to store note text files (default: notes)
  --name <name>  Custom app name displayed in header (default: note-tui)
  -v, --version  Show version and exit
  -h, --help     Show this help and exit
`;

let parsed;
try {
	parsed = parseArgs({
		args: process.argv.slice(2),
		options: {
			dir: { type: 'string' },
			name: { type: 'string' },
			v: { type: 'boolean', short: 'v' },
			version: { type: 'boolean' },
			h: { type: 'boolean', short: 'h' },
			help: { type: 'boolean' },
		},
		strict: true,
	});
} catch (err) {
	console.error(`Invalid arguments: ${err.message}\n`);
	console.error(HELP);
	process.exit(1);
}

const { values } = parsed;

if (values.h || values.help) {
	console.log(HELP);
	process.exit(0);
}

if (values.v || values.version) {
	console.log('note-tui v2.0.0 - โน้ตง่ายๆ บันทึก text files');
	process.exit(0);
}

if (!process.stdin.isTTY || !process.stdout.isTTY) {
	console.error('note-tui requires an interactive terminal.\n');
	console.error(HELP);
	process.exit(1);
}

const store = await new Storage(values.dir).init();
const appName = values.name || 'war';

render(<App store={store} appName={appName} />, { exitOnCtrlC: false });