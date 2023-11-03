import type { ColorFormats } from "tinycolor2";
import { toHsv } from "./color";

export function toColorValue(
	value: string | ColorFormats.HSVA,
): ColorFormats.HSVA {
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
