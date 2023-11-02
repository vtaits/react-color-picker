import type { CSSProperties } from "react";
import type { ColorFormats } from "tinycolor2";

import {
	BaseComponent,
	baseInitialState,
	baseDefaultProps,
} from "./utils/common";
import { DEFAULT_COLOR } from "./defaultColor";
import { validate } from "./utils/validate";
import { toColorValue } from "./utils/toColorValue";

type HueSpectrumProps = {
	value?: string | ColorFormats.HSVA;
	height?: number;
	width?: number;
	pointerSize?: number;
	defaultColor?: string | ColorFormats.HSVA;
	isHueSpectrum?: boolean;
};

export class HueSpectrum extends BaseComponent<HueSpectrumProps> {
	static defaultProps = {
		...baseDefaultProps,

		value: null,
		height: 300,
		width: 30,
		pointerSize: 3,
		defaultColor: DEFAULT_COLOR,
		isHueSpectrum: true,
	};

	state = {
		...baseInitialState,
		h: 0,
	};

	mounted = false;

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
		const { height, pointerSize } = this.props;

		if (!height && !this.isComponentMounted()) {
			return null;
		}

		const computedHeight = height || this.getDOMRegion().getHeight();
		const size = pointerSize;

		const pos = Math.round((this.hsv.h * computedHeight) / 360);
		const diff = Math.round(size / 2);

		return pos - diff;
	}

	updateColor(point) {
		const newPoint = validate(point);

		this.hsv.h = (newPoint.y * 360) / newPoint.height;

		const newHsv = {
			...this.hsv,
		};

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
		const { style, value, defaultColor, pointerSize, height, width } =
			this.props;

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

		const dragStyle: CSSProperties = {
			height: pointerSize,
		};

		const dragPos = this.getDragPosition();

		if (dragPos !== null) {
			dragStyle.top = dragPos;
			dragStyle.display = "block";
		}

		return (
			<div
				className="react-color-picker__hue-spectrum"
				style={rootStyle}
				onMouseDown={this.onMouseDown}
				role="button"
				ref={this.rootRef}
				tabIndex={0}
			>
				<div className="react-color-picker__hue-drag" style={dragStyle}>
					<div className="react-color-picker__hue-inner" />
				</div>
			</div>
		);
	}
}
