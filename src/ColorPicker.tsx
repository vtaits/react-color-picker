import cx from "classnames";
import {
	type CSSProperties,
	Children,
	Component,
	type PropsWithChildren,
	type ReactElement,
} from "react";
import type { ColorFormats, ColorInput } from "tinycolor2";

import { HueSpectrum, type HueSpectrumProps } from "./HueSpectrum";
import {
	SaturationSpectrum,
	type SaturationSpectrumProps,
} from "./SaturationSpectrum";
import { DEFAULT_COLOR } from "./defaultColor";
import type { BaseProps } from "./utils/common";
import { toColorValue } from "./utils/toColorValue";
import { toStringValue } from "./utils/toStringValue";

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

type StateType = {
	dragHue: number | null;
};

export class ColorPicker extends Component<ColorPickerProps, StateType> {
	static defaultProps: ColorPickerProps = {
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

	handleHueDrag = (hsv: string | ColorFormats.HSVA) => {
		if (typeof hsv === "string") {
			throw new Error("color cannot be string");
		}

		this.setState({
			dragHue: hsv.h,
		});

		this.handleDrag(hsv);
	};

	handleSaturationDrag = (hsv: ColorInput) => {
		this.handleDrag(hsv);
	};

	handleHueMouseDown = (hsv: string | ColorFormats.HSVA) => {
		if (typeof hsv === "string") {
			throw new Error("color cannot be string");
		}

		this.setState({
			dragHue: hsv.h,
		});
	};

	handleSaturationMouseDown = (hsv: string | ColorFormats.HSVA) => {
		if (typeof hsv === "string") {
			throw new Error("color cannot be string");
		}

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
			onChange,
			onDrag,
			...divProps
		} = props;

		const { dragHue } = this.state;

		const className = cx(propsClassName, "cp react-color-picker");
		const hueStyle = {
			...propsHueStyle,
			marginLeft: hueMargin,
		};

		const value = toColorValue(propsValue || defaultColor || DEFAULT_COLOR);

		const { children } = props;
		let hueSpectrumProps: BaseProps & HueSpectrumProps = {};
		let saturationSpectrumProps: BaseProps & SaturationSpectrumProps = {};

		if (children) {
			for (const child of Children.toArray(children)) {
				if (!child || !(child as ReactElement).type) {
					continue;
				}

				const childElement = child as ReactElement;

				switch (childElement.type) {
					case SaturationSpectrum:
						saturationSpectrumProps =
							childElement.props as SaturationSpectrumProps;
						break;

					case HueSpectrum:
						hueSpectrumProps = childElement.props as HueSpectrumProps;
						break;

					default:
						break;
				}
			}
		}

		const saturationConfig: BaseProps & SaturationSpectrumProps = {
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

		const hueConfig: BaseProps & HueSpectrumProps = {
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
