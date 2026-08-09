import React from 'react';
import { Box, Text } from 'ink';
import { THEME } from '../styles.js';

export function HeaderBar({ dir, count, appName = 'note-tui' }) {
	return (
		<Box marginBottom={1}>
			<Text bold backgroundColor={THEME.headerBackground} color={THEME.headerForeground}>
				{` 📝 ${appName} `}
			</Text>
			<Text bold backgroundColor={THEME.headerBackground} color={THEME.badgeForeground}>
				{` 📁 ${dir} `}
			</Text>
			<Text color={THEME.muted}>{` (${count} ${count === 1 ? 'note' : 'notes'})`}</Text>
		</Box>
	);
}