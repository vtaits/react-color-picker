import React, {
  useCallback,
  useState,
} from 'react';

import ColorPicker from '@vtaits/react-color-picker';

const COLOR = 'red';

export function App() {
  const [color, setColor] = useState(COLOR);

  const onDrag = useCallback((nextColor) => {
    setColor(nextColor);
  }, []);

  return (
    <div>
      <h1>React Color Picker</h1>

      <ColorPicker
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
