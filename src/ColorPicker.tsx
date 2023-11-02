import { type CSSProperties, Component, type PropsWithChildren } from "react";
import cx from "classnames";
import type { ColorFormats, ColorInput } from "tinycolor2";

import { HueSpectrum } from "./HueSpectrum";
import { SaturationSpectrum } from "./SaturationSpectrum";

import { toColorValue } from "./utils/toColorValue";
import { toStringValue } from "./utils/toStringValue";

import { DEFAULT_COLOR } from "./defaultColor";

export type ColorPickerProps = PropsWithChildren<{
	className?: string;
	hueStyle?: CSSProperties;

	onDrag?: (value: string, newColor: ColorInput) => void;
	onChange?: (value: string, newColor: ColorInput) => void;

	value?: string | ColorFormats.HSVA;
	defaultColor?: string | ColorFormats.HSVA;

	hueHeight?: number;
	hueMargin?: number;
	hueWidth?: number;

	saturationWidth?: number;
	saturationHeight?: number;
}>;

export class ColorPicker extends Component<ColorPickerProps> {
	// eslint-disable-next-line react/static-property-placement
	static defaultProps = {
		className: "",
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

	constructor(props: ColorPickerProps) {
		super(props);

		this.state = {
			dragHue: null,
		};
	}

	handleSaturationChange = (color: ColorInput) => {
		this.handleChange(color);
	};

	handleHueChange = (color: ColorInput) => {
		this.handleChange(color);
	};

	handleHueDrag = (hsv: ColorFormats.HSVA) => {
		this.setState({
			dragHue: hsv.h,
		});

		this.handleDrag(hsv);
	};

	handleSaturationDrag = (hsv: ColorInput) => {
		this.handleDrag(hsv);
	};

	handleHueMouseDown = (hsv: ColorFormats.HSVA) => {
		this.setState({
			dragHue: hsv.h,
		});
	};

	handleSaturationMouseDown = (hsv: ColorFormats.HSVA) => {
		this.setState({
			dragHue: hsv.h,
		});
	};

	handleDrag(color: ColorInput) {
		const { onDrag } = this.props;

		if (!onDrag) {
			return;
		}

		onDrag(toStringValue(color), color);
	}

	handleChange(color: ColorInput) {
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

		const newColor: ColorInput = {
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

		const { dragHue } = this.state;

		const className = cx(propsClassName, "cp react-color-picker");
		const hueStyle = {
			...propsHueStyle,
			marginLeft: hueMargin,
		};

		const value = toColorValue(propsValue || defaultColor || DEFAULT_COLOR);

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
			<div {...divProps} className={className}>
				<SaturationSpectrum {...saturationConfig} />
				<HueSpectrum {...hueConfig} />
			</div>
		);
	}
}
