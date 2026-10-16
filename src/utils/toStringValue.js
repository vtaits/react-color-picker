import { toColor } from "./color.js";

/**
 * @import { ColorInput } from "tinycolor2"
 */

/**
 * @param {ColorInput} color
 * @returns {string}
 */
export function toStringValue(color) {
	if (typeof color === "string") {
		throw new Error("color cannot be string");
	}

	const newColor = toColor({
		...color,
	});

	return newColor.toRgb().a === 1
		? newColor.toHexString()
		: newColor.toRgbString();
}
