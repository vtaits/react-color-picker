import { CSSProperties } from "react";
import type { ColorFormats } from "tinycolor2";
import cx from "classnames";
import { fromRatio } from "./utils/color";
import {
	BaseComponent,
	baseInitialState,
	baseDefaultProps,
} from "./utils/common";
import { DEFAULT_COLOR } from "./defaultColor";

import { validate } from "./utils/validate";
import { toColorValue } from "./utils/toColorValue";

const getSaturationForPoint = (point) => point.x / point.width;

const getColorValueForPoint = (point) =>
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

type SaturationSpectrumProps = {
	value?: string | ColorFormats.HSVA;
	height?: number;
	width?: number;
	pointerSize?: number;
	defaultColor?: string | ColorFormats.HSVA;
	isSaturationSpectrum?: boolean;
};

export class SaturationSpectrum extends BaseComponent<SaturationSpectrumProps> {
	static defaultProps = {
		...baseDefaultProps,

		value: null,
		height: 300,
		width: 300,
		pointerSize: 7,
		defaultColor: DEFAULT_COLOR,
		isSaturationSpectrum: true,
	};

	mounted = false;

	state = {
		...baseInitialState,
		pointerTop: null,
		pointerLeft: null,
	};

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
		const { value, pointerSize } = this.props;
		let { width, height } = this.props;
		const { mouseDown } = this.state;

		const sizeDefined = width && height;

		if (!sizeDefined && !this.isComponentMounted()) {
			return null;
		}

		let region;

		if (!sizeDefined) {
			region = this.getDOMRegion();
			height = height || region.getHeight();
			width = width || region.getWidth();
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

	prepareProps(thisProps) {
		const props = {
			...thisProps,
		};

		const color = props.value || props.defaultColor;

		props.color = color;

		this.hsv = toColorValue(color);

		props.style = this.prepareStyle(props);
		props.className = cx(
			thisProps.className,
			"react-color-picker__saturation-spectrum",
		);

		return props;
	}

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

		style.backgroundColor = prepareBackgroundColor(this.hsv);

		return style;
	}

	render() {
		const { pointerSize } = this.props;
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

	updateColor(point) {
		const newPoint = validate(point);

		this.hsv.s = getSaturationForPoint(newPoint);
		this.hsv.v = getColorValueForPoint(newPoint);

		const newHsv = {
			...this.hsv,
		};

		this.hsv = newHsv;

		return newHsv;
	}
}
