import { jsx } from "react/jsx-runtime";
import { DEFAULT_COLOR } from "./defaultColor.js";
import {
	BaseComponent,
	baseDefaultProps,
	baseInitialState,
} from "./utils/common.js";
import { toColorValue } from "./utils/toColorValue.js";
import { validate } from "./utils/validate.js";

/**
 * @import { CSSProperties } from "react"
 * @import { ColorFormats } from "tinycolor2"
 * @import { PointType } from "./types.js"
 */

const POINTER_SIZE = 3;

/**
 * @typedef {Object} HueSpectrumProps
 * @property {string | ColorFormats.HSVA} [value]
 * @property {number} [height]
 * @property {number} [width]
 * @property {number} [pointerSize]
 * @property {string | ColorFormats.HSVA} [defaultColor]
 * @property {CSSProperties} [style]
 */

/**
 * @extends {BaseComponent<HueSpectrumProps>}
 */
export class HueSpectrum extends BaseComponent {
	static defaultProps = {
		...baseDefaultProps,

		value: null,
		height: 300,
		width: 30,
		pointerSize: POINTER_SIZE,
		defaultColor: DEFAULT_COLOR,
	};

	state = {
		...baseInitialState,
		h: 0,
	};

	mounted = false;

	/** @type {ColorFormats.HSVA | null} */
	hsv = null;

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

	getDragPosition() {
		const { height, pointerSize = POINTER_SIZE } = this.props;

		if (!height && !this.isComponentMounted()) {
			return null;
		}

		const computedHeight =
			height || this.rootRef.current?.getBoundingClientRect().height;

		if (typeof computedHeight !== "number") {
			throw new Error("cannot determine the height");
		}

		const size = pointerSize;

		if (!this.hsv) {
			throw new Error("HSV is not setted");
		}

		const pos = Math.round((this.hsv.h * computedHeight) / 360);
		const diff = Math.round(size / 2);

		return pos - diff;
	}

	/**
	 * @param {PointType} point
	 * @returns
	 */
	updateColor(point) {
		const newPoint = validate(point);

		if (!this.hsv) {
			throw new Error("HSV is not setted");
		}

		this.hsv.h = (newPoint.y * 360) / newPoint.height;

		const newHsv = {
			...this.hsv,
		};

		/** @type {number} */
		let newH;

		if (this.hsv.h !== 0) {
			newH = this.hsv.h;
		}

		newH = this.hsv.h !== 0 ? this.hsv.h : 0;

		this.setState({
			h: newH,
		});

		this.hsv = newHsv;

		return newHsv;
	}

	render() {
		const {
			style,
			value,
			defaultColor,
			pointerSize = POINTER_SIZE,
			height,
			width,
		} = this.props;

		const { h } = this.state;

		this.hsv = toColorValue(value || defaultColor || DEFAULT_COLOR);

		if (h === 360 && !this.hsv.h) {
			// in order to show bottom red as well on drag
			this.hsv.h = 360;
		}

		const rootStyle = {
			...style,
		};

		if (height) {
			rootStyle.height = height;
		}
		if (width) {
			rootStyle.width = width;
		}

		/** @type {CSSProperties} */
		const dragStyle = {
			height: pointerSize,
		};

		const dragPos = this.getDragPosition();

		if (dragPos !== null) {
			dragStyle.top = dragPos;
			dragStyle.display = "block";
		}

		return jsx("div", {
			className: "react-color-picker__hue-spectrum",
			style: rootStyle,
			onMouseDown: this.onMouseDown,
			onTouchStart: this.onTouchStart,
			role: "button",
			ref: this.rootRef,
			tabIndex: 0,
			children: jsx("div", {
				className: "react-color-picker__hue-drag",
				style: dragStyle,
				children: jsx("div", {
					className: "react-color-picker__hue-inner",
				}),
			}),
		});
	}
}
