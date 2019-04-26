import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Region from 'region';
import DragHelper from 'drag-helper';

import toStringValue from './toStringValue';

export const baseInitialState = {
  value: null,
};

export const basePropTypes = {
  inPicker: PropTypes.bool,
  value: PropTypes.any,
  onMouseDown: PropTypes.func,
  onDrag: PropTypes.func,
  onChange: PropTypes.func,
};


export const baseDefaultProps = {
  inPicker: false,
  value: null,
  onMouseDown: null,
  onDrag: null,
  onChange: null,
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

  getColors() {
    const {
      inPicker,
    } = this.props;

    const first = inPicker
      ? this.hsv
      : toStringValue(this.hsv);

    const args = [first];

    if (!inPicker) {
      args.push({
        ...this.hsv,
      });
    }

    return args;
  }

  getEventInfo(event, region) {
    const newRegion = region || this.getDOMRegion();

    const x = event.clientX - newRegion.left;
    const y = event.clientY - newRegion.top;

    return {
      x,
      y,
      width: newRegion.getWidth(),
      height: newRegion.getHeight(),
    };
  }

  onMouseDown = (event) => {
    event.preventDefault();

    const region = this.getDOMRegion();
    const info = this.getEventInfo(event, region);

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
        const dragInfo = this.getEventInfo(event, region);
        this.updateColor(dragInfo);
        this.handleDrag(dragEvent, config);
      },

      onDrop(dropEvent, config) {
        const dropInfo = this.getEventInfo(event, region);
        this.updateColor(dropInfo);
        this.handleDrop(dropEvent, config);
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
      onMouseDown.apply(this, this.getColors());
    }

    this.handleDrag(event, config);
  }

  handleUpdate = (event, config) => {
    const {
      inPicker,
      value,
    } = this.props;

    const diff = config.diff || { top: 0, left: 0 };
    const { initialPoint } = config;

    if (initialPoint) {
      let left;

      left = initialPoint.x + diff.left;
      const top = initialPoint.y + diff.top;

      left = Math.max(left, config.minLeft);
      left = Math.min(left, config.maxLeft);

      this.state.top = top;
      this.state.left = left;

      this.state.mouseDown = {
        x: left,
        y: top,
        width: initialPoint.width,
        height: initialPoint.height,
      };
    }

    if (inPicker) {
      // the picker handles the values
      return;
    }

    if (!value) {
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        value: this.hsv,
      });
    }
  }

  handleUpdate = (event, config) => {
    const {
      inPicker,
      value,
    } = this.props;

    const diff = config.diff || { top: 0, left: 0 };
    const { initialPoint } = config;

    if (initialPoint) {
      let left;

      left = initialPoint.x + diff.left;
      const top = initialPoint.y + diff.top;

      left = Math.max(left, config.minLeft);
      left = Math.min(left, config.maxLeft);

      this.state.top = top;
      this.state.left = left;

      this.state.mouseDown = {
        x: left,
        y: top,
        width: initialPoint.width,
        height: initialPoint.height,
      };
    }

    if (inPicker) {
      // the picker handles the values
      return;
    }

    if (!value) {
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        value: this.hsv,
      });
    }
  }

  handleDrag = (event, config) => {
    const {
      onDrag,
    } = this.props;

    this.handleUpdate(event, config);

    if (onDrag) {
      onDrag.apply(this, this.getColors());
    }
  }

  handleDrop = (event, config) => {
    const {
      onChange,
    } = this.props;

    this.handleUpdate(event, config);
    this.state.mouseDown = false;

    if (onChange) {
      onChange.apply(this, this.getColors());
    }
  }
}

export default BaseComponent;
