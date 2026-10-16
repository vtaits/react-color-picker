import { toHsv } from "./color.js";

/**
 * @import { ColorFormats } from "tinycolor2"
 */

/**
 * @param {string | ColorFormats.HSVA} value
 * @returns {ColorFormats.HSVA}
 */
export function toColorValue(value) {
	if (typeof value === "string") {
		return toHsv(value);
	}

	return {
		h: value.h,
		s: value.s,
		v: value.v,
		a: value.a,
	};
}
