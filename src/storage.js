import fs from 'node:fs';
import path from 'node:path';

const fsp = fs.promises;

const SUPPORTED_EXTENSIONS = ['.md', '.txt', '.markdown'];

export class NoteError extends Error {}

export function ensureExtension(name) {
	name = String(name).trim();
	const ext = path.extname(name);
	if (!ext) {
		return `${name}.md`;
	}
	return name;
}

export function cleanFilename(title) {
	let name = String(title).trim();
	if (!name) {
		name = 'untitled';
	}
	name = name.replace(/[ /\\:*?"<>|]/g, '-').replace(/-+/g, '-');
	return ensureExtension(name);
}

export function extractTitle(filename, content) {
	const lines = String(content).split('\n');
	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed && trimmed.startsWith('#')) {
			const heading = trimmed.replace(/^#+/, '').trim();
			if (heading) {
				return heading;
			}
		}
	}
	const base = path.basename(filename);
	const ext = path.extname(base);
	const title = base.slice(0, base.length - ext.length);
	return title.replaceAll('-', ' ');
}

export function calculateStats(content) {
	const text = String(content);
	if (!text.trim()) {
		return { words: 0, lines: 0 };
	}
	const words = text.split(/\s+/).filter(Boolean).length;
	const lines = text.split('\n').length;
	return { words, lines };
}

export function filterNotes(notes, query) {
	const q = String(query ?? '').trim().toLowerCase();
	if (!q) {
		return notes;
	}
	return notes.filter((note) => {
		return (
			note.title.toLowerCase().includes(q) ||
			note.filename.toLowerCase().includes(q) ||
			note.content.toLowerCase().includes(q)
		);
	});
}

export class Storage {
	constructor(dir, { createDir = true } = {}) {
		this.dir = dir || 'notes';
		this.createDir = createDir;
	}

	async init() {
		if (this.createDir) {
			await fsp.mkdir(this.dir, { recursive: true });
		}
		return this;
	}

	async listNotes() {
		const names = await fsp.readdir(this.dir);
		const notes = [];

		for (const name of names) {
			const fullPath = path.join(this.dir, name);
			const ext = path.extname(name).toLowerCase();
			if (!SUPPORTED_EXTENSIONS.includes(ext)) {
				continue;
			}

			let info;
			try {
				info = await fsp.stat(fullPath);
			} catch (err) {
				continue;
			}
			if (!info.isFile()) {
				continue;
			}

			let content;
			try {
				content = await fsp.readFile(fullPath, 'utf8');
			} catch (err) {
				continue;
			}

			const { words, lines } = calculateStats(content);
			notes.push({
				filename: name,
				path: fullPath,
				title: extractTitle(name, content),
				content,
				modTime: info.mtime,
				size: info.size,
				wordCount: words,
				lineCount: lines,
			});
		}

		notes.sort((a, b) => b.modTime.getTime() - a.modTime.getTime());
		return notes;
	}

	async saveNote(filename, content) {
		const safeName = ensureExtension(filename);
		const fullPath = path.join(this.dir, safeName);
		await fsp.writeFile(fullPath, content, 'utf8');

		const info = await fsp.stat(fullPath);
		const { words, lines } = calculateStats(content);
		return {
			filename: safeName,
			path: fullPath,
			title: extractTitle(safeName, content),
			content,
			modTime: info.mtime,
			size: info.size,
			wordCount: words,
			lineCount: lines,
		};
	}

	async createNote(filename, content) {
		let name = cleanFilename(filename);
		const fullPath = path.join(this.dir, name);

		try {
			await fsp.access(fullPath);
			const ext = path.extname(name);
			const base = name.slice(0, name.length - ext.length);
			let counter = 1;
			for (;;) {
				const candidate = `${base}-${counter}${ext}`;
				try {
					await fsp.access(path.join(this.dir, candidate));
				} catch (err) {
					name = candidate;
					break;
				}
				counter++;
			}
		} catch (err) {
			// File does not exist yet โ€” name is available.
		}

		return this.saveNote(name, content);
	}

	async deleteNote(filename) {
		const fullPath = path.join(this.dir, filename);
		try {
			await fsp.unlink(fullPath);
		} catch (err) {
			if (err.code !== 'ENOENT') {
				throw new Error(`failed to delete note: ${err.message}`);
			}
		}
	}

	async renameNote(oldFilename, newFilename) {
		const newName = ensureExtension(newFilename);
		await fsp.rename(
			path.join(this.dir, oldFilename),
			path.join(this.dir, newName),
		);
	}
}