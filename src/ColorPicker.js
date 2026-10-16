import { Children, Component } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { DEFAULT_COLOR } from "./defaultColor.js";
import { HueSpectrum } from "./HueSpectrum.js";
import { SaturationSpectrum } from "./SaturationSpectrum.js";
import { toColorValue } from "./utils/toColorValue.js";
import { toStringValue } from "./utils/toStringValue.js";

/**
 * @import { CSSProperties, ReactNode, ReactElement } from "react"
 * @import { ColorFormats, ColorInput } from "tinycolor2"
 * @import { HueSpectrumProps } from "./HueSpectrum.js"
 * @import { SaturationSpectrumProps } from "./SaturationSpectrum.js"
 * @import { BaseProps } from "./utils/common.js"
 */

/**
 * @typedef {Object} ColorPickerProps
 * @property {string} [className]
 * @property {CSSProperties} [hueStyle]
 * @property {(value: string, newColor: ColorInput) => void} [onDrag]
 * @property {(value: string, newColor: ColorInput) => void} [onChange]
 * @property {string | ColorFormats.HSVA} [value]
 * @property {string | ColorFormats.HSVA} [defaultColor]
 * @property {number} [hueHeight]
 * @property {number} [hueMargin]
 * @property {number} [hueWidth]
 * @property {number} [saturationWidth]
 * @property {number} [saturationHeight]
 * @property {ReactNode} [children]
 */

/**
 * @typedef {Object} StateType
 * @property {number | null} dragHue
 */

/**
 * @extends {Component<ColorPickerProps, StateType>}
 */
export class ColorPicker extends Component {
	/** @type {ColorPickerProps} */
	static defaultProps = {
		className: "",
		hueStyle: {},

		onDrag: () => {},
		onChange: () => {},

		value: undefined,
		defaultColor: DEFAULT_COLOR,

		hueHeight: undefined,
		hueMargin: 10,
		hueWidth: 30,

		saturationWidth: 300,
		saturationHeight: 300,

		children: null,
	};

	/**
	 * @param {ColorPickerProps} props
	 */
	constructor(props) {
		super(props);

		this.state = {
			dragHue: null,
		};
	}

	/**
	 * @param {ColorInput} color
	 */
	handleSaturationChange = (color) => {
		this.handleChange(color);
	};

	/**
	 * @param {ColorInput} color
	 */
	handleHueChange = (color) => {
		this.handleChange(color);
	};

	/**
	 * @param {string | ColorFormats.HSVA} hsv
	 */
	handleHueDrag = (hsv) => {
		if (typeof hsv === "string") {
			throw new Error("color cannot be string");
		}

		this.setState({
			dragHue: hsv.h,
		});

		this.handleDrag(hsv);
	};

	/**
	 * @param {ColorInput} hsv
	 */
	handleSaturationDrag = (hsv) => {
		this.handleDrag(hsv);
	};

	/**
	 * @param {string | ColorFormats.HSVA} hsv
	 */
	handleHueMouseDown = (hsv) => {
		if (typeof hsv === "string") {
			throw new Error("color cannot be string");
		}

		this.setState({
			dragHue: hsv.h,
		});
	};

	/**
	 * @param {string | ColorFormats.HSVA} hsv
	 */
	handleSaturationMouseDown = (hsv) => {
		if (typeof hsv === "string") {
			throw new Error("color cannot be string");
		}

		this.setState({
			dragHue: hsv.h,
		});
	};

	/**
	 * @param {ColorInput} color
	 */
	handleDrag(color) {
		const { onDrag } = this.props;

		if (!onDrag) {
			return;
		}

		onDrag(toStringValue(color), color);
	}

	/**
	 * @param {ColorInput} color
	 */
	handleChange(color) {
		if (typeof color === "string") {
			throw new Error("color cannot be string");
		}

		const { onChange } = this.props;

		if (!onChange) {
			return;
		}

		this.setState({
			dragHue: null,
		});

		/** @type {ColorInput} */
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
			onChange: _onChange,
			onDrag: _onDrag,
			...divProps
		} = props;

		const { dragHue } = this.state;

		const className = `${propsClassName} cp react-color-picker`;
		const hueStyle = {
			...propsHueStyle,
			marginLeft: hueMargin,
		};

		const value = toColorValue(propsValue || defaultColor || DEFAULT_COLOR);

		const { children } = props;
		/** @type {BaseProps & HueSpectrumProps} */
		let hueSpectrumProps = {};
		/** @type {BaseProps & SaturationSpectrumProps} */
		let saturationSpectrumProps = {};

		if (children) {
			for (const child of Children.toArray(children)) {
				if (!child || !(/** @type {ReactElement} */ (child).type)) {
					continue;
				}

				const childElement = /** @type {ReactElement} */ (child);

				switch (childElement.type) {
					case SaturationSpectrum:
						saturationSpectrumProps = /** @type {SaturationSpectrumProps} */ (
							childElement.props
						);
						break;

					case HueSpectrum:
						hueSpectrumProps = /** @type {HueSpectrumProps} */ (
							childElement.props
						);
						break;

					default:
						break;
				}
			}
		}

		/** @type {BaseProps & SaturationSpectrumProps} */
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

		/** @type {BaseProps & HueSpectrumProps} */
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

		return jsxs("div", {
			...divProps,
			className,
			children: [
				jsx(SaturationSpectrum, saturationConfig),
				jsx(HueSpectrum, hueConfig),
			],
		});
	}
}
