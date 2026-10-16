import tinycolor from "tinycolor2";

/**
 * @import {ColorInput, ColorInputWithoutInstance} from "tinycolor2";
 */

/**
 * @param {ColorInput} color
 */
export function toColor(color) {
	return tinycolor(color);
}

/**
 * @param {ColorInput} color
 */
export function toPure(color) {
	const { h } = toColor(color).toHsl();

	return toColor({
		h,
		s: 100,
		l: 50,
		a: 1,
	});
}

/**
 * @param {ColorInputWithoutInstance} color
 */
export function fromRatio(color) {
	return tinycolor.fromRatio(color);
}

/**
 * @param {ColorInput} color
 * @param {number} alpha
 */
export function toAlpha(color, alpha) {
	const newAlpha = alpha > 1 ? alpha / 100 : alpha;

	const newColor = toColor(color).toRgb();
	newColor.a = newAlpha;

	return toColor(newColor);
}

/**
 * @param {ColorInput} color
 */
export function toHsv(color) {
	return toColor(color).toHsv();
}
