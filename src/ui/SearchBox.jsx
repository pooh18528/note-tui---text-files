import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { THEME } from '../styles.js';

export function SearchBox({ value, onChange, onEnter, focus }) {
	return (
		<Box flexDirection="column">
			<Box>
				<Text bold color={THEME.secondary}>
					{'🔍 Search: '}
				</Text>
				<TextInput
					value={value}
					onChange={onChange}
					onSubmit={onEnter}
					focus={focus}
					placeholder="Type to search notes..."
				/>
			</Box>
			<Text color={THEME.muted} italic>
				{'[Enter] apply filter  •  [Esc] clear search'}
			</Text>
		</Box>
	);
}