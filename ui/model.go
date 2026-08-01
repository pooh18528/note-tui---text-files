package ui

import (
	"fmt"
	"strings"
	"time"

	"note-tui/storage"

	"github.com/charmbracelet/bubbles/key"
	"github.com/charmbracelet/bubbles/textarea"
	"github.com/charmbracelet/bubbles/textinput"
	"github.com/charmbracelet/bubbles/viewport"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type AppMode int

const (
	ModeList AppMode = iota
	ModeView
	ModeCreate
	ModeEdit
	ModeDeleteConfirm
	ModeSearch
)

// KeyMap defines keyboard shortcuts.
type KeyMap struct {
	New    key.Binding
	Edit   key.Binding
	Delete key.Binding
	Search key.Binding
	Save   key.Binding
	Cancel key.Binding
	Back   key.Binding
	Quit   key.Binding
}

var Keys = KeyMap{
	New:    key.NewBinding(key.WithKeys("n"), key.WithHelp("n", "new note")),
	Edit:   key.NewBinding(key.WithKeys("e"), key.WithHelp("e", "edit note")),
	Delete: key.NewBinding(key.WithKeys("d"), key.WithHelp("d", "delete note")),
	Search: key.NewBinding(key.WithKeys("/"), key.WithHelp("/", "search")),
	Save:   key.NewBinding(key.WithKeys("ctrl+s"), key.WithHelp("ctrl+s", "save")),
	Cancel: key.NewBinding(key.WithKeys("esc"), key.WithHelp("esc", "cancel")),
	Back:   key.NewBinding(key.WithKeys("esc"), key.WithHelp("esc", "back to list")),
	Quit:   key.NewBinding(key.WithKeys("q", "ctrl+c"), key.WithHelp("q", "quit")),
}

// Model represents the overall state of the note-tui application.
type Model struct {
	Store         *storage.Storage
	Notes         []storage.Note
	FilteredNotes []storage.Note
	SelectedIndex int

	Mode         AppMode
	PreviousMode AppMode

	// UI Bubbles Components
	Viewport  viewport.Model
	Textarea  textarea.Model
	TextInput textinput.Model // used for new title or search query

	// Screen dimensions
	Width  int
	Height int

	// New Note Form state
	NewTitle string

	// Status & Toast messages
	StatusMsg   string
	StatusIsErr bool
	StatusTime  time.Time
}

// InitialModel initializes the Bubble Tea model.
func InitialModel(store *storage.Storage) Model {
	ta := textarea.New()
	ta.Placeholder = "Write your note content here..."
	ta.Focus()
	ta.ShowLineNumbers = true
	ta.SetWidth(80)
	ta.SetHeight(20)

	ti := textinput.New()
	ti.Placeholder = "Enter title..."
	ti.CharLimit = 100

	vp := viewport.New(80, 20)

	m := Model{
		Store:         store,
		Mode:          ModeList,
		Viewport:      vp,
		Textarea:      ta,
		TextInput:     ti,
		SelectedIndex: 0,
	}

	m.ReloadNotes()
	return m
}

func (m *Model) ReloadNotes() {
	notes, err := m.Store.ListNotes()
	if err != nil {
		m.SetStatus("Error reading notes: "+err.Error(), true)
		return
	}
	m.Notes = notes
	m.FilteredNotes = notes
	if m.SelectedIndex >= len(m.FilteredNotes) {
		m.SelectedIndex = len(m.FilteredNotes) - 1
	}
	if m.SelectedIndex < 0 {
		m.SelectedIndex = 0
	}
	m.UpdateViewportContent()
}

func (m *Model) SetStatus(msg string, isErr bool) {
	m.StatusMsg = msg
	m.StatusIsErr = isErr
	m.StatusTime = time.Now()
}

func (m *Model) UpdateViewportContent() {
	if len(m.FilteredNotes) == 0 {
		m.Viewport.SetContent(lipgloss.NewStyle().Foreground(ColorMuted).Render("\n  No notes found. Press 'n' to create a new note."))
		return
	}
	if m.SelectedIndex >= 0 && m.SelectedIndex < len(m.FilteredNotes) {
		n := m.FilteredNotes[m.SelectedIndex]
		header := lipgloss.NewStyle().
			Bold(true).
			Foreground(ColorSecondary).
			Render("# " + n.Title)

		meta := lipgloss.NewStyle().
			Foreground(ColorMuted).
			Render(fmt.Sprintf("📄 %s  •  📅 %s  •  📝 %d words  •  📏 %d lines",
				n.Filename,
				n.ModTime.Format("2006-01-02 15:04"),
				n.WordCount,
				n.LineCount,
			))

		divider := lipgloss.NewStyle().Foreground(ColorBorder).Render(strings.Repeat("─", m.Viewport.Width))

		body := n.Content
		if strings.TrimSpace(body) == "" {
			body = lipgloss.NewStyle().Foreground(ColorMuted).Italic(true).Render("(Empty Note)")
		}

		fullView := fmt.Sprintf("%s\n%s\n%s\n\n%s", header, meta, divider, body)
		m.Viewport.SetContent(fullView)
	}
}

func (m Model) Init() tea.Cmd {
	return textarea.Blink
}

func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmds []tea.Cmd

	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.Width = msg.Width
		m.Height = msg.Height
		m.ResizeComponents()

	case tea.KeyMsg:
		// Clear old status message after 5s
		if time.Since(m.StatusTime) > 5*time.Second {
			m.StatusMsg = ""
		}

		switch m.Mode {
		case ModeList:
			switch msg.String() {
			case "q", "ctrl+c":
				return m, tea.Quit
			case "j", "down":
				if m.SelectedIndex < len(m.FilteredNotes)-1 {
					m.SelectedIndex++
					m.UpdateViewportContent()
				}
			case "k", "up":
				if m.SelectedIndex > 0 {
					m.SelectedIndex--
					m.UpdateViewportContent()
				}
			case "enter", "v", "l", "right":
				if len(m.FilteredNotes) > 0 {
					m.Mode = ModeView
				}
			case "n":
				m.Mode = ModeCreate
				m.TextInput.Reset()
				m.TextInput.Placeholder = "Note Title (e.g. Shopping List)"
				m.TextInput.Focus()
				m.Textarea.Reset()
				m.NewTitle = ""
				return m, textinput.Blink
			case "e":
				if len(m.FilteredNotes) > 0 {
					n := m.FilteredNotes[m.SelectedIndex]
					m.Mode = ModeEdit
					m.Textarea.SetValue(n.Content)
					m.Textarea.Focus()
					return m, textarea.Blink
				}
			case "d":
				if len(m.FilteredNotes) > 0 {
					m.Mode = ModeDeleteConfirm
				}
			case "/":
				m.Mode = ModeSearch
				m.TextInput.Reset()
				m.TextInput.Placeholder = "Type to search notes..."
				m.TextInput.Focus()
				return m, textinput.Blink
			case "r":
				m.ReloadNotes()
				m.SetStatus("Notes refreshed", false)
			}

		case ModeView:
			switch msg.String() {
			case "q", "ctrl+c":
				return m, tea.Quit
			case "esc", "h", "left":
				m.Mode = ModeList
			case "e":
				if len(m.FilteredNotes) > 0 {
					n := m.FilteredNotes[m.SelectedIndex]
					m.Mode = ModeEdit
					m.Textarea.SetValue(n.Content)
					m.Textarea.Focus()
					return m, textarea.Blink
				}
			default:
				// Forward scrolling keys to viewport
				var cmd tea.Cmd
				m.Viewport, cmd = m.Viewport.Update(msg)
				cmds = append(cmds, cmd)
			}

		case ModeCreate:
			switch msg.String() {
			case "esc":
				m.Mode = ModeList
			case "enter":
				title := strings.TrimSpace(m.TextInput.Value())
				if title == "" {
					title = "Untitled Note"
				}
				note, err := m.Store.CreateNote(title, m.Textarea.Value())
				if err != nil {
					m.SetStatus("Failed to create note: "+err.Error(), true)
				} else {
					m.SetStatus("Created note: "+note.Filename, false)
					m.ReloadNotes()
					// Select created note
					for i, n := range m.FilteredNotes {
						if n.Filename == note.Filename {
							m.SelectedIndex = i
							break
						}
					}
					m.UpdateViewportContent()
				}
				m.Mode = ModeList
			default:
				var cmd tea.Cmd
				if m.TextInput.Focused() {
					m.TextInput, cmd = m.TextInput.Update(msg)
				} else {
					m.Textarea, cmd = m.Textarea.Update(msg)
				}
				cmds = append(cmds, cmd)
			}

		case ModeEdit:
			switch msg.String() {
			case "ctrl+s":
				if len(m.FilteredNotes) > 0 {
					current := m.FilteredNotes[m.SelectedIndex]
					note, err := m.Store.SaveNote(current.Filename, m.Textarea.Value())
					if err != nil {
						m.SetStatus("Failed to save note: "+err.Error(), true)
					} else {
						m.SetStatus("Saved "+note.Filename, false)
						m.ReloadNotes()
					}
				}
				m.Mode = ModeList
			case "esc":
				m.Mode = ModeList
			default:
				var cmd tea.Cmd
				m.Textarea, cmd = m.Textarea.Update(msg)
				cmds = append(cmds, cmd)
			}

		case ModeDeleteConfirm:
			switch strings.ToLower(msg.String()) {
			case "y", "enter":
				if len(m.FilteredNotes) > 0 {
					target := m.FilteredNotes[m.SelectedIndex]
					err := m.Store.DeleteNote(target.Filename)
					if err != nil {
						m.SetStatus("Failed to delete: "+err.Error(), true)
					} else {
						m.SetStatus("Deleted "+target.Filename, false)
						m.ReloadNotes()
					}
				}
				m.Mode = ModeList
			case "n", "esc":
				m.Mode = ModeList
			}

		case ModeSearch:
			switch msg.String() {
			case "esc":
				m.FilteredNotes = m.Notes
				m.Mode = ModeList
				m.UpdateViewportContent()
			case "enter":
				m.Mode = ModeList
			default:
				var cmd tea.Cmd
				m.TextInput, cmd = m.TextInput.Update(msg)
				cmds = append(cmds, cmd)

				query := m.TextInput.Value()
				m.FilteredNotes = storage.FilterNotes(m.Notes, query)
				m.SelectedIndex = 0
				m.UpdateViewportContent()
			}
		}
	}

	return m, tea.Batch(cmds...)
}

