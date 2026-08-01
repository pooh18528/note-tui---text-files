package main

import (
	"flag"
	"fmt"
	"os"

	"note-tui/storage"
	"note-tui/ui"

	tea "github.com/charmbracelet/bubbletea"
)

func main() {
	dirFlag := flag.String("dir", "notes", "Directory to store notes text files")
	versionFlag := flag.Bool("v", false, "Show version")
	flag.Parse()

	if *versionFlag {
		fmt.Println("note-tui v1.0.0 - โน้ตง่ายๆ บันทึก text files")
		os.Exit(0)
	}

	// Initialize storage
	store, err := storage.NewStorage(*dirFlag)
	if err != nil {
		fmt.Printf("Error initializing notes storage: %v\n", err)
		os.Exit(1)
	}

	p := tea.NewProgram(
		ui.InitialModel(store),
		tea.WithAltScreen(),
	)

	if _, err := p.Run(); err != nil {
		fmt.Printf("Error running note-tui: %v\n", err)
		os.Exit(1)
	}
}
