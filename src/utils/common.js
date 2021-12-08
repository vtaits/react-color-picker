/* eslint-disable */
import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Region from 'region';
import DragHelper from 'drag-helper';

import toStringValue from './toStringValue';

export const baseInitialState = {
  top: 0,
  left: 0,
  mouseDown: null,
};

export const basePropTypes = {
  inPicker: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onDrag: PropTypes.func,
  onChange: PropTypes.func,
};

export const baseDefaultProps = {
  inPicker: false,
  onMouseDown: null,
  onDrag: null,
  onChange: null,
};

const getEventInfo = (event, region) => {
  const x = event.clientX - region.left;
  const y = event.clientY - region.top;

  return {
    x,
    y,
    width: region.getWidth(),
    height: region.getHeight(),
  };
};

class BaseComponent extends Component {
  static propTypes = basePropTypes;

  static defaultProps = baseDefaultProps;

  state = baseInitialState;

  rootRef = createRef();

  handleDragStart = Function.prototype;

  getDOMRegion() {
    return Region.fromDOM(this.rootRef.current);
  }

  getColors(hsv) {
    const {
      inPicker,
    } = this.props;

    const first = inPicker
      ? hsv
      : toStringValue(hsv);

    const args = [first];

    if (!inPicker) {
      args.push({
        ...hsv,
      });
    }

    return args;
  }

  onMouseDown = (event) => {
    event.preventDefault();

    const region = this.getDOMRegion();
    const info = getEventInfo(event, region);

    DragHelper(event, {
      scope: this,
      constrainTo: region,

      /* eslint-disable no-param-reassign */
      onDragStart(dragStartEvent, config) {
        config.initialPoint = info;

        config.minLeft = 0;
        config.maxLeft = region.width;

        this.handleDragStart(dragStartEvent);
      },
      /* eslint-enable no-param-reassign */

      onDrag(dragEvent, config) {
        const dragInfo = getEventInfo(dragEvent, region);
        const newHsv = this.updateColor(dragInfo);

        this.handleDrag(dragEvent, config, newHsv);
      },

      onDrop(dropEvent, config) {
        const dropInfo = getEventInfo(dropEvent, region);
        const newHsv = this.updateColor(dropInfo);

        this.handleDrop(dropEvent, config, newHsv);
      },
    });

    this.updateColor(info);
    this.handleMouseDown(event, { initialPoint: info });
  }

  handleMouseDown = (event, config) => {
    const {
      onMouseDown,
    } = this.props;

    if (onMouseDown) {
      onMouseDown.apply(this, this.getColors(this.hsv));
    }

    this.handleDrag(event, config, this.hsv);
  }

  handleUpdate(event, config) {
    const diff = config.diff || { top: 0, left: 0 };
    const { initialPoint } = config;

    if (initialPoint) {
      let left;

      left = initialPoint.x + diff.left;
      const top = initialPoint.y + diff.top;

      left = Math.max(left, config.minLeft);
      left = Math.min(left, config.maxLeft);

      this.setState({
        top,
        left,
        mouseDown: {
          x: left,
          y: top,
          width: initialPoint.width,
          height: initialPoint.height,
        },
      });
    }
  }

  handleDrag(event, config, hsv) {
    const {
      onDrag,
    } = this.props;

    this.handleUpdate(event, config);

    if (onDrag) {
      onDrag.apply(this, this.getColors(hsv));
    }
  }

  handleDrop(event, config, hsv) {
    const {
      onChange,
    } = this.props;

    this.handleUpdate(event, config);

    this.setState({
      mouseDown: false,
    });

    if (onChange) {
      onChange.apply(this, this.getColors(hsv));
    }
  }
}

export default BaseComponent;
