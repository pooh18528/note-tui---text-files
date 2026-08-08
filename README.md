<div align="center">

# 📝 note-tui

**Simple text file note-taking application powered by Terminal UI (TUI) in Go**

[English](README.md) | [ภาษาไทย](README.th.md)

![note-tui preview](img/demo.png)

</div>

---

## ✨ Key Features

- 📁 **Plain Text Storage**: All notes are stored as `.md` or `.txt` text files in `./notes` (or a custom directory via `--dir`), making them readable by any editor, Git, or cloud sync service.
- 🎨 **Modern Sleek Interface**: Built with [Charm Bubble Tea](https://github.com/charmbracelet/bubbletea) and [Lip Gloss](https://github.com/charmbracelet/lipgloss) with an aesthetic dark mode design.
- 🔍 **Real-time Live Search**: Press `/` to search and filter notes by title or content instantly.
- 📊 **Note Statistics**: Displays word count, line count, file size, and last modified date.
- ⌨️ **Keyboard Driven**: Efficient workflow with keyboard shortcuts for all actions.

---

## 🚀 Quick Start

### 1. Run locally
```bash
npm install   # optional — no external dependencies needed
npm start
```

### 2. Build & sanity-check
```bash
npm run build   # syntax-checks all source files
```

### 3. Run tests
```bash
npm test
```

### 4. Install as a global command (optional)
```bash
npm link
note-tui
```

---

## ⌨️ Keyboard Shortcuts

| Mode | Key | Action |
|---|---|---|
| **List Mode** | `j` / `Down` | Move cursor down |
| | `k` / `Up` | Move cursor up |
| | `Enter` / `v` | View selected note |
| | `n` | Create new note |
| | `e` | Edit selected note |
| | `d` | Delete selected note (with confirmation prompt) |
| | `/` | Search & filter notes |
| | `r` | Refresh notes from disk |
| | `q` / `Ctrl+C` | Quit note-tui |
| **Edit Mode** | `Ctrl+S` | Save changes |
| | `Esc` | Cancel editing |
| **Search Mode** | `Type text` | Filter notes in real-time |
| | `Esc` | Clear search filter |

---

## 📁 File Architecture

```
note-tui/
├── main.go               # CLI entry point & flag parsing
├── storage/
│   ├── storage.go        # Text file reading/writing/deleting & searching
│   └── storage_test.go   # Unit tests for storage
├── ui/
│   ├── model.go          # Bubble Tea state machine & views
│   └── styles.go         # Lip Gloss theme & UI styling
├── img/
│   └── demo.png          # Demo preview screenshot
└── notes/                # Storage directory for note text files
    ├── welcome.md
    └── shortcut-guide.md
```

---

## 📄 License
MIT License
