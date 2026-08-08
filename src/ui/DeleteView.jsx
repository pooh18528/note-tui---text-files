import React from 'react';
import { Box, Text } from 'ink';
import { THEME } from '../styles.js';

export function DeleteView({ note }) {
	return (
		<Box flexDirection="column" paddingLeft={1} paddingRight={1}>
			<Text bold color={THEME.warning}>
				⚠️ Confirm Deletion
			</Text>
			<Text color={THEME.fgLight}>{" Are you sure you want to delete the note?"}</Text>
			<Text color={THEME.muted}>{`  📄 ${note.title}  (${note.filename})`}</Text>
			<Box marginTop={1}>
				<Text color={THEME.success} bold>
					{'[y] Yes, Delete'}
				</Text>
				<Text color={THEME.muted}>
					{'   [n/Esc] Cancel'}
				</Text>
			</Box>
		</Box>
	);
}