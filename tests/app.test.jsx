import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { App } from '../src/app.jsx';
import { Storage } from '../src/storage.js';

async function makeStore() {
	const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'note-tui-app-test-'));
	const store = await new Storage(dir).init();
	await store.createNote('Meeting Notes', '# Team Sync\nDiscuss Q3 roadmap.');
	await store.createNote('Shopping List.txt', '1. Milk\n2. Coffee\n3. Bread');
	return store;
}

async function waitForFrame(lastFrame, check, timeout = 4000) {
	const start = Date.now();
	let last;
	while (Date.now() - start < timeout) {
		last = lastFrame();
		if (check(last)) {
			return last;
		}
		await new Promise((resolve) => setTimeout(resolve, 25));
	}
	throw new Error(`Timed out waiting for frame.\nLast frame:\n${last}`);
}

async function waitFor(check, timeout = 4000) {
	const start = Date.now();
	while (Date.now() - start < timeout) {
		if (await check()) {
			return true;
		}
		await new Promise((resolve) => setTimeout(resolve, 25));
	}
	return false;
}

describe('App', () => {
	it('renders the note list after loading from disk', async () => {
		const store = await makeStore();
		const { lastFrame, unmount } = render(<App store={store} />);

		const frame = await waitForFrame(lastFrame, (f) => f.includes('Team Sync'));
		expect(frame).toContain('Team Sync');
		expect(frame).toContain('Shopping List');
		expect(frame).toContain('Shopping-List.txt');

		unmount();
	});

	it('enters create mode on n and creates a note on Enter', async () => {
		const store = await makeStore();
		const { lastFrame, stdin, unmount } = render(<App store={store} />);

		await waitForFrame(lastFrame, (f) => f.includes('Team Sync'));

		stdin.write('n');
		await waitForFrame(lastFrame, (f) => f.includes('Create New Note'));

for (const char of 'Todo') {
		stdin.write(char);
		await new Promise((resolve) => setTimeout(resolve, 60));
	}
	stdin.write('\r');

	const filename = path.join(store.dir, 'Todo.md');
	const fileAppeared = await waitFor(async () => fs.existsSync(filename));
	expect(fileAppeared).toBe(true);
	expect(await fs.promises.readFile(filename, 'utf8')).toBe('');

	await waitForFrame(lastFrame, (f) => f.includes(' ▶ Todo') && f.includes('Todo.md'));

	unmount();
});
});
