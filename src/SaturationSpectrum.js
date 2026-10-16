import { jsx, jsxs } from "react/jsx-runtime";
import { DEFAULT_COLOR } from "./defaultColor.js";
import { fromRatio } from "./utils/color.js";
import { BaseComponent, baseDefaultProps } from "./utils/common.js";
import { toColorValue } from "./utils/toColorValue.js";
import { validate } from "./utils/validate.js";

/**
 * @import { CSSProperties } from "react"
 * @import { ColorFormats } from "tinycolor2"
 * @import { PointType } from "./types.js"
 * @import { BaseProps } from "./utils/common.js"
 */

const DEFAULT_POINTER_SIZE = 7;

/**
 * @param {PointType} point
 */
const getSaturationForPoint = (point) => point.x / point.width;

/**
 * @param {PointType} point
 */
const getColorValueForPoint = (point) =>
	(point.height - point.y) / point.height;

/**
 * @param {ColorFormats.HSVA} color
 */
const prepareBackgroundColor = (color) => {
	const hsv = color;

	const col = fromRatio({
		h: (hsv.h % 360) / 360,
		s: 1,
		v: 1,
	});

	return col.toRgbString();
};

/**
 * @typedef {Object} SaturationSpectrumProps
 * @property {string} [className]
 * @property {string | ColorFormats.HSVA} [color]
 * @property {string | ColorFormats.HSVA} [value]
 * @property {number} [height]
 * @property {number} [width]
 * @property {number} [pointerSize]
 * @property {string | ColorFormats.HSVA} [defaultColor]
 * @property {CSSProperties} [style]
 */

/**
 * @extends {BaseComponent<SaturationSpectrumProps>}
 */
export class SaturationSpectrum extends BaseComponent {
	static defaultProps = {
		...baseDefaultProps,

		value: null,
		height: 300,
		width: 300,
		pointerSize: DEFAULT_POINTER_SIZE,
		defaultColor: DEFAULT_COLOR,
		isSaturationSpectrum: true,
	};

	mounted = false;

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

	getDragPosition() {
		const { value, pointerSize = DEFAULT_POINTER_SIZE } = this.props;
		let { width, height } = this.props;
		const { mouseDown } = this.state;

		const sizeDefined = typeof width === "number" && typeof height === "number";

		if (!sizeDefined && !this.isComponentMounted()) {
			return null;
		}

		if (!sizeDefined) {
			const rootNode = this.rootRef.current;

			if (!rootNode) {
				throw new Error("root ref is not provided");
			}

			const rect = rootNode.getBoundingClientRect();
			height = height || rect.height;
			width = width || rect.width;
		}

		if (!this.hsv) {
			throw new Error("HSV is not setted");
		}

		if (typeof width !== "number" || typeof height !== "number") {
			throw new Error("size is not defined");
		}

		let x = this.hsv.s * width;
		const y = height - this.hsv.v * height;

		const size = pointerSize;
		const diff = Math.floor(size / 2);

		if (value && mouseDown && !Number.isNaN(mouseDown.x)) {
			({ x } = mouseDown);
		}

		return {
			left: x - diff,
			top: y - diff,
		};
	}

	/**
	 * @param {BaseProps & SaturationSpectrumProps} thisProps
	 */
	prepareProps(thisProps) {
		/** @type {BaseProps & SaturationSpectrumProps} */
		const props = {
			...thisProps,
		};

		const color = props.value || props.defaultColor || DEFAULT_COLOR;

		props.color = color;

		this.hsv = toColorValue(color);

		props.style = this.prepareStyle(props);
		props.className = `${thisProps.className ?? ""} react-color-picker__saturation-spectrum`;

		return props;
	}

	/**
	 * @param {BaseProps & SaturationSpectrumProps} props
	 */
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

		if (!this.hsv) {
			throw new Error("HSV is not setted");
		}

		style.backgroundColor = prepareBackgroundColor(this.hsv);

		return style;
	}

	render() {
		const { pointerSize = DEFAULT_POINTER_SIZE } = this.props;
		const props = this.prepareProps(this.props);

		/** @type {CSSProperties} */
		const dragStyle = {
			width: pointerSize,
			height: pointerSize,
		};

		const dragPos = this.getDragPosition();

		if (dragPos) {
			dragStyle.top = dragPos.top;
			dragStyle.left = dragPos.left;
			dragStyle.display = "block";
		}

		return jsxs("div", {
			className: props.className,
			style: props.style,
			onMouseDown: this.onMouseDown,
			onTouchStart: this.onTouchStart,
			role: "button",
			ref: this.rootRef,
			tabIndex: 0,
			children: [
				jsx("div", {
					className: "react-color-picker__saturation-white",
					children: jsx("div", {
						className: "react-color-picker__saturation-black",
					}),
				}),

				jsx("div", {
					className: "react-color-picker__saturation-drag",
					style: dragStyle,
					children: jsx("div", {
						className: "react-color-picker__saturation-inner",
					}),
				}),
			],
		});
	}

	/**
	 * @param {PointType} point
	 */
	updateColor(point) {
		const newPoint = validate(point);

		if (!this.hsv) {
			throw new Error("HSV is not setted");
		}

		this.hsv.s = getSaturationForPoint(newPoint);
		this.hsv.v = getColorValueForPoint(newPoint);

		const newHsv = {
			...this.hsv,
		};

		this.hsv = newHsv;

		return newHsv;
	}
}
