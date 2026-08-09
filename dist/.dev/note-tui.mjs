#!/usr/bin/env node

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/cli.jsx
import { parseArgs } from "node:util";
import React11 from "react";
import { render } from "ink";

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/app.jsx
import React10, { useCallback, useEffect, useState } from "react";
import { Box as Box10, Text as Text9, useInput, useApp, useWindowSize } from "ink";

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/ui/Header.jsx
import React from "react";
import { Box, Text } from "ink";

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/styles.js
var colors = {
  primary: "#7D56F4",
  secondary: "#00E5FF",
  accent: "#FF79C6",
  success: "#50FA7B",
  warning: "#FFB86C",
  danger: "#FF5555",
  muted: "#6272A4",
  bgDark: "#181824",
  bgCard: "#212230",
  fgLight: "#F8F8F2",
  border: "#44475A"
};
var THEME = {
  headerBackground: colors.primary,
  headerForeground: colors.fgLight,
  badgeBackground: colors.secondary,
  badgeForeground: colors.bgDark,
  sidebarBorder: colors.border,
  sidebarBorderActive: colors.primary,
  mainBorder: colors.border,
  mainBorderActive: colors.secondary,
  itemForeground: colors.fgLight,
  itemActiveForeground: colors.bgDark,
  itemActiveBackground: colors.primary,
  fgLight: colors.fgLight,
  border: colors.border,
  muted: colors.muted,
  statusBackground: colors.bgCard,
  statusForeground: colors.fgLight,
  statusKey: colors.secondary,
  dialogBackground: colors.bgCard,
  dialogBorder: colors.primary,
  success: colors.success,
  danger: colors.danger,
  bgDark: colors.bgDark
};

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/ui/Header.jsx
function HeaderBar({ dir, count, appName: appName2 = "note-tui" }) {
  return /* @__PURE__ */ React.createElement(Box, { marginBottom: 1 }, /* @__PURE__ */ React.createElement(Text, { bold: true, backgroundColor: THEME.headerBackground, color: THEME.headerForeground }, ` \u{1F4DD} ${appName2} `), /* @__PURE__ */ React.createElement(Text, { bold: true, backgroundColor: THEME.headerBackground, color: THEME.badgeForeground }, ` \u{1F4C1} ${dir} `), /* @__PURE__ */ React.createElement(Text, { color: THEME.muted }, ` (${count} ${count === 1 ? "note" : "notes"})`));
}

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/ui/Sidebar.jsx
import React2 from "react";
import { Box as Box2, Text as Text2 } from "ink";

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/utils.js
import stringWidth from "string-width";
var codepointsOf = (str) => Array.from(str);
function wrapText(text, width) {
  if (width <= 0) {
    return [];
  }
  const rows = [];
  for (const rawLine of String(text ?? "").split("\n")) {
    if (stringWidth(rawLine) <= width) {
      rows.push(rawLine);
      continue;
    }
    let current = "";
    let currentWidth = 0;
    let index = 0;
    const length = rawLine.length;
    while (index < length) {
      const g = codepointsOf(rawLine[index]);
      const w = stringWidth(g);
      if (currentWidth + w > width && current !== "") {
        rows.push(current);
        current = "";
        currentWidth = 0;
      }
      current += g;
      currentWidth += w;
      index += g.length;
    }
    if (current !== "") {
      rows.push(current);
    } else if (currentWidth === 0 && rawLine !== "") {
      rows.push(rawLine);
    }
    rows.push("");
  }
  return rows.filter((row, i) => i !== rows.length - 1 || row !== "");
}
function truncate(str, maxWidth, suffix = "..") {
  const text = String(str ?? "");
  if (maxWidth <= 0) {
    return "";
  }
  if (stringWidth(text) <= maxWidth) {
    return text;
  }
  const suffixWidth = stringWidth(suffix);
  const available = maxWidth - suffixWidth;
  if (available <= 0) {
    return suffix.slice(0, maxWidth);
  }
  let result = "";
  let width = 0;
  for (const char of codepointsOf(text)) {
    const w = stringWidth(char);
    if (width + w > available) {
      break;
    }
    result += char;
    width += w;
  }
  return `${result}${suffix}`;
}
function formatDateTime(date) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function formatListDate(date) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/ui/Sidebar.jsx
function Sidebar({ notes, selectedIndex, width, height, active }) {
  const borderColor = active ? THEME.sidebarBorderActive : THEME.sidebarBorder;
  const innerWidth = Math.max(width - 4, 1);
  const titleWidth = innerWidth - 15;
  const visibleBodyHeight = Math.max(height - 4, 0);
  const start = Math.min(
    Math.max(0, selectedIndex - Math.floor(visibleBodyHeight / 2)),
    Math.max(0, notes.length - visibleBodyHeight)
  );
  const visible = notes.slice(start, start + visibleBodyHeight);
  return /* @__PURE__ */ React2.createElement(
    Box2,
    {
      width,
      height,
      borderStyle: "round",
      borderColor: active ? THEME.sidebarBorderActive : THEME.sidebarBorder,
      paddingLeft: 1,
      paddingRight: 1,
      flexDirection: "column"
    },
    /* @__PURE__ */ React2.createElement(Text2, { bold: true, color: THEME.fgLight }, "\u{1F4CB} NOTES LIST"),
    /* @__PURE__ */ React2.createElement(Text2, { color: THEME.border }, "\u2500".repeat(Math.max(innerWidth, 1))),
    visible.length === 0 ? /* @__PURE__ */ React2.createElement(Text2, { color: THEME.muted, italic: true }, "No notes") : visible.map((note, k) => {
      const i = start + k;
      const isSelected = i === selectedIndex;
      const title = truncate(note.title, Math.max(titleWidth, 1));
      const date = formatListDate(note.modTime);
      const marker = isSelected ? "\u25B6 " : "  ";
      const line = `${marker}${title} ${date}`;
      return /* @__PURE__ */ React2.createElement(
        Text2,
        {
          key: note.filename,
          bold: isSelected,
          color: isSelected ? THEME.itemActiveForeground : THEME.itemForeground,
          backgroundColor: isSelected ? THEME.itemActiveBackground : void 0,
          wrap: "truncate"
        },
        marker,
        title,
        " ",
        date
      );
    })
  );
}

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/ui/NoteView.jsx
import React3 from "react";
import { Box as Box3, Text as Text3 } from "ink";
function NoteView({ note, width, height, scroll, active }) {
  const innerWidth = Math.max(width - 4, 1);
  const headerRows = 3;
  const maxBodyRows = Math.max(height - 6 - headerRows, 1);
  const meta = `\u{1F4C4} ${note.filename}  \u2022  \u{1F4C5} ${formatDateTime(note.modTime)}  \u2022  \u{1F4DD} ${note.wordCount} words  \u2022  \u{1F4CF} ${note.lineCount} lines`;
  const metaText = truncate(meta, innerWidth);
  const isEmpty = !note.content.trim();
  const body = wrapText(isEmpty ? "(Empty Note)" : note.content, innerWidth);
  const clampedScroll = Math.max(0, Math.min(scroll, Math.max(0, body.length - maxBodyRows)));
  const visibleBody = body.slice(clampedScroll, clampedScroll + maxBodyRows);
  const borderColor = active ? THEME.mainBorderActive : THEME.mainBorder;
  return /* @__PURE__ */ React3.createElement(
    Box3,
    {
      width,
      height,
      borderStyle: "round",
      borderColor,
      paddingLeft: 1,
      paddingRight: 1,
      flexDirection: "column"
    },
    /* @__PURE__ */ React3.createElement(Text3, { bold: true, color: THEME.secondary }, `# ${note.title}`),
    /* @__PURE__ */ React3.createElement(Text3, { color: THEME.muted }, metaText || " "),
    /* @__PURE__ */ React3.createElement(Text3, { color: THEME.border }, "\u2500".repeat(Math.max(innerWidth, 1))),
    visibleBody.map(
      (line, i) => isEmpty ? /* @__PURE__ */ React3.createElement(Text3, { key: i, color: THEME.muted, italic: true }, line || " ") : /* @__PURE__ */ React3.createElement(Text3, { key: i, color: THEME.fgLight }, line || " ")
    )
  );
}

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/ui/CreateForm.jsx
import React4 from "react";
import { Box as Box4, Text as Text4 } from "ink";
import TextInput from "ink-text-input";
function CreateForm({ value, onChange, onSubmit, focus }) {
  return /* @__PURE__ */ React4.createElement(Box4, { flexDirection: "column", paddingLeft: 1, paddingRight: 1 }, /* @__PURE__ */ React4.createElement(Text4, { bold: true, color: THEME.primary }, "\u2795 Create New Note"), /* @__PURE__ */ React4.createElement(Text4, { color: THEME.muted }, "Title:"), /* @__PURE__ */ React4.createElement(Box4, null, /* @__PURE__ */ React4.createElement(TextInput, { value, onChange, onSubmit, focus, placeholder: "Enter title..." })), /* @__PURE__ */ React4.createElement(Text4, { color: THEME.muted }, `Content: (empty on create \u2014 save then press e to edit)`), /* @__PURE__ */ React4.createElement(Box4, { marginTop: 1 }, /* @__PURE__ */ React4.createElement(Text4, { color: THEME.muted, italic: true }, "Write content later with the e editor.")), /* @__PURE__ */ React4.createElement(Box4, { marginTop: 1 }, /* @__PURE__ */ React4.createElement(Text4, { color: THEME.muted }, "[Enter] Save Note  \u2022  [Esc] Cancel")));
}

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/ui/EditorPane.jsx
import React5, { useRef } from "react";
import { Box as Box5 } from "ink";
import { TextArea, LineNumberPrefix } from "react-ink-textarea";
function EditorPane({ value, onChange, focus, width, height }) {
  const ref = useRef(null);
  const innerWidth = Math.max(width - 2, 1);
  const innerHeight = Math.max(height - 2, 1);
  return /* @__PURE__ */ React5.createElement(Box5, { width: innerWidth, height: innerHeight, flexDirection: "column" }, /* @__PURE__ */ React5.createElement(
    TextArea,
    {
      ref,
      focus,
      value,
      onChange,
      onSubmit: () => ref.current?.insert("\n"),
      placeholder: "Write your note content here...",
      linePrefix: LineNumberPrefix,
      highlightActiveLine: true,
      viewportLines: innerHeight,
      styles: { text: { color: THEME.fgLight } }
    }
  ));
}

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/ui/SearchBox.jsx
import React6 from "react";
import { Box as Box6, Text as Text5 } from "ink";
import TextInput2 from "ink-text-input";
function SearchBox({ value, onChange, onEnter, focus }) {
  return /* @__PURE__ */ React6.createElement(Box6, { flexDirection: "column" }, /* @__PURE__ */ React6.createElement(Box6, null, /* @__PURE__ */ React6.createElement(Text5, { bold: true, color: THEME.secondary }, "\u{1F50D} Search: "), /* @__PURE__ */ React6.createElement(
    TextInput2,
    {
      value,
      onChange,
      onSubmit: onEnter,
      focus,
      placeholder: "Type to search notes..."
    }
  )), /* @__PURE__ */ React6.createElement(Text5, { color: THEME.muted, italic: true }, "[Enter] apply filter  \u2022  [Esc] clear search"));
}

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/ui/DeleteView.jsx
import React7 from "react";
import { Box as Box7, Text as Text6 } from "ink";
function DeleteView({ note }) {
  return /* @__PURE__ */ React7.createElement(Box7, { flexDirection: "column", paddingLeft: 1, paddingRight: 1 }, /* @__PURE__ */ React7.createElement(Text6, { bold: true, color: THEME.warning }, "\u26A0\uFE0F Confirm Deletion"), /* @__PURE__ */ React7.createElement(Text6, { color: THEME.fgLight }, " Are you sure you want to delete the note?"), /* @__PURE__ */ React7.createElement(Text6, { color: THEME.muted }, `  \u{1F4C4} ${note.title}  (${note.filename})`), /* @__PURE__ */ React7.createElement(Box7, { marginTop: 1 }, /* @__PURE__ */ React7.createElement(Text6, { color: THEME.success, bold: true }, "[y] Yes, Delete"), /* @__PURE__ */ React7.createElement(Text6, { color: THEME.muted }, "   [n/Esc] Cancel")));
}

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/ui/RenameForm.jsx
import React8 from "react";
import { Box as Box8, Text as Text7 } from "ink";
import TextInput3 from "ink-text-input";
function RenameForm({ value, onChange, onSubmit, focus }) {
  return /* @__PURE__ */ React8.createElement(Box8, { flexDirection: "column", paddingLeft: 1, paddingRight: 1 }, /* @__PURE__ */ React8.createElement(Text7, { bold: true, color: THEME.primary }, "\u270F\uFE0F Rename Note"), /* @__PURE__ */ React8.createElement(Text7, { color: THEME.muted }, "New name:"), /* @__PURE__ */ React8.createElement(Box8, null, /* @__PURE__ */ React8.createElement(TextInput3, { value, onChange, onSubmit, focus, placeholder: "Enter new name..." })), /* @__PURE__ */ React8.createElement(Box8, { marginTop: 1 }, /* @__PURE__ */ React8.createElement(Text7, { color: THEME.muted }, "[Enter] Save  \u2022  [Esc] Cancel")));
}

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/ui/StatusBar.jsx
import React9 from "react";
import { Box as Box9, Text as Text8 } from "ink";
function key(label) {
  return /* @__PURE__ */ React9.createElement(Text8, { bold: true, color: THEME.statusKey }, label);
}
function helpFor(mode) {
  switch (mode) {
    case "view":
      return /* @__PURE__ */ React9.createElement(Text8, null, key("j/k"), " Scroll  \u2022  ", key("Esc"), " Back  \u2022  ", key("e"), " Edit  \u2022  ", key("q"), " Quit");
    case "create":
    case "edit":
      return /* @__PURE__ */ React9.createElement(Text8, null, key("Ctrl+S / Enter"), " Save Note  \u2022  ", key("Esc"), " Cancel");
    case "delete":
      return /* @__PURE__ */ React9.createElement(Text8, null, key("y"), " Confirm Delete  \u2022  ", key("n / Esc"), " Cancel");
    case "search":
      return /* @__PURE__ */ React9.createElement(Text8, null, key("Type"), " Filter  \u2022  ", key("Esc"), " Clear Search");
    default:
      return /* @__PURE__ */ React9.createElement(Text8, null, key("j/k"), " List  \u2022  ", key("Enter"), " View  \u2022  ", key("n"), " New  \u2022  ", key("e"), " Edit  \u2022  ", key("Shift+R"), " Rename  \u2022  ", key("d"), " Delete  \u2022  ", key("/"), " Search  \u2022  ", key("r"), " Refresh  \u2022  ", key("q"), " Quit");
  }
}
function StatusBar({ mode, statusMsg, statusErr }) {
  return /* @__PURE__ */ React9.createElement(Box9, { marginTop: 1, justifyContent: "space-between", width: "100%" }, helpFor(mode), statusMsg ? /* @__PURE__ */ React9.createElement(
    Text8,
    {
      bold: true,
      backgroundColor: statusErr ? THEME.danger : THEME.success,
      color: statusErr ? THEME.bgDark : THEME.bgDark
    },
    ` ${statusMsg} `
  ) : null);
}

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/storage.js
import fs from "node:fs";
import path from "node:path";
var fsp = fs.promises;
var SUPPORTED_EXTENSIONS = [".md", ".txt", ".markdown"];
function ensureExtension(name) {
  name = String(name).trim();
  const ext = path.extname(name);
  if (!ext) {
    return `${name}.md`;
  }
  return name;
}
function cleanFilename(title) {
  let name = String(title).trim();
  if (!name) {
    name = "untitled";
  }
  name = name.replace(/[ /\\:*?"<>|]/g, "-").replace(/-+/g, "-");
  return ensureExtension(name);
}
function extractTitle(filename, content) {
  const lines = String(content).split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.startsWith("#")) {
      const heading = trimmed.replace(/^#+/, "").trim();
      if (heading) {
        return heading;
      }
    }
  }
  const base = path.basename(filename);
  const ext = path.extname(base);
  const title = base.slice(0, base.length - ext.length);
  return title.replaceAll("-", " ");
}
function calculateStats(content) {
  const text = String(content);
  if (!text.trim()) {
    return { words: 0, lines: 0 };
  }
  const words = text.split(/\s+/).filter(Boolean).length;
  const lines = text.split("\n").length;
  return { words, lines };
}
function filterNotes(notes, query) {
  const q = String(query ?? "").trim().toLowerCase();
  if (!q) {
    return notes;
  }
  return notes.filter((note) => {
    return note.title.toLowerCase().includes(q) || note.filename.toLowerCase().includes(q) || note.content.toLowerCase().includes(q);
  });
}
var Storage = class {
  constructor(dir, { createDir = true } = {}) {
    this.dir = dir || "notes";
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
        content = await fsp.readFile(fullPath, "utf8");
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
        lineCount: lines
      });
    }
    notes.sort((a, b) => b.modTime.getTime() - a.modTime.getTime());
    return notes;
  }
  async saveNote(filename, content) {
    const safeName = ensureExtension(filename);
    const fullPath = path.join(this.dir, safeName);
    await fsp.writeFile(fullPath, content, "utf8");
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
      lineCount: lines
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
      for (; ; ) {
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
    }
    return this.saveNote(name, content);
  }
  async deleteNote(filename) {
    const fullPath = path.join(this.dir, filename);
    try {
      await fsp.unlink(fullPath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw new Error(`failed to delete note: ${err.message}`);
      }
    }
  }
  async renameNote(oldFilename, newFilename) {
    const newName = ensureExtension(newFilename);
    await fsp.rename(
      path.join(this.dir, oldFilename),
      path.join(this.dir, newName)
    );
  }
};

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/app.jsx
var STATUS_TIMEOUT_MS = 5e3;
function App({ store: store2, appName: appName2 = "note-tui" }) {
  const { exit } = useApp();
  const { columns: width, rows: height } = useWindowSize();
  const [mode, setMode] = useState("list");
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [createTitle, setCreateTitle] = useState("");
  const [editFilename, setEditFilename] = useState("");
  const [editContent, setEditContent] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState({ msg: "", isErr: false });
  const setStatusMessage = useCallback((msg, isErr = false) => {
    setStatus({ msg, isErr });
  }, []);
  useEffect(() => {
    if (!status.msg) {
      return void 0;
    }
    const timer = setTimeout(() => setStatus({ msg: "", isErr: false }), STATUS_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [status]);
  const searchQueryRef = React10.useRef("");
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
        const allNotes = await store2.listNotes();
        applyFilter(allNotes, searchQueryRef.current);
        if (successMsg) {
          setStatusMessage(successMsg);
        }
      } catch (err) {
        setStatusMessage(`Error reading notes: ${err.message}`, true);
      }
    },
    [store2, applyFilter, setStatusMessage]
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
    [filteredNotes.length]
  );
  const scrollBy = useCallback((delta) => {
    setScrollOffset((prev) => Math.max(0, prev + delta));
  }, []);
  const openView = useCallback(() => {
    if (filteredNotes.length > 0) {
      setScrollOffset(0);
      setMode("view");
    }
  }, [filteredNotes.length]);
  const startCreate = useCallback(() => {
    setCreateTitle("");
    setMode("create");
  }, []);
  const startEdit = useCallback(() => {
    const note = filteredNotes[selectedIndex];
    if (note) {
      setEditFilename(note.filename);
      setEditContent(note.content);
      setScrollOffset(0);
      setMode("edit");
    }
  }, [filteredNotes, selectedIndex]);
  const startSearch = useCallback(() => {
    setSearchQuery("");
    setMode("search");
  }, []);
  const startRename = useCallback(() => {
    const note = filteredNotes[selectedIndex];
    if (note) {
      const base = note.filename.replace(/\.[^.]+$/, "");
      setRenameValue(base);
      setMode("rename");
    }
  }, [filteredNotes, selectedIndex]);
  const submitRename = useCallback(async () => {
    const note = filteredNotes[selectedIndex];
    if (!note || !renameValue.trim()) {
      setMode("list");
      return;
    }
    const newName = renameValue.trim().replace(/[ /\\:*?"<>|]/g, "-");
    if (newName === note.filename.replace(/\.[^.]+$/, "")) {
      setMode("list");
      return;
    }
    try {
      await store2.renameNote(note.filename, newName);
      setStatusMessage(`Renamed to ${newName}`);
      setMode("list");
      await reload();
    } catch (err) {
      setStatusMessage(`Failed to rename: ${err.message}`, true);
    }
  }, [filteredNotes, selectedIndex, renameValue, store2, reload, setStatusMessage]);
  const handleSearchChange = useCallback(
    (query) => {
      setSearchQuery(query);
      applyFilter(notes, query);
    },
    [notes, applyFilter]
  );
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setFilteredNotes(notes);
    setMode("list");
  }, [notes]);
  const submitCreate = useCallback(async () => {
    const title = createTitle.trim() || "Untitled Note";
    try {
      const note = await store2.createNote(title, "");
      setStatusMessage(`Created note: ${note.filename}`);
      const allNotes = await store2.listNotes();
      applyFilter(allNotes, searchQueryRef.current);
      const idx = allNotes.findIndex((n) => n.filename === note.filename);
      setSelectedIndex(idx === -1 ? 0 : idx);
      setScrollOffset(0);
      setMode("list");
    } catch (err) {
      setStatusMessage(`Failed to create note: ${err.message}`, true);
    }
  }, [createTitle, store2, applyFilter, setStatusMessage]);
  const saveEdit = useCallback(async () => {
    try {
      await store2.saveNote(editFilename, editContent);
      setStatusMessage(`Saved ${editFilename}`);
      setMode("list");
      await reload();
    } catch (err) {
      setStatusMessage(`Failed to save note: ${err.message}`, true);
    }
  }, [editFilename, editContent, store2, reload, setStatusMessage]);
  const confirmDelete = useCallback(async () => {
    const target = filteredNotes[selectedIndex];
    if (!target) {
      setMode("list");
      return;
    }
    try {
      await store2.deleteNote(target.filename);
      setStatusMessage(`Deleted ${target.filename}`);
      setMode("list");
      await reload();
    } catch (err) {
      setStatusMessage(`Failed to delete note: ${err.message}`, true);
    }
  }, [filteredNotes, selectedIndex, store2, reload, setStatusMessage]);
  useInput(
    (input, key2) => {
      switch (mode) {
        case "list":
          if (input === "q" || key2.ctrl && input === "c") {
            exit();
          } else if (input === "j" || key2.downArrow) {
            navList(1);
          } else if (input === "k" || key2.upArrow) {
            navList(-1);
          } else if (key2.return || input === "v" || input === "l" || key2.rightArrow) {
            openView();
          } else if (input === "n") {
            startCreate();
          } else if (input === "e") {
            startEdit();
          } else if (input === "d") {
            setMode("delete");
          } else if (input === "/") {
            startSearch();
          } else if (input === "R") {
            startRename();
          } else if (input === "r") {
            reload("Notes refreshed");
          }
          break;
        case "view":
          if (input === "q" || key2.ctrl && input === "c") {
            exit();
          } else if (key2.escape || input === "h" || key2.leftArrow) {
            setMode("list");
          } else if (input === "e") {
            startEdit();
          } else if (input === "j" || key2.downArrow) {
            scrollBy(1);
          } else if (input === "k" || key2.upArrow) {
            scrollBy(-1);
          } else if (key2.pageDown) {
            scrollBy(layoutHeight);
          } else if (key2.pageUp) {
            scrollBy(-layoutHeight);
          } else if (key2.home) {
            setScrollOffset(0);
          } else if (key2.end) {
            setScrollOffset(Number.MAX_SAFE_INTEGER);
          }
          break;
        case "create":
          if (key2.escape) {
            setMode("list");
          }
          break;
        case "edit":
          if (key2.ctrl && input === "s") {
            saveEdit();
          } else if (key2.escape) {
            setMode("list");
          }
          break;
        case "delete":
          if (input === "y" || key2.return) {
            confirmDelete();
          } else if (input === "n" || key2.escape) {
            setMode("list");
          }
          break;
        case "search":
          if (key2.escape) {
            clearSearch();
          } else if (key2.return) {
            setMode("list");
          }
          break;
        case "rename":
          if (key2.escape) {
            setMode("list");
          } else if (key2.return) {
            submitRename();
          }
          break;
        default:
          break;
      }
    },
    { isActive: true }
  );
  const selectedNote = filteredNotes[selectedIndex];
  const renderRightPane = () => {
    switch (mode) {
      case "create":
        return /* @__PURE__ */ React10.createElement(
          CreateForm,
          {
            value: createTitle,
            onChange: setCreateTitle,
            onSubmit: submitCreate,
            focus: true
          }
        );
      case "edit":
        return /* @__PURE__ */ React10.createElement(
          Box10,
          {
            width: contentWidth,
            flexDirection: "column",
            borderStyle: "round",
            borderColor: THEME.mainBorder,
            paddingLeft: 1,
            paddingRight: 1
          },
          /* @__PURE__ */ React10.createElement(Text9, { bold: true, color: THEME.primary }, `\u270F\uFE0F Editing: ${editFilename}`),
          /* @__PURE__ */ React10.createElement(Box10, { flexDirection: "column", height: Math.max(layoutHeight - 8, 1) }, /* @__PURE__ */ React10.createElement(
            EditorPane,
            {
              value: editContent,
              onChange: setEditContent,
              focus: true,
              width: contentWidth - 2,
              height: Math.max(layoutHeight - 8, 1)
            }
          )),
          /* @__PURE__ */ React10.createElement(Text9, { color: THEME.muted }, "[Ctrl+S] Save Note  \u2022  [Esc] Cancel")
        );
      case "search":
        return /* @__PURE__ */ React10.createElement(Box10, { flexDirection: "column", width: contentWidth }, /* @__PURE__ */ React10.createElement(
          SearchBox,
          {
            value: searchQuery,
            onChange: handleSearchChange,
            onEnter: () => setMode("list"),
            focus: true
          }
        ), selectedNote ? /* @__PURE__ */ React10.createElement(
          NoteView,
          {
            note: selectedNote,
            width: contentWidth,
            height: Math.max(layoutHeight - 3, 1),
            scroll: scrollOffset,
            active: false
          }
        ) : /* @__PURE__ */ React10.createElement(Text9, { color: THEME.muted }, "No matching notes."));
      case "delete":
        return selectedNote ? /* @__PURE__ */ React10.createElement(DeleteView, { note: selectedNote }) : null;
      case "rename":
        return /* @__PURE__ */ React10.createElement(
          RenameForm,
          {
            value: renameValue,
            onChange: setRenameValue,
            onSubmit: submitRename,
            focus: true
          }
        );
      default:
        return selectedNote ? /* @__PURE__ */ React10.createElement(
          NoteView,
          {
            note: selectedNote,
            width: contentWidth,
            height: layoutHeight,
            scroll: scrollOffset,
            active: mode === "view"
          }
        ) : /* @__PURE__ */ React10.createElement(Text9, { color: THEME.muted }, "No notes. Press n to create one.");
    }
  };
  if (!height) {
    return /* @__PURE__ */ React10.createElement(Text9, null, "Initializing note-tui...");
  }
  return /* @__PURE__ */ React10.createElement(Box10, { flexDirection: "column" }, /* @__PURE__ */ React10.createElement(HeaderBar, { dir: store2.dir, count: filteredNotes.length, appName: appName2 }), /* @__PURE__ */ React10.createElement(Box10, { flexDirection: "row" }, /* @__PURE__ */ React10.createElement(
    Sidebar,
    {
      notes: filteredNotes,
      selectedIndex,
      width: sidebarWidth,
      height: layoutHeight,
      active: mode === "list"
    }
  ), /* @__PURE__ */ React10.createElement(Box10, { marginLeft: 1, flexDirection: "column" }, renderRightPane())), /* @__PURE__ */ React10.createElement(StatusBar, { mode, statusMsg: status.msg, statusErr: status.isErr }));
}

// Desktop/Me/note-tui - โน้ตง่ายๆ บันทึก text files/src/cli.jsx
var HELP = `note-tui v2.0.0 - \u0E42\u0E19\u0E49\u0E15\u0E07\u0E48\u0E32\u0E22\u0E46 \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01 text files

Simple text-file note taking in your terminal.

Usage:
  note-tui [options]

Options:
  --dir <path>   Directory to store note text files (default: notes)
  --name <name>  Custom app name displayed in header (default: note-tui)
  -v, --version  Show version and exit
  -h, --help     Show this help and exit
`;
var parsed;
try {
  parsed = parseArgs({
    args: process.argv.slice(2),
    options: {
      dir: { type: "string" },
      name: { type: "string" },
      v: { type: "boolean", short: "v" },
      version: { type: "boolean" },
      h: { type: "boolean", short: "h" },
      help: { type: "boolean" }
    },
    strict: true
  });
} catch (err) {
  console.error(`Invalid arguments: ${err.message}
`);
  console.error(HELP);
  process.exit(1);
}
var { values } = parsed;
if (values.h || values.help) {
  console.log(HELP);
  process.exit(0);
}
if (values.v || values.version) {
  console.log("note-tui v2.0.0 - \u0E42\u0E19\u0E49\u0E15\u0E07\u0E48\u0E32\u0E22\u0E46 \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01 text files");
  process.exit(0);
}
if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error("note-tui requires an interactive terminal.\n");
  console.error(HELP);
  process.exit(1);
}
var store = await new Storage(values.dir).init();
var appName = values.name || "war";
render(/* @__PURE__ */ React11.createElement(App, { store, appName }), { exitOnCtrlC: false });
