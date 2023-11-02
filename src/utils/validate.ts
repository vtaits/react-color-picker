/* eslint-disable no-param-reassign */

export function validate(point) {
	const { height, width } = info;

	if (info.x < 0) {
		info.x = 0;
	}

	if (info.x >= width) {
		info.x = width;
	}

	if (info.y < 0) {
		info.y = 0;
	}

	if (info.y >= height) {
		info.y = height;
	}

	return info;
}
