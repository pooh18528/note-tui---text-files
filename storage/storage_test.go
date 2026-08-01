package storage

import (
	"os"
	"testing"
)

func TestStorageOperations(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "note-tui-test-*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	store, err := NewStorage(tempDir)
	if err != nil {
		t.Fatalf("failed to init storage: %v", err)
	}

	// Test 1: Create Note
	note1, err := store.CreateNote("Meeting Notes", "# Team Sync\nDiscuss Q3 roadmap and feature priorities.")
	if err != nil {
		t.Fatalf("failed to create note: %v", err)
	}

	if note1.Filename != "Meeting-Notes.md" {
		t.Errorf("expected filename 'Meeting-Notes.md', got '%s'", note1.Filename)
	}

	if note1.Title != "Team Sync" {
		t.Errorf("expected title 'Team Sync', got '%s'", note1.Title)
	}

	if note1.WordCount != 9 {
		t.Errorf("expected 9 words, got %d", note1.WordCount)
	}

	// Test 2: Create Second Note
	_, err = store.CreateNote("Shopping List.txt", "1. Milk\n2. Coffee\n3. Bread")
	if err != nil {
		t.Fatalf("failed to create second note: %v", err)
	}

	// Test 3: List Notes
	notes, err := store.ListNotes()
	if err != nil {
		t.Fatalf("failed to list notes: %v", err)
	}

	if len(notes) != 2 {
		t.Fatalf("expected 2 notes, got %d", len(notes))
	}

	// Test 4: Save / Update Note
	updatedNote, err := store.SaveNote(note1.Filename, "# Team Sync\nUpdated content with more details.")
	if err != nil {
		t.Fatalf("failed to update note: %v", err)
	}

	if updatedNote.WordCount != 8 {
		t.Errorf("expected 8 words in updated note, got %d", updatedNote.WordCount)
	}

	// Test 5: Filter Notes
	filtered := FilterNotes(notes, "Shopping")
	if len(filtered) != 1 {
		t.Fatalf("expected 1 match for 'Shopping', got %d", len(filtered))
	}
	if filtered[0].Title != "Shopping List" {
		t.Errorf("expected title 'Shopping List', got '%s'", filtered[0].Title)
	}

	// Test 6: Delete Note
	err = store.DeleteNote(note1.Filename)
	if err != nil {
		t.Fatalf("failed to delete note: %v", err)
	}

	notesAfterDelete, _ := store.ListNotes()
	if len(notesAfterDelete) != 1 {
		t.Fatalf("expected 1 note after deletion, got %d", len(notesAfterDelete))
	}
}

func TestCleanFilename(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"my note", "my-note.md"},
		{"important/work:note*", "important-work-note-.md"},
		{"test.txt", "test.txt"},
		{"", "untitled.md"},
	}

	for _, tt := range tests {
		got := CleanFilename(tt.input)
		if got != tt.expected {
			t.Errorf("CleanFilename(%q) = %q; want %q", tt.input, got, tt.expected)
		}
	}
}
