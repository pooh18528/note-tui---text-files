import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Storage, cleanFilename, filterNotes } from '../src/storage.js';

let tempDir;

beforeEach(async () => {
	tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'note-tui-test-'));
});

afterEach(async () => {
	await fs.promises.rm(tempDir, { recursive: true, force: true });
});

describe('Storage operations', () => {
	it('creates, lists, saves, filters and deletes notes', async () => {
		const store = await new Storage(tempDir).init();

		const note1 = await store.createNote('Meeting Notes', '# Team Sync\nDiscuss Q3 roadmap and feature priorities.');
		expect(note1.filename).toBe('Meeting-Notes.md');
		expect(note1.title).toBe('Team Sync');
		expect(note1.wordCount).toBe(9);

		await store.createNote('Shopping List.txt', '1. Milk\n2. Coffee\n3. Bread');

		const notes = await store.listNotes();
		expect(notes).toHaveLength(2);

		const updated = await store.saveNote(note1.filename, '# Team Sync\nUpdated content with more details.');
		expect(updated.wordCount).toBe(8);

		const filtered = filterNotes(notes, 'Shopping');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].title).toBe('Shopping List');

		await store.deleteNote(note1.filename);
		const afterDelete = await store.listNotes();
		expect(afterDelete).toHaveLength(1);
	});

	it('creates a note with a suffix when the file already exists', async () => {
		const store = await new Storage(tempDir).init();
		await store.createNote('Note', 'first');
		const second = await store.createNote('Note', 'second');
		expect(second.filename).toBe('Note-1.md');
		const notes = await store.listNotes();
		expect(notes).toHaveLength(2);
	});

	it('sorts notes by modification time, newest first', async () => {
		const store = await new Storage(tempDir).init();
		await store.createNote('Old', 'old content');
		const newer = await store.createNote('New', 'new content');
		await new Promise((resolve) => setTimeout(resolve, 20));
		await store.saveNote(newer.filename, 'edited newer content');

		const notes = await store.listNotes();
		expect(notes[0].filename).toBe(newer.filename);
	});

	it('ignores non-text files when listing', async () => {
		const store = await new Storage(tempDir).init();
		await fs.promises.writeFile(path.join(tempDir, 'ignore.me'), 'x');
		await store.createNote('Real', 'content');
		const notes = await store.listNotes();
		expect(notes).toHaveLength(1);
	});

	it('creates the storage directory automatically', async () => {
		const nested = path.join(tempDir, 'a', 'b');
		const store = await new Storage(nested).init();
		await store.createNote('Nested', 'hi');
		expect(fs.existsSync(path.join(nested, 'Nested.md'))).toBe(true);
	});

	it('renames a note', async () => {
		const store = await new Storage(tempDir).init();
		await store.createNote('Original', 'body');
		await store.renameNote('Original.md', 'Renamed');
		const notes = await store.listNotes();
		expect(notes[0].filename).toBe('Renamed.md');
	});
});

describe('cleanFilename', () => {
	it.each([
		['my note', 'my-note.md'],
		['important/work:note*', 'important-work-note-.md'],
		['test.txt', 'test.txt'],
		['', 'untitled.md'],
	])('cleanFilename(%j) = %j', (input, expected) => {
		expect(cleanFilename(input)).toBe(expected);
	});
});
