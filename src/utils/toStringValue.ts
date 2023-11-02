import type { ColorInput } from "tinycolor2";
import { toColor } from "./color";

export function toStringValue(color: ColorInput) {
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
