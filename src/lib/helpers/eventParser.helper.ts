export function extractEventFromString(inputString: string): string | null {
	const regex = /\.(\w+)$/;
	const matches = inputString.match(regex);

	if (matches) {
		const event = matches[1];
		return event;
	} else {
		return null;
	}
}
