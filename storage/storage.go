package storage

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// Note represents a text file note.
type Note struct {
	Filename  string    `json:"filename"`  // e.g. "my-note.md"
	Path      string    `json:"path"`      // full path
	Title     string    `json:"title"`     // derived title
	Content   string    `json:"content"`   // file content
	ModTime   time.Time `json:"mod_time"`  // last modification time
	Size      int64     `json:"size"`      // file size in bytes
	WordCount int       `json:"word_count"`// word count
	LineCount int       `json:"line_count"`// line count
}

// Storage handles file persistence in a target directory.
type Storage struct {
	Dir string
}

// NewStorage creates or initializes a Storage instance.
func NewStorage(dir string) (*Storage, error) {
	if dir == "" {
		dir = "notes"
	}
	if err := os.MkdirAll(dir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create notes directory: %w", err)
	}
	return &Storage{Dir: dir}, nil
}

// EnsureExtension appends .md if no supported text extension is found.
func EnsureExtension(name string) string {
	name = strings.TrimSpace(name)
	ext := filepath.Ext(name)
	if ext == "" {
		return name + ".md"
	}
	return name
}

// CleanFilename sanitizes a string into a safe file name without spaces or invalid chars.
func CleanFilename(title string) string {
	title = strings.TrimSpace(title)
	if title == "" {
		title = "untitled"
	}
	replacer := strings.NewReplacer(
		" ", "-",
		"/", "-",
		"\\", "-",
		":", "-",
		"*", "-",
		"?", "-",
		"\"", "-",
		"<", "-",
		">", "-",
		"|", "-",
	)
	clean := replacer.Replace(title)
	for strings.Contains(clean, "--") {
		clean = strings.ReplaceAll(clean, "--", "-")
	}
	return EnsureExtension(clean)
}

// ExtractTitle determines title from markdown heading (# Heading) or filename fallback.
func ExtractTitle(filename, content string) string {
	lines := strings.Split(content, "\n")
	for _, l := range lines {
		trimmed := strings.TrimSpace(l)
		if trimmed != "" {
			if strings.HasPrefix(trimmed, "#") {
				heading := strings.TrimLeft(trimmed, "#")
				heading = strings.TrimSpace(heading)
				if heading != "" {
					return heading
				}
			}
		}
	}
	base := filepath.Base(filename)
	ext := filepath.Ext(base)
	title := strings.TrimSuffix(base, ext)
	return strings.ReplaceAll(title, "-", " ")
}

// CalculateStats returns word and line counts for text content.
func CalculateStats(content string) (words int, lines int) {
	if strings.TrimSpace(content) == "" {
		return 0, 0
	}
	lineSlice := strings.Split(content, "\n")
	lines = len(lineSlice)
	words = len(strings.Fields(content))
	return words, lines
}

// ListNotes reads all text files (.md, .txt) in storage directory, sorted by ModTime (newest first).
func (s *Storage) ListNotes() ([]Note, error) {
	entries, err := os.ReadDir(s.Dir)
	if err != nil {
		return nil, fmt.Errorf("failed to list directory: %w", err)
	}

	var notes []Note
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		name := entry.Name()
		ext := strings.ToLower(filepath.Ext(name))
		if ext != ".md" && ext != ".txt" && ext != ".markdown" {
			continue
		}

		fullPath := filepath.Join(s.Dir, name)
		info, err := entry.Info()
		if err != nil {
			continue
		}

		data, err := os.ReadFile(fullPath)
		if err != nil {
			continue
		}

		content := string(data)
		words, lines := CalculateStats(content)
		title := ExtractTitle(name, content)

		notes = append(notes, Note{
			Filename:  name,
			Path:      fullPath,
			Title:     title,
			Content:   content,
			ModTime:   info.ModTime(),
			Size:      info.Size(),
			WordCount: words,
			LineCount: lines,
		})
	}

	// Sort notes by last modified time descending
	sort.Slice(notes, func(i, j int) bool {
		return notes[i].ModTime.After(notes[j].ModTime)
	})

	return notes, nil
}

// SaveNote saves content to the given filename.
func (s *Storage) SaveNote(filename, content string) (*Note, error) {
	filename = EnsureExtension(filename)
	fullPath := filepath.Join(s.Dir, filename)

	if err := os.WriteFile(fullPath, []byte(content), 0644); err != nil {
		return nil, fmt.Errorf("failed to write note: %w", err)
	}

	info, err := os.Stat(fullPath)
	if err != nil {
		return nil, fmt.Errorf("failed to stat written note: %w", err)
	}

	words, lines := CalculateStats(content)
	title := ExtractTitle(filename, content)

	return &Note{
		Filename:  filename,
		Path:      fullPath,
		Title:     title,
		Content:   content,
		ModTime:   info.ModTime(),
		Size:      info.Size(),
		WordCount: words,
		LineCount: lines,
	}, nil
}

// CreateNote creates a new note file with given filename/title and content.
func (s *Storage) CreateNote(filename, content string) (*Note, error) {
	filename = CleanFilename(filename)
	fullPath := filepath.Join(s.Dir, filename)

	// If file exists, find an available name (e.g. note-1.md)
	if _, err := os.Stat(fullPath); err == nil {
		ext := filepath.Ext(filename)
		base := strings.TrimSuffix(filename, ext)
		counter := 1
		for {
			candidate := fmt.Sprintf("%s-%d%s", base, counter, ext)
			if _, err := os.Stat(filepath.Join(s.Dir, candidate)); os.IsNotExist(err) {
				filename = candidate
				break
			}
			counter++
		}
	}

	return s.SaveNote(filename, content)
}

// DeleteNote deletes a note file by filename.
func (s *Storage) DeleteNote(filename string) error {
	fullPath := filepath.Join(s.Dir, filename)
	if err := os.Remove(fullPath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to delete note: %w", err)
	}
	return nil
}

// RenameNote renames a note file.
func (s *Storage) RenameNote(oldFilename, newFilename string) error {
	newFilename = EnsureExtension(newFilename)
	oldPath := filepath.Join(s.Dir, oldFilename)
	newPath := filepath.Join(s.Dir, newFilename)
	if err := os.Rename(oldPath, newPath); err != nil {
		return fmt.Errorf("failed to rename note: %w", err)
	}
	return nil
}

// SearchNotes returns notes matching query in title or content (case-insensitive).
func FilterNotes(notes []Note, query string) []Note {
	query = strings.ToLower(strings.TrimSpace(query))
	if query == "" {
		return notes
	}

	var filtered []Note
	for _, n := range notes {
		if strings.Contains(strings.ToLower(n.Title), query) ||
			strings.Contains(strings.ToLower(n.Filename), query) ||
			strings.Contains(strings.ToLower(n.Content), query) {
			filtered = append(filtered, n)
		}
	}
	return filtered
}
