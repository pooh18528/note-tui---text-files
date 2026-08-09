import React from 'react';
import { Box, Text } from 'ink';
import { THEME } from '../styles.js';

function key(label) {
	return <Text bold color={THEME.statusKey}>{label}</Text>;
}

function helpFor(mode) {
	switch (mode) {
		case 'view':
			return (
				<Text>
					{key('j/k')} Scroll  •  {key('Esc')} Back  •  {key('e')} Edit  •  {key('q')} Quit
				</Text>
			);
		case 'create':
		case 'edit':
			return (
				<Text>
					{key('Ctrl+S / Enter')} Save Note  •  {key('Esc')} Cancel
				</Text>
			);
		case 'delete':
			return (
				<Text>
					{key('y')} Confirm Delete  •  {key('n / Esc')} Cancel
				</Text>
			);
		case 'search':
			return (
				<Text>
					{key('Type')} Filter  •  {key('Esc')} Clear Search
				</Text>
			);
		default:
			return (
				<Text>
					{key('j/k')} List  •  {key('Enter')} View  •  {key('n')} New  •  {key('e')} Edit  •  {key('Shift+R')} Rename  •  {key('d')} Delete  •  {key('/')} Search  •  {key('r')} Refresh  •  {key('q')} Quit
				</Text>
			);
	}
}

export function StatusBar({ mode, statusMsg, statusErr }) {
	return (
		<Box marginTop={1} justifyContent="space-between" width="100%">
			{helpFor(mode)}
			{statusMsg ? (
				<Text
					bold
					backgroundColor={statusErr ? THEME.danger : THEME.success}
					color={statusErr ? THEME.bgDark : THEME.bgDark}
				>
					{` ${statusMsg} `}
				</Text>
			) : null}
		</Box>
	);
}