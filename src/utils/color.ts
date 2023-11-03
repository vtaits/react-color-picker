import tinycolor, {
	type ColorInput,
	type ColorInputWithoutInstance,
} from "tinycolor2";

export function toColor(color: ColorInput) {
	return tinycolor(color);
}

export function toPure(color: ColorInput) {
	const { h } = toColor(color).toHsl();

	return toColor({
		h,
		s: 100,
		l: 50,
		a: 1,
	});
}

export function fromRatio(color: ColorInputWithoutInstance) {
	return tinycolor.fromRatio(color);
}

export function toAlpha(color: ColorInput, alpha: number) {
	const newAlpha = alpha > 1 ? alpha / 100 : alpha;

	const newColor = toColor(color).toRgb();
	newColor.a = newAlpha;

	return toColor(newColor);
}

export function toHsv(color: ColorInput) {
	return toColor(color).toHsv();
}
