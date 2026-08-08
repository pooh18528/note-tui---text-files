import React from 'react';
import { Box, Text } from 'ink';
import { THEME } from '../styles.js';
import { wrapText, formatDateTime, truncate } from '../utils.js';

export function NoteView({ note, width, height, scroll, active }) {
	const innerWidth = Math.max(width - 4, 1);
	const headerRows = 3;
	const maxBodyRows = Math.max(height - 6 - headerRows, 1);

	const meta = `📄 ${note.filename}  •  📅 ${formatDateTime(note.modTime)}  •  📝 ${note.wordCount} words  •  📏 ${note.lineCount} lines`;
	const metaText = truncate(meta, innerWidth);

	const isEmpty = !note.content.trim();
	const body = wrapText(isEmpty ? '(Empty Note)' : note.content, innerWidth);
	const clampedScroll = Math.max(0, Math.min(scroll, Math.max(0, body.length - maxBodyRows)));
	const visibleBody = body.slice(clampedScroll, clampedScroll + maxBodyRows);

	const borderColor = active ? THEME.mainBorderActive : THEME.mainBorder;

	return (
		<Box
			width={width}
			height={height}
			borderStyle="round"
			borderColor={borderColor}
			paddingLeft={1}
			paddingRight={1}
			flexDirection="column"
		>
			<Text bold color={THEME.secondary}>
				{`# ${note.title}`}
			</Text>
			<Text color={THEME.muted}>{metaText || ' '}</Text>
			<Text color={THEME.border}>{"─".repeat(Math.max(innerWidth, 1))}</Text>
			{visibleBody.map((line, i) =>
				isEmpty ? (
					<Text key={i} color={THEME.muted} italic>
						{line || ' '}
					</Text>
				) : (
					<Text key={i} color={THEME.fgLight}>
						{line || ' '}
					</Text>
				),
			)}
		</Box>
	);
}