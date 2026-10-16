import { Component, createRef } from "react";
import { toStringValue } from "./toStringValue.js";

/**
 * @import {MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, RefObject} from "react"
 * @import { ColorFormats, ColorInput } from "tinycolor2"
 * @import { ConfigType, PointType } from "../types.js"
 */

/**
 * @typedef {Object} StateType
 * @property {number} [dragHue]
 * @property {number} [h]
 * @property {number} top
 * @property {number} left
 * @property {PointType | null} mouseDown
 * @property {number} [pointerTop]
 * @property {number} [pointerLeft]
 */

/** @type {StateType} */
export const baseInitialState = {
	top: 0,
	left: 0,
	mouseDown: null,
};

/**
 * @typedef {Object} BaseProps
 * @property {boolean} [inPicker]
 * @property {(...colors: readonly (string | ColorFormats.HSVA)[]) => void} [onMouseDown]
 * @property {(...colors: readonly (string | ColorFormats.HSVA)[]) => void} [onDrag]
 * @property {(...colors: readonly ColorInput[]) => void} [onChange]
 */

export const baseDefaultProps = {
	inPicker: false,
	onMouseDown: undefined,
	onDrag: undefined,
	onChange: undefined,
};

/**
 *
 * @param {[number, number]} coords
 * @param {DOMRect} region
 * @returns {PointType}
 */
function getEventInfo([clientX, clientY], region) {
	const x = clientX - region.left;
	const y = clientY - region.top;

	return {
		x,
		y,
		width: region.width,
		height: region.height,
	};
}

/**
 * @template AdditionalProps
 * @extends {Component<
	BaseProps & AdditionalProps,
	StateType
	>}
 */
export class BaseComponent extends Component {
	static defaultProps = baseDefaultProps;

	/** @type {ColorFormats.HSVA | null} */
	hsv = null;

	state = baseInitialState;

	/**
	 * @type {RefObject<HTMLDivElement | null>}
	 */
	rootRef = createRef();

	/**
	 * @param {PointType} _
	 * @returns {ColorFormats.HSVA}
	 */
	updateColor(_) {
		return {
			h: 0,
			s: 0,
			v: 0,
			a: 0,
		};
	}

	/**
	 * @param {ColorFormats.HSVA} hsv
	 * @returns {(string | ColorFormats.HSVA)[]}
	 */
	getColors(hsv) {
		const { inPicker } = this.props;

		const first = inPicker ? hsv : toStringValue(hsv);

		/** @type {(string | ColorFormats.HSVA)[]} */
		const args = [first];

		if (!inPicker) {
			args.push({
				...hsv,
			});
		}

		return args;
	}

	/**
	 * @param {number} clientX
	 * @param {number} clientY
	 */
	onStartMove = (clientX, clientY) => {
		const rootNode = this.rootRef.current;

		if (!rootNode) {
			throw new Error("root ref is not provided");
		}

		const rect = rootNode.getBoundingClientRect();
		const info = getEventInfo([clientX, clientY], rect);

		/** @type {ConfigType} */
		const config = {
			initialPoint: info,
			minLeft: 0,
			maxLeft: rect.width,
		};

		/**
		 * @param {MouseEvent} dragEvent
		 */
		const onMouseMove = (dragEvent) => {
			const dragInfo = getEventInfo(
				[dragEvent.clientX, dragEvent.clientY],
				rect,
			);
			const newHsv = this.updateColor(dragInfo);

			this.handleDrag(
				{
					...config,
					diff: {
						left: dragInfo.x - info.x,
						top: dragInfo.y - info.y,
					},
				},
				newHsv,
			);
		};

		/**
		 * @param {TouchEvent} event
		 */
		const onTouchMove = (event) => {
			event.preventDefault();
			const firstTouch = event.touches[0];

			if (!firstTouch) {
				return;
			}

			const dragInfo = getEventInfo(
				[firstTouch.clientX, firstTouch.clientY],
				rect,
			);
			const newHsv = this.updateColor(dragInfo);

			this.handleDrag(
				{
					...config,
					diff: {
						left: dragInfo.x - info.x,
						top: dragInfo.y - info.y,
					},
				},
				newHsv,
			);
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("touchmove", onTouchMove);

		const onEnd = () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("touchmove", onTouchMove);
			document.removeEventListener("mouseup", onEnd);
			document.removeEventListener("touchend", onEnd);
		};

		document.addEventListener("mouseup", onEnd);
		document.addEventListener("touchend", onEnd);

		this.updateColor(info);
		this.handleMouseDown(config);
	};

	/**
	 * @param {ReactMouseEvent} event
	 */
	onMouseDown = (event) => {
		event.preventDefault();
		this.onStartMove(event.clientX, event.clientY);
	};

	/**
	 * @param {ReactTouchEvent} event
	 */
	onTouchStart = (event) => {
		event.preventDefault();

		const firstTouch = event.touches[0];

		if (!firstTouch) {
			return;
		}

		this.onStartMove(firstTouch.clientX, firstTouch.clientY);
	};

	/**
	 * @param {ConfigType} config
	 */
	handleMouseDown = (config) => {
		const { onMouseDown } = this.props;

		if (!this.hsv) {
			throw new Error("HSV is not setted");
		}

		if (onMouseDown) {
			onMouseDown(...this.getColors(this.hsv));
		}

		this.handleDrag(config, this.hsv);
	};

	/**
	 * @param {ConfigType} config
	 */
	handleUpdate(config) {
		const diff = config.diff || { top: 0, left: 0 };
		const { initialPoint } = config;

		if (initialPoint) {
			let left = initialPoint.x + diff.left;
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

	/**
	 * @param {ConfigType} config
	 * @param {ColorFormats.HSVA} hsv
	 */
	handleDrag(config, hsv) {
		const { onDrag } = this.props;

		this.handleUpdate(config);

		if (onDrag) {
			onDrag(...this.getColors(hsv));
		}
	}

	/**
	 * @param {ConfigType} config
	 * @param {ColorFormats.HSVA} hsv
	 */
	handleDrop(config, hsv) {
		const { onChange } = this.props;

		this.handleUpdate(config);

		this.setState({
			mouseDown: null,
		});

		if (onChange) {
			onChange(...this.getColors(hsv));
		}
	}
}
