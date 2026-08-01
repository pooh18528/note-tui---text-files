package ui

import "github.com/charmbracelet/lipgloss"

// Color Palette Definition
var (
	ColorPrimary   = lipgloss.Color("#7D56F4") // Deep Lavender Purple
	ColorSecondary = lipgloss.Color("#00E5FF") // Neon Cyan
	ColorAccent    = lipgloss.Color("#FF79C6") // Pink Accent
	ColorSuccess   = lipgloss.Color("#50FA7B") // Mint Green
	ColorWarning   = lipgloss.Color("#FFB86C") // Amber Orange
	ColorDanger    = lipgloss.Color("#FF5555") // Coral Red
	ColorMuted     = lipgloss.Color("#6272A4") // Muted Blue Gray
	ColorBgDark    = lipgloss.Color("#181824") // Deep Dark Background
	ColorBgCard    = lipgloss.Color("#212230") // Surface Card Background
	ColorFgLight   = lipgloss.Color("#F8F8F2") // Crisp White Text
	ColorBorder    = lipgloss.Color("#44475A") // Subtle Border
)

// UI Component Styles
var (
	// App Container
	StyleAppHeader = lipgloss.NewStyle().
			Bold(true).
			Foreground(ColorFgLight).
			Background(ColorPrimary).
			Padding(0, 1)

	StyleHeaderTag = lipgloss.NewStyle().
			Foreground(ColorBgDark).
			Background(ColorSecondary).
			Bold(true).
			Padding(0, 1).
			MarginLeft(1)

	// Side Panel / Note List
	StyleSidebar = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(ColorBorder).
			Padding(0, 1)

	StyleSidebarActive = lipgloss.NewStyle().
				Border(lipgloss.RoundedBorder()).
				BorderForeground(ColorPrimary).
				Padding(0, 1)

	// Content Panel / Viewport
	StyleMainPanel = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(ColorBorder).
			Padding(0, 1)

	StyleMainPanelActive = lipgloss.NewStyle().
				Border(lipgloss.RoundedBorder()).
				BorderForeground(ColorSecondary).
				Padding(0, 1)

	// Note Item in List
	StyleNoteItem = lipgloss.NewStyle().
			Padding(0, 1).
			Foreground(ColorFgLight)

	StyleNoteItemActive = lipgloss.NewStyle().
				Padding(0, 1).
				Bold(true).
				Foreground(ColorBgDark).
				Background(ColorPrimary)

	StyleNoteItemTitle = lipgloss.NewStyle().
				Bold(true)

	StyleNoteItemMeta = lipgloss.NewStyle().
				Foreground(ColorMuted).
				Italic(true)

	// Status Bar
	StyleStatusBar = lipgloss.NewStyle().
			Foreground(ColorFgLight).
			Background(ColorBgCard).
			Padding(0, 1)

	StyleStatusKey = lipgloss.NewStyle().
			Bold(true).
			Foreground(ColorSecondary)

	StyleStatusDesc = lipgloss.NewStyle().
			Foreground(ColorMuted)

	// Modal / Dialog Box
	StyleDialogBox = lipgloss.NewStyle().
			Border(lipgloss.DoubleBorder()).
			BorderForeground(ColorPrimary).
			Background(ColorBgCard).
			Padding(1, 2)

	StyleDialogTitle = lipgloss.NewStyle().
				Bold(true).
				Foreground(ColorPrimary).
				MarginBottom(1)

	// Badges
	StyleBadgeInfo = lipgloss.NewStyle().
			Foreground(ColorBgDark).
			Background(ColorSecondary).
			Bold(true).
			Padding(0, 1)

	StyleBadgeSuccess = lipgloss.NewStyle().
				Foreground(ColorBgDark).
				Background(ColorSuccess).
				Bold(true).
				Padding(0, 1)

	StyleBadgeDanger = lipgloss.NewStyle().
				Foreground(ColorFgLight).
				Background(ColorDanger).
				Bold(true).
				Padding(0, 1)

	// Search bar
	StyleSearchPrompt = lipgloss.NewStyle().
				Bold(true).
				Foreground(ColorSecondary)
)
