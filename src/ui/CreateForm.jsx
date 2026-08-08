import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { THEME } from '../styles.js';

export function CreateForm({ value, onChange, onSubmit, focus }) {
	return (
		<Box flexDirection="column" paddingLeft={1} paddingRight={1}>
			<Text bold color={THEME.primary}>
				➕ Create New Note
			</Text>
			<Text color={THEME.muted}>
				Title:
			</Text>
			<Box>
				<TextInput value={value} onChange={onChange} onSubmit={onSubmit} focus={focus} placeholder="Enter title..." />
			</Box>
			<Text color={THEME.muted}>
				{`Content: (empty on create — save then press e to edit)`}
			</Text>
			<Box marginTop={1}>
				<Text color={THEME.muted} italic>
					Write content later with the e editor.
				</Text>
			</Box>
			<Box marginTop={1}>
				<Text color={THEME.muted}>[Enter] Save Note  •  [Esc] Cancel</Text>
			</Box>
		</Box>
	);
}