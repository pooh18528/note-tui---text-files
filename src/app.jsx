import React, { useCallback, useEffect, useState } from 'react';
import { Box, Text, useInput, useApp, useWindowSize } from 'ink';
import { HeaderBar } from './ui/Header.jsx';
import { Sidebar } from './ui/Sidebar.jsx';
import { NoteView } from './ui/NoteView.jsx';
import { CreateForm } from './ui/CreateForm.jsx';
import { EditorPane } from './ui/EditorPane.jsx';
import { SearchBox } from './ui/SearchBox.jsx';
import { DeleteView } from './ui/DeleteView.jsx';
import { StatusBar } from './ui/StatusBar.jsx';
import { filterNotes } from './storage.js';
import { THEME } from './styles.js';

const STATUS_TIMEOUT_MS = 5000;

export function App({ store }) {
	const { exit } = useApp();
	const { columns: width, rows: height } = useWindowSize();

	const [mode, setMode] = useState('list');
	const [notes, setNotes] = useState([]);
	const [filteredNotes, setFilteredNotes] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollOffset, setScrollOffset] = useState(0);
	const [createTitle, setCreateTitle] = useState('');
	const [editFilename, setEditFilename] = useState('');
	const [editContent, setEditContent] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [status, setStatus] = useState({ msg: '', isErr: false });

	const setStatusMessage = useCallback((msg, isErr = false) => {
		setStatus({ msg, isErr });
	}, []);

	useEffect(() => {
		if (!status.msg) {
			return undefined;
		}
		const timer = setTimeout(() => setStatus({ msg: '', isErr: false }), STATUS_TIMEOUT_MS);
		return () => clearTimeout(timer);
	}, [status]);

	// Keep the latest search query readable inside async reloads.
	const searchQueryRef = React.useRef('');
	searchQueryRef.current = searchQuery;

	const applyFilter = useCallback((allNotes, query) => {
		const next = query && query.trim() ? filterNotes(allNotes, query) : allNotes;
		setNotes(allNotes);
		setFilteredNotes(next);
		setSelectedIndex(0);
		setScrollOffset(0);
	}, []);

	const reload = useCallback(
		async (successMsg) => {
			try {
				const allNotes = await store.listNotes();
				applyFilter(allNotes, searchQueryRef.current);
				if (successMsg) {
					setStatusMessage(successMsg);
				}
			} catch (err) {
				setStatusMessage(`Error reading notes: ${err.message}`, true);
			}
		},
		[store, applyFilter, setStatusMessage],
	);

	useEffect(() => {
		reload();
	}, [reload]);

	const sidebarWidth = Math.max(Math.floor(width / 3), 25);
	const contentWidth = Math.max(width - sidebarWidth - 6, 20);
	const layoutHeight = Math.max(height - 3, 5);

	const navList = useCallback(
		(delta) => {
			if (filteredNotes.length === 0) {
				return;
			}
			setSelectedIndex((prev) => {
				const next = prev + delta;
				return Math.max(0, Math.min(next, filteredNotes.length - 1));
			});
			setScrollOffset(0);
		},
		[filteredNotes.length],
	);

	const scrollBy = useCallback((delta) => {
		setScrollOffset((prev) => Math.max(0, prev + delta));
	}, []);

	const openView = useCallback(() => {
		if (filteredNotes.length > 0) {
			setScrollOffset(0);
			setMode('view');
		}
	}, [filteredNotes.length]);

	const startCreate = useCallback(() => {
		setCreateTitle('');
		setMode('create');
	}, []);

	const startEdit = useCallback(() => {
		const note = filteredNotes[selectedIndex];
		if (note) {
			setEditFilename(note.filename);
			setEditContent(note.content);
			setScrollOffset(0);
			setMode('edit');
		}
	}, [filteredNotes, selectedIndex]);

	const startSearch = useCallback(() => {
		setSearchQuery('');
		setMode('search');
	}, []);

	const handleSearchChange = useCallback(
		(query) => {
			setSearchQuery(query);
			applyFilter(notes, query);
		},
		[notes, applyFilter],
	);

	const clearSearch = useCallback(() => {
		setSearchQuery('');
		setFilteredNotes(notes);
		setMode('list');
	}, [notes]);

	const submitCreate = useCallback(async () => {
		const title = createTitle.trim() || 'Untitled Note';
		try {
			const note = await store.createNote(title, '');
			setStatusMessage(`Created note: ${note.filename}`);
			const allNotes = await store.listNotes();
			applyFilter(allNotes, searchQueryRef.current);
			const idx = allNotes.findIndex((n) => n.filename === note.filename);
			setSelectedIndex(idx === -1 ? 0 : idx);
			setScrollOffset(0);
			setMode('list');
		} catch (err) {
			setStatusMessage(`Failed to create note: ${err.message}`, true);
		}
	}, [createTitle, store, applyFilter, setStatusMessage]);

	const saveEdit = useCallback(async () => {
		try {
			await store.saveNote(editFilename, editContent);
			setStatusMessage(`Saved ${editFilename}`);
			setMode('list');
			await reload();
		} catch (err) {
			setStatusMessage(`Failed to save note: ${err.message}`, true);
		}
	}, [editFilename, editContent, store, reload, setStatusMessage]);

	const confirmDelete = useCallback(async () => {
		const target = filteredNotes[selectedIndex];
		if (!target) {
			setMode('list');
			return;
		}
		try {
			await store.deleteNote(target.filename);
			setStatusMessage(`Deleted ${target.filename}`);
			setMode('list');
			await reload();
		} catch (err) {
			setStatusMessage(`Failed to delete note: ${err.message}`, true);
		}
	}, [filteredNotes, selectedIndex, store, reload, setStatusMessage]);

	useInput(
		(input, key) => {
			switch (mode) {
				case 'list':
					if (input === 'q' || (key.ctrl && input === 'c')) {
						exit();
					} else if (input === 'j' || key.downArrow) {
						navList(1);
					} else if (input === 'k' || key.upArrow) {
						navList(-1);
					} else if (key.return || input === 'v' || input === 'l' || key.rightArrow) {
						openView();
					} else if (input === 'n') {
						startCreate();
					} else if (input === 'e') {
						startEdit();
					} else if (input === 'd') {
						setMode('delete');
					} else if (input === '/') {
						startSearch();
					} else if (input === 'r') {
						reload('Notes refreshed');
					}
					break;

				case 'view':
					if (input === 'q' || (key.ctrl && input === 'c')) {
						exit();
					} else if (key.escape || input === 'h' || key.leftArrow) {
						setMode('list');
					} else if (input === 'e') {
						startEdit();
					} else if (input === 'j' || key.downArrow) {
						scrollBy(1);
					} else if (input === 'k' || key.upArrow) {
						scrollBy(-1);
					} else if (key.pageDown) {
						scrollBy(layoutHeight);
					} else if (key.pageUp) {
						scrollBy(-layoutHeight);
					} else if (key.home) {
						setScrollOffset(0);
					} else if (key.end) {
						setScrollOffset(Number.MAX_SAFE_INTEGER);
					}
					break;

				case 'create':
					if (key.escape) {
						setMode('list');
					}
					break;

				case 'edit':
					if (key.ctrl && input === 's') {
						saveEdit();
					} else if (key.escape) {
						setMode('list');
					}
					break;

				case 'delete':
					if (input === 'y' || key.return) {
						confirmDelete();
					} else if (input === 'n' || key.escape) {
						setMode('list');
					}
					break;

				case 'search':
					if (key.escape) {
						clearSearch();
					} else if (key.return) {
						setMode('list');
					}
					break;
				default:
					break;
			}
		},
		{ isActive: true },
	);

	const selectedNote = filteredNotes[selectedIndex];

	const renderRightPane = () => {
		switch (mode) {
			case 'create':
				return (
					<CreateForm
						value={createTitle}
						onChange={setCreateTitle}
						onSubmit={submitCreate}
						focus
					/>
				);

			case 'edit':
				return (
					<Box
						width={contentWidth}
						flexDirection="column"
						borderStyle="round"
						borderColor={THEME.mainBorder}
						paddingLeft={1}
						paddingRight={1}
					>
						<Text bold color={THEME.primary}>
							{`✏️ Editing: ${editFilename}`}
						</Text>
						<Box flexDirection="column" height={Math.max(layoutHeight - 8, 1)}>
							<EditorPane
								value={editContent}
								onChange={setEditContent}
								focus
								width={contentWidth - 2}
								height={Math.max(layoutHeight - 8, 1)}
							/>
						</Box>
						<Text color={THEME.muted}>[Ctrl+S] Save Note  •  [Esc] Cancel</Text>
					</Box>
				);

			case 'search':
				return (
					<Box flexDirection="column" width={contentWidth}>
						<SearchBox
							value={searchQuery}
							onChange={handleSearchChange}
							onEnter={() => setMode('list')}
							focus
						/>
						{selectedNote ? (
							<NoteView
								note={selectedNote}
								width={contentWidth}
								height={Math.max(layoutHeight - 3, 1)}
								scroll={scrollOffset}
								active={false}
							/>
						) : (
							<Text color={THEME.muted}>No matching notes.</Text>
						)}
					</Box>
				);

			case 'delete':
				return selectedNote ? <DeleteView note={selectedNote} /> : null;

			default:
				return selectedNote ? (
					<NoteView
						note={selectedNote}
						width={contentWidth}
						height={layoutHeight}
						scroll={scrollOffset}
						active={mode === 'view'}
					/>
				) : (
					<Text color={THEME.muted}>No notes. Press n to create one.</Text>
				);
		}
	};

	if (!height) {
		return <Text>Initializing note-tui...</Text>;
	}

	return (
		<Box flexDirection="column">
			<HeaderBar dir={store.dir} count={filteredNotes.length} />

			<Box flexDirection="row">
				<Sidebar
					notes={filteredNotes}
					selectedIndex={selectedIndex}
					width={sidebarWidth}
					height={layoutHeight}
					active={mode === 'list'}
				/>
				<Box marginLeft={1} flexDirection="column">
					{renderRightPane()}
				</Box>
			</Box>

			<StatusBar mode={mode} statusMsg={status.msg} statusErr={status.isErr} />
		</Box>
	);
}