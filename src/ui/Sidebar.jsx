import React from 'react';
import { Box, Text } from 'ink';
import { THEME } from '../styles.js';
import { truncate, formatListDate } from '../utils.js';

export function Sidebar({ notes, selectedIndex, width, height, active }) {
	const borderColor = active ? THEME.sidebarBorderActive : THEME.sidebarBorder;
	const innerWidth = Math.max(width - 4, 1);
	const titleWidth = innerWidth - 15;

	const visibleBodyHeight = Math.max(height - 4, 0);
	const start = Math.min(
		Math.max(0, selectedIndex - Math.floor(visibleBodyHeight / 2)),
		Math.max(0, notes.length - visibleBodyHeight),
	);
	const visible = notes.slice(start, start + visibleBodyHeight);

	return (
		<Box
			width={width}
			height={height}
			borderStyle="round"
			borderColor={active ? THEME.sidebarBorderActive : THEME.sidebarBorder}
			paddingLeft={1}
			paddingRight={1}
			flexDirection="column"
		>
			<Text bold color={THEME.fgLight}>
				📋 NOTES LIST
			</Text>
			<Text color={THEME.border}>{"─".repeat(Math.max(innerWidth, 1))}</Text>
			{visible.length === 0 ? (
				<Text color={THEME.muted} italic>
					No notes
				</Text>
			) : (
				visible.map((note, k) => {
					const i = start + k;
					const isSelected = i === selectedIndex;
					const title = truncate(note.title, Math.max(titleWidth, 1));
					const date = formatListDate(note.modTime);
					const marker = isSelected ? "▶ " : "  ";
					const line = `${marker}${title} ${date}`;
					return (
						<Text
							key={note.filename}
							bold={isSelected}
							color={isSelected ? THEME.itemActiveForeground : THEME.itemForeground}
							backgroundColor={isSelected ? THEME.itemActiveBackground : undefined}
							wrap="truncate"
						>
							{marker}{title} {date}
						</Text>
					);
				})
			)}
		</Box>
	);
}