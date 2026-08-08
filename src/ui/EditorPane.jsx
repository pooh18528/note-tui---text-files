import React, { useRef } from 'react';
import { Box } from 'ink';
import { TextArea, LineNumberPrefix } from 'react-ink-textarea';
import { THEME } from '../styles.js';

export function EditorPane({ value, onChange, focus, width, height }) {
	const ref = useRef(null);
	const innerWidth = Math.max(width - 2, 1);
	const innerHeight = Math.max(height - 2, 1);

	return (
		<Box width={innerWidth} height={innerHeight} flexDirection="column">
			<TextArea
				ref={ref}
				focus={focus}
				value={value}
				onChange={onChange}
				onSubmit={() => ref.current?.insert('\n')}
				placeholder="Write your note content here..."
				linePrefix={LineNumberPrefix}
				highlightActiveLine
				viewportLines={innerHeight}
				styles={{ text: { color: THEME.fgLight } }}
			/>
		</Box>
	);
}