import cx from "classnames";
import { CSSProperties } from "react";
import type { ColorFormats } from "tinycolor2";

import { DEFAULT_COLOR } from "./defaultColor";
import type { PointType } from "./types";
import { fromRatio } from "./utils/color";
import {
	BaseComponent,
	type BaseProps,
	baseDefaultProps,
} from "./utils/common";
import { toColorValue } from "./utils/toColorValue";
import { validate } from "./utils/validate";

const DEFAULT_POINTER_SIZE = 7;

const getSaturationForPoint = (point: PointType) => point.x / point.width;

const getColorValueForPoint = (point: PointType) =>
	(point.height - point.y) / point.height;

const prepareBackgroundColor = (color: ColorFormats.HSVA) => {
	const hsv = color;

	const col = fromRatio({
		h: (hsv.h % 360) / 360,
		s: 1,
		v: 1,
	});

	return col.toRgbString();
};

export type SaturationSpectrumProps = {
	className?: string;
	color?: string | ColorFormats.HSVA;
	value?: string | ColorFormats.HSVA;
	height?: number;
	width?: number;
	pointerSize?: number;
	defaultColor?: string | ColorFormats.HSVA;
	style?: CSSProperties;
};

export class SaturationSpectrum extends BaseComponent<SaturationSpectrumProps> {
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

	prepareProps(thisProps: BaseProps & SaturationSpectrumProps) {
		const props: BaseProps & SaturationSpectrumProps = {
			...thisProps,
		};

		const color = props.value || props.defaultColor || DEFAULT_COLOR;

		props.color = color;

		this.hsv = toColorValue(color);

		props.style = this.prepareStyle(props);
		props.className = cx(
			thisProps.className,
			"react-color-picker__saturation-spectrum",
		);

		return props;
	}

	prepareStyle(props: BaseProps & SaturationSpectrumProps) {
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

		const dragStyle: CSSProperties = {
			width: pointerSize,
			height: pointerSize,
		};

		const dragPos = this.getDragPosition();

		if (dragPos) {
			dragStyle.top = dragPos.top;
			dragStyle.left = dragPos.left;
			dragStyle.display = "block";
		}

		return (
			<div
				className={props.className}
				style={props.style}
				onMouseDown={this.onMouseDown}
				onTouchStart={this.onTouchStart}
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

	updateColor(point: PointType) {
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
