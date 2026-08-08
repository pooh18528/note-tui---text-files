import stringWidth from 'string-width';

const codepointsOf = (str) => Array.from(str);

export function wrapText(text, width) {
	if (width <= 0) {
		return [];
	}
	const rows = [];
	for (const rawLine of String(text ?? '').split('\n')) {
		if (stringWidth(rawLine) <= width) {
			rows.push(rawLine);
			continue;
		}
		let current = '';
		let currentWidth = 0;
		let index = 0;
		const length = rawLine.length;
		while (index < length) {
			const g = codepointsOf(rawLine[index]);
			const w = stringWidth(g);
			if (currentWidth + w > width && current !== '') {
				rows.push(current);
				current = '';
				currentWidth = 0;
			}
			current += g;
			currentWidth += w;
			index += g.length;
		}
		if (current !== '') {
			rows.push(current);
		} else if (currentWidth === 0 && rawLine !== '') {
			rows.push(rawLine);
		}
		rows.push('');
	}
	return rows.filter((row, i) => i !== rows.length - 1 || row !== '');
}

export function truncate(str, maxWidth, suffix = '..') {
	const text = String(str ?? '');
	if (maxWidth <= 0) {
		return '';
	}
	if (stringWidth(text) <= maxWidth) {
		return text;
	}
	const suffixWidth = stringWidth(suffix);
	const available = maxWidth - suffixWidth;
	if (available <= 0) {
		return suffix.slice(0, maxWidth);
	}
	let result = '';
	let width = 0;
	for (const char of codepointsOf(text)) {
		const w = stringWidth(char);
		if (width + w > available) {
			break;
		}
		result += char;
		width += w;
	}
	return `${result}${suffix}`;
}

export function padEnd(str, width, fill = ' ') {
	const text = String(str ?? '');
	const padding = width - stringWidth(text);
	if (padding <= 0) {
		return text;
	}
	return text + fill.repeat(padding);
}

export function formatDateTime(date) {
	const d = new Date(date);
	const pad = (n) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatListDate(date) {
	const d = new Date(date);
	const pad = (n) => String(n).padStart(2, '0');
	return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}