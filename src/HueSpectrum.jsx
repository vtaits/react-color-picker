import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent, {
  baseInitialState,
  basePropTypes,
  baseDefaultProps,
} from './utils/common';
import DEFAULT_COLOR from './defaultColor';

import VALIDATE from './utils/validate';

class HueSpectrum extends BaseComponent {
  static propTypes = {
    ...basePropTypes,

    height: PropTypes.number,
    width: PropTypes.number,
    pointerSize: PropTypes.number,
    defaultColor: PropTypes.any,
    isHueSpectrum: PropTypes.bool,
  }

  static defaultProps = {
    ...baseDefaultProps,

    height: 300,
    width: 30,
    pointerSize: 3,
    defaultColor: DEFAULT_COLOR,
    isHueSpectrum: true,
  }

  state = {
    ...baseInitialState,
    h: 0,
  }

  isComponentMounted() {
    return this.mounted;
  }

  componentDidMount() {
    this.mounted = true;
    this.updateDragPositionIf();
  }

  updateDragPositionIf() {
    if (!this.props.height) {
      this.setState({});
    }
  }

  getDragPosition(hsv) {
    const newHsv = hsv || this.hsv;

    if (!this.props.height && !this.isComponentMounted()) {
      return null;
    }

    const height = this.props.height || this.getDOMRegion().getHeight();
    const size = this.props.pointerSize;

    const pos = Math.round(newHsv.h * height / 360);
    const diff = Math.round(size / 2);

    return pos - diff;
  }

  updateColor(point) {
    const newPoint = VALIDATE(point);

    this.hsv.h = newPoint.y * 360 / newPoint.height;

    if (this.hsv.h !== 0) {
      this.state.h = this.hsv.h;
    }

    this.state.h = this.hsv.h !== 0 ? this.hsv.h : 0;
  }

  render() {
    const {
      style,
      value,
      defaultValue,
      defaultColor,
    } = this.props;

    const {
      value: stateValue,
    } = this.state;

    this.hsv = this.toColorValue(
      stateValue
      || value
      || defaultValue
      || defaultColor,
    );

    if (this.state.h === 360 && !this.hsv.h) {
      // in order to show bottom red as well on drag
      this.hsv.h = 360;
    }

    const rootStyle = {
      ...style,
    };

    if (this.props.height) {
      rootStyle.height = this.props.height;
    }
    if (this.props.width) {
      rootStyle.width = this.props.width;
    }

    const dragStyle = {
      height: this.props.pointerSize,
    };

    const dragPos = this.getDragPosition();

    if (dragPos !== null) {
      dragStyle.top = dragPos;
      dragStyle.display = 'block';
    }

    return (
      <div
        className="react-color-picker__hue-spectrum"
        style={rootStyle}
        onMouseDown={this.onMouseDown}
        role="button"
        ref={this.rootRef}
        tabIndex={0}
      >
        <div
          className="react-color-picker__hue-drag"
          style={dragStyle}
        >
          <div className="react-color-picker__hue-inner" />
        </div>
      </div>
    );
  }
}

export default HueSpectrum;
