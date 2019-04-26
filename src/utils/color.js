import tinycolor from 'tinycolor2';

function toColor(color) {
  return tinycolor(color);
}

function toPure(color) {
  const { h } = toColor(color).toHsl();

  return toColor({
    h, s: 100, l: 50, a: 1,
  });
}

function fromRatio(color) {
  return tinycolor.fromRatio(color);
}

function toAlpha(color, alpha) {
  const newAlpha = alpha > 1
    ? alpha / 100
    : alpha;

  const newColor = toColor(color).toRgb();
  newColor.a = newAlpha;

  return toColor(newColor);
}

function toHsv(color) {
  return toColor(color).toHsv();
}

export default {
  fromRatio,
  toAlpha,
  toColor,
  toHsv,
  toPure,
};

export {
  fromRatio,
  toAlpha,
  toColor,
  toHsv,
  toPure,
};