func (m *Model) ResizeComponents() {
	headerHeight := 2
	footerHeight := 2
	mainHeight := m.Height - headerHeight - footerHeight - 3

	if mainHeight < 5 {
		mainHeight = 5
	}

	sidebarWidth := m.Width / 3
	if sidebarWidth < 25 {
		sidebarWidth = 25
	}
	contentWidth := m.Width - sidebarWidth - 6
	if contentWidth < 20 {
		contentWidth = 20
	}

	m.Viewport.Width = contentWidth
	m.Viewport.Height = mainHeight

	m.Textarea.SetWidth(contentWidth)
	m.Textarea.SetHeight(mainHeight - 3)
}

func (m Model) View() string {
	if m.Width == 0 || m.Height == 0 {
		return "Initializing note-tui..."
	}

	// 1. Header Bar
	headerTitle := StyleAppHeader.Render(" 📝 note-tui ")
	storageBadge := StyleHeaderTag.Render(fmt.Sprintf("📁 %s", m.Store.Dir))
	statsBadge := lipgloss.NewStyle().
		Foreground(ColorMuted).
		Render(fmt.Sprintf(" (%d notes)", len(m.FilteredNotes)))
	headerBar := lipgloss.JoinHorizontal(lipgloss.Center, headerTitle, storageBadge, statsBadge)

	// 2. Main Content Area (Dual Pane: Sidebar + Viewport/Editor)
	headerHeight := 2
	footerHeight := 2
	mainHeight := m.Height - headerHeight - footerHeight - 3
	if mainHeight < 5 {
		mainHeight = 5
	}

	sidebarWidth := m.Width / 3
	if sidebarWidth < 25 {
		sidebarWidth = 25
	}
	contentWidth := m.Width - sidebarWidth - 6
	if contentWidth < 20 {
		contentWidth = 20
	}

	// Render Left Sidebar (Notes List)
	var listItems []string
	if len(m.FilteredNotes) == 0 {
		listItems = append(listItems, StyleNoteItemMeta.Render("No notes"))
	} else {
		for i, n := range m.FilteredNotes {
			isSelected := i == m.SelectedIndex

			// Format title truncation
			title := n.Title
			maxLen := sidebarWidth - 6
			if maxLen > 0 && len(title) > maxLen {
				title = title[:maxLen-2] + ".."
			}

			dateStr := n.ModTime.Format("01/02 15:04")
			line := fmt.Sprintf("%-16s %s", title, dateStr)

			if isSelected {
				listItems = append(listItems, StyleNoteItemActive.Width(sidebarWidth-4).Render("▶ "+line))
			} else {
				listItems = append(listItems, StyleNoteItem.Width(sidebarWidth-4).Render("  "+line))
			}
		}
	}

	listContent := strings.Join(listItems, "\n")
	sidebarStyle := StyleSidebar
	if m.Mode == ModeList {
		sidebarStyle = StyleSidebarActive
	}
	sidebarView := sidebarStyle.
		Width(sidebarWidth).
		Height(mainHeight).
		Render("📋 NOTES LIST\n" + strings.Repeat("─", sidebarWidth-2) + "\n" + listContent)

	// Render Right Content Pane
	mainPaneStyle := StyleMainPanel
	if m.Mode == ModeView {
		mainPaneStyle = StyleMainPanelActive
	}

	var rightView string
	switch m.Mode {
	case ModeCreate:
		formTitle := StyleDialogTitle.Render("➕ Create New Note")
		rightView = fmt.Sprintf("%s\nTitle:\n%s\n\nContent:\n%s\n\n%s",
			formTitle,
			m.TextInput.View(),
			m.Textarea.View(),
			StyleStatusDesc.Render("[Enter] Save Note  •  [Esc] Cancel"),
		)
	case ModeEdit:
		formTitle := StyleDialogTitle.Render("✏️ Editing: " + m.FilteredNotes[m.SelectedIndex].Filename)
		rightView = fmt.Sprintf("%s\n%s\n\n%s",
			formTitle,
			m.Textarea.View(),
			StyleStatusDesc.Render("[Ctrl+S] Save Note  •  [Esc] Cancel"),
		)
	case ModeSearch:
		searchHeader := StyleSearchPrompt.Render("🔍 Search: ") + m.TextInput.View()
		rightView = searchHeader + "\n\n" + m.Viewport.View()
	default:
		rightView = m.Viewport.View()
	}

	rightPaneView := mainPaneStyle.
		Width(contentWidth).
		Height(mainHeight).
		Render(rightView)

	mainBody := lipgloss.JoinHorizontal(lipgloss.Top, sidebarView, rightPaneView)

	// 3. Status / Keymap Bar
	var helpStr string
	switch m.Mode {
	case ModeList:
		helpStr = fmt.Sprintf("%s List  •  %s View  •  %s New  •  %s Edit  •  %s Delete  •  %s Search  •  %s Quit",
			StyleStatusKey.Render("j/k"),
			StyleStatusKey.Render("Enter"),
			StyleStatusKey.Render("n"),
			StyleStatusKey.Render("e"),
			StyleStatusKey.Render("d"),
			StyleStatusKey.Render("/"),
			StyleStatusKey.Render("q"),
		)
	case ModeView:
		helpStr = fmt.Sprintf("%s Scroll  •  %s Back  •  %s Edit  •  %s Quit",
			StyleStatusKey.Render("j/k"),
			StyleStatusKey.Render("Esc"),
			StyleStatusKey.Render("e"),
			StyleStatusKey.Render("q"),
		)
	case ModeCreate, ModeEdit:
		helpStr = fmt.Sprintf("%s Save Note  •  %s Cancel",
			StyleStatusKey.Render("Ctrl+S / Enter"),
			StyleStatusKey.Render("Esc"),
		)
	case ModeDeleteConfirm:
		helpStr = fmt.Sprintf("%s Confirm Delete  •  %s Cancel",
			StyleStatusKey.Render("y"),
			StyleStatusKey.Render("n / Esc"),
		)
	case ModeSearch:
		helpStr = fmt.Sprintf("%s Filter  •  %s Clear Search",
			StyleStatusKey.Render("Type"),
			StyleStatusKey.Render("Esc"),
		)
	}

	// Status Toast message if any
	statusToast := ""
	if m.StatusMsg != "" {
		if m.StatusIsErr {
			statusToast = StyleBadgeDanger.Render(" " + m.StatusMsg + " ")
		} else {
			statusToast = StyleBadgeSuccess.Render(" " + m.StatusMsg + " ")
		}
	}

	statusBar := StyleStatusBar.Width(m.Width).Render(
		lipgloss.JoinHorizontal(lipgloss.Center, helpStr, "  ", statusToast),
	)

	// Overlay modal dialog for Delete confirmation if active
	if m.Mode == ModeDeleteConfirm && len(m.FilteredNotes) > 0 {
		target := m.FilteredNotes[m.SelectedIndex]
		dialogContent := fmt.Sprintf(
			" Are you sure you want to delete note?\n\n 📄 %s (%s)\n\n [y] Yes, Delete   [n/Esc] Cancel ",
			target.Title,
			target.Filename,
		)
		dialog := StyleDialogBox.Render(
			StyleDialogTitle.Render("⚠️ Confirm Deletion") + "\n" + dialogContent,
		)
		_ = dialog // render on top if needed
	}

	return lipgloss.JoinVertical(lipgloss.Left, headerBar, mainBody, statusBar)
}
