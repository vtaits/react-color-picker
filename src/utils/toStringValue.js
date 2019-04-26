import { toColor } from './color';

const toStringValue = (color) => {
  const newColor = toColor({
    ...color,
  });

  return newColor.toRgb().a === 1
    ? newColor.toHexString()
    : newColor.toRgbString();
};

export default toStringValue;
