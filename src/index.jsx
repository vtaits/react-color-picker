import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import HueSpectrum from './HueSpectrum';
import SaturationSpectrum from './SaturationSpectrum';

import toColorValue from './utils/toColorValue';
import toStringValue from './utils/toStringValue';

import { DEFAULT_COLOR } from './defaultColor';

class ColorPicker extends Component {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    className: PropTypes.string,
    hueStyle: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),

    onDrag: PropTypes.func,
    onChange: PropTypes.func,

    value: PropTypes.any,
    defaultColor: PropTypes.any,

    hueHeight: PropTypes.number,
    hueMargin: PropTypes.number,
    hueWidth: PropTypes.number,

    saturationWidth: PropTypes.number,
    saturationHeight: PropTypes.number,

    children: PropTypes.node,
  };

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    className: '',
    hueStyle: {},

    onDrag: Function.prototype,
    onChange: Function.prototype,

    value: null,
    defaultColor: DEFAULT_COLOR,

    hueHeight: null,
    hueMargin: 10,
    hueWidth: 30,

    saturationWidth: 300,
    saturationHeight: 300,

    children: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      dragHue: null,
    };
  }

  handleSaturationChange = (color) => {
    this.handleChange(color);
  };

  handleHueChange = (color) => {
    this.handleChange(color);
  };

  handleHueDrag = (hsv) => {
    this.setState({
      dragHue: hsv.h,
    });

    this.handleDrag(hsv);
  };

  handleSaturationDrag = (hsv) => {
    this.handleDrag(hsv);
  };

  handleHueMouseDown = (hsv) => {
    this.setState({
      dragHue: hsv.h,
    });
  };

  handleSaturationMouseDown = (hsv) => {
    this.setState({
      dragHue: hsv.h,
    });
  };

  handleDrag(color) {
    const {
      onDrag,
    } = this.props;

    onDrag(toStringValue(color), color);
  }

  handleChange(color) {
    const {
      onChange,
    } = this.props;

    this.setState({
      dragHue: null,
    });

    const newColor = {
      ...color,
    };

    const value = toStringValue(newColor);

    onChange(value, newColor);
  }

  render() {
    const { props } = this;
    const {
      className: propsClassName,
      hueStyle: propsHueStyle,
      hueHeight,
      hueMargin,
      hueWidth,
      defaultColor,
      value: propsValue,
      saturationHeight,
      saturationWidth,
      ...divProps
    } = props;

    const {
      dragHue,
    } = this.state;

    const className = cx(propsClassName, 'cp react-color-picker');
    const hueStyle = {
      ...propsHueStyle,
      marginLeft: hueMargin,
    };

    const value = toColorValue(propsValue || defaultColor);

    let { children } = props;
    let hueSpectrumProps = null;
    let saturationSpectrumProps = null;

    if (children) {
      children = React.Children.toArray(children).forEach((child) => {
        if (child && child.props) {
          if (child.props.isHueSpectrum) {
            hueSpectrumProps = {
              ...child.props,
            };
          }

          if (child.props.isSaturationSpectrum) {
            saturationSpectrumProps = {
              ...child.props,
            };
          }
        }
      });
    }

    const saturationConfig = {
      onDrag: this.handleSaturationDrag,
      onChange: this.handleSaturationChange,
      onMouseDown: this.handleSaturationMouseDown,
      ...saturationSpectrumProps,
    };

    if (saturationConfig.width === undefined) {
      saturationConfig.width = saturationWidth;
    }
    if (saturationConfig.height === undefined) {
      saturationConfig.height = saturationHeight;
    }
    saturationConfig.inPicker = true;

    const hueConfig = {
      onDrag: this.handleHueDrag,
      onChange: this.handleHueChange,
      onMouseDown: this.handleHueMouseDown,
      style: hueStyle,
      ...hueSpectrumProps,
    };

    if (hueConfig.width === undefined) {
      hueConfig.width = hueWidth;
    }
    if (hueConfig.height === undefined) {
      hueConfig.height = hueHeight || saturationHeight;
    }
    hueConfig.inPicker = true;

    if (dragHue) {
      value.h = dragHue;
    }

    saturationConfig.value = {
      ...value,
    };
    hueConfig.value = {
      ...value,
    };

    return (
      <div
        {...divProps}
        className={className}
      >
        <SaturationSpectrum {...saturationConfig} />
        <HueSpectrum {...hueConfig} />
      </div>
    );
  }
}

export {
  HueSpectrum,
  SaturationSpectrum,
};

export default ColorPicker;
