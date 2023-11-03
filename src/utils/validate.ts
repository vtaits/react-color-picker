import type { PointType } from "../types";

export function validate(point: PointType) {
	const { height, width } = point;

	if (point.x < 0) {
		point.x = 0;
	}

	if (point.x >= width) {
		point.x = width;
	}

	if (point.y < 0) {
		point.y = 0;
	}

	if (point.y >= height) {
		point.y = height;
	}

	return point;
}
