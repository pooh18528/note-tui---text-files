import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { THEME } from '../styles.js';

export function RenameForm({ value, onChange, onSubmit, focus }) {
	return (
		<Box flexDirection="column" paddingLeft={1} paddingRight={1}>
			<Text bold color={THEME.primary}>
				✏️ Rename Note
			</Text>
			<Text color={THEME.muted}>
				New name:
			</Text>
			<Box>
				<TextInput value={value} onChange={onChange} onSubmit={onSubmit} focus={focus} placeholder="Enter new name..." />
			</Box>
			<Box marginTop={1}>
				<Text color={THEME.muted}>[Enter] Save  •  [Esc] Cancel</Text>
			</Box>
		</Box>
	);
}
