import React, {
  useCallback,
  useState,
} from 'react';

import { ColorPicker, type ColorPickerProps } from '../src';

const COLOR = 'red';

export function Example(props: ColorPickerProps) {
  const [color, setColor] = useState(COLOR);

  const onDrag = useCallback((nextColor) => {
    setColor(nextColor);
  }, []);

  return (
    <div>
      <ColorPicker
        {...props}
        value={color}
        onDrag={onDrag}
      />

      <div
        style={{
          background: color,
          width: 100,
          height: 50,
          color: 'white',
        }}
      >
        {color}
      </div>
    </div>
  );
}
