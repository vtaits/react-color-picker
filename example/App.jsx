import React, { Component } from 'react';
import ColorPicker from '@vtaits/react-color-picker';

const COLOR = 'red';

class App extends Component {
  state = {
    color: COLOR,
  };

  onDrag = (color) => {
    this.setState({
      color,
    });
  };

  render() {
    const { color } = this.state;

    return (
      <div>
        <h1>React Color Picker</h1>

        <ColorPicker value={color} onDrag={this.onDrag} />

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
}

export default App;
