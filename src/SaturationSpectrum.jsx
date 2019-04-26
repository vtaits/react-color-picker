

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { fromRatio } from './utils/color';
import BaseComponent, {
  baseInitialState,
  basePropTypes,
  baseDefaultProps,
} from './utils/common';
import DEFAULT_COLOR from './defaultColor';

import VALIDATE from './utils/validate';
import toColorValue from './utils/toColorValue';

const getSaturationForPoint = (point) => point.x / point.width;

const getColorValueForPoint = (point) => (point.height - point.y) / point.height;

const prepareBackgroundColor = (color) => {
  const hsv = color;

  const col = fromRatio({
    h: (hsv.h % 360) / 360,
    s: 1,
    v: 1,
  });

  return col.toRgbString();
};

class SaturationSpectrum extends BaseComponent {
  static propTypes = {
    ...basePropTypes,

    height: PropTypes.number,
    width: PropTypes.number,
    pointerSize: PropTypes.number,
    defaultColor: PropTypes.any,
    isSaturationSpectrum: PropTypes.bool,
  }

  static defaultProps = {
    ...baseDefaultProps,

    height: 300,
    width: 300,
    pointerSize: 7,
    defaultColor: DEFAULT_COLOR,
    isSaturationSpectrum: true,
  }

  state = {
    ...baseInitialState,
    pointerTop: null,
    pointerLeft: null,
  }

  componentDidMount() {
    this.mounted = true;
    this.updateDragPositionIf();
  }

  isComponentMounted() {
    return this.mounted;
  }

  updateDragPositionIf() {
    if (!this.props.height || !this.props.width) {
      this.setState({});
    }
  }

  getDragPosition(hsv) {
    const newHsv = hsv || this.hsv;

    let { width, height } = this.props;
    const sizeDefined = width && height;

    if (!sizeDefined && !this.isComponentMounted()) {
      return null;
    }

    let region;

    if (!sizeDefined) {
      region = this.getDOMRegion();
      height = height || region.getHeight();
      width = width || region.getWidth();
    }

    let x = newHsv.s * width;
    const y = height - (newHsv.v * height);
    const size = this.props.pointerSize;
    const diff = Math.floor(size / 2);

    if (
      this.props.value
      && this.state.mouseDown
      && !Number.isNaN(this.state.mouseDown.x)
    ) {
      const {
        mouseDown,
      } = this.state;

      ({ x } = mouseDown);
    }

    return {
      left: x - diff,
      top: y - diff,
    };
  }

  prepareProps(thisProps, state) {
    const props = {
      ...thisProps,
    };

    const color = state.value || props.value || props.defaultValue || props.defaultColor;

    props.color = color;

    this.hsv = toColorValue(color);

    props.style = this.prepareStyle(props);
    props.className = cx(
      thisProps.className,
      'react-color-picker__saturation-spectrum',
    );

    return props;
  }

  prepareStyle(props) {
    const style = {
      ...props.style,
    };

    if (props.height) {
      style.height = props.height;
    }

    if (props.width) {
      style.width = props.width;
    }

    style.backgroundColor = prepareBackgroundColor(this.hsv);

    return style;
  }

  render() {
    const props = this.prepareProps(this.props, this.state);

    const dragStyle = {
      width: this.props.pointerSize,
      height: this.props.pointerSize,
    };

    const dragPos = this.getDragPosition();

    if (dragPos) {
      dragStyle.top = dragPos.top;
      dragStyle.left = dragPos.left;
      dragStyle.display = 'block';
    }

    return (
      <div
        className={props.className}
        style={props.style}
        onMouseDown={this.onMouseDown}
        role="button"
        ref={this.rootRef}
        tabIndex={0}
      >
        <div className="react-color-picker__saturation-white">
          <div className="react-color-picker__saturation-black" />
        </div>
        <div className="react-color-picker__saturation-drag" style={dragStyle}>
          <div className="react-color-picker__saturation-inner" />
        </div>
      </div>
    );
  }

  updateColor(point) {
    const newPoint = VALIDATE(point);

    this.hsv.s = getSaturationForPoint(newPoint);
    this.hsv.v = getColorValueForPoint(newPoint);
  }
}

export default SaturationSpectrum;
