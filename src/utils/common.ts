/* eslint-disable */
import { Component, type MouseEvent, createRef } from "react";
import type { ColorFormats, ColorInput } from "tinycolor2";
import Region from "region";
import DragHelper from "drag-helper";

import { toStringValue } from "./toStringValue";

type StateType = {
	top: number;
	left: number;
	mouseDown: {
		x: number;
		y: number;
		width: number;
		height: number;
	} | null;
};

export const baseInitialState = {
	top: 0,
	left: 0,
	mouseDown: null,
};

type ConfigType = {
	diff?: {
		top: number;
		left: number;
	};
	initialPoint?: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	minLeft: number;
	maxLeft: number;
};

export type BaseProps = {
	inPicker?: boolean;
	onMouseDown?: (...colors: readonly ColorInput[]) => void;
	onDrag?: (...colors: readonly ColorInput[]) => void;
	onChange?: (...colors: readonly ColorInput[]) => void;
};

export const baseDefaultProps = {
	inPicker: false,
	onMouseDown: undefined,
	onDrag: undefined,
	onChange: undefined,
};

const getEventInfo = (event: MouseEvent, region) => {
	const x = event.clientX - region.left;
	const y = event.clientY - region.top;

	return {
		x,
		y,
		width: region.getWidth(),
		height: region.getHeight(),
	};
};

export class BaseComponent<AdditionalProps> extends Component<
	BaseProps & AdditionalProps,
	StateType
> {
	static defaultProps = baseDefaultProps;

	hsv: ColorFormats.HSVA | null = null;

	state = baseInitialState;

	rootRef = createRef<HTMLDivElement>();

	getDOMRegion() {
		return Region.fromDOM(this.rootRef.current);
	}

	getColors(hsv: ColorInput) {
		if (typeof hsv === "string") {
			throw new Error("color cannot be string");
		}

		const { inPicker } = this.props;

		const first = inPicker ? hsv : toStringValue(hsv);

		const args: ColorInput[] = [first];

		if (!inPicker) {
			args.push({
				...hsv,
			});
		}

		return args;
	}

	onMouseDown = (event: MouseEvent) => {
		event.preventDefault();

		const region = this.getDOMRegion();
		const info = getEventInfo(event, region);

		DragHelper(event, {
			scope: this,
			constrainTo: region,

			/* eslint-disable no-param-reassign */
			onDragStart(dragStartEvent, config) {
				config.initialPoint = info;

				config.minLeft = 0;
				config.maxLeft = region.width;
			},
			/* eslint-enable no-param-reassign */

			onDrag(dragEvent, config) {
				const dragInfo = getEventInfo(dragEvent, region);
				const newHsv = this.updateColor(dragInfo);

				this.handleDrag(dragEvent, config, newHsv);
			},

			onDrop(dropEvent, config) {
				const dropInfo = getEventInfo(dropEvent, region);
				const newHsv = this.updateColor(dropInfo);

				this.handleDrop(dropEvent, config, newHsv);
			},
		});

		this.updateColor(info);
		this.handleMouseDown(event, { initialPoint: info });
	};

	handleMouseDown = (event: MouseEvent, config: ConfigType) => {
		const { onMouseDown } = this.props;

		if (onMouseDown) {
			onMouseDown(...this.getColors(this.hsv));
		}

		this.handleDrag(event, config, this.hsv);
	};

	handleUpdate(event: MouseEvent, config: ConfigType) {
		const diff = config.diff || { top: 0, left: 0 };
		const { initialPoint } = config;

		if (initialPoint) {
			let left;

			left = initialPoint.x + diff.left;
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

	handleDrag(event: MouseEvent, config: ConfigType, hsv: ColorInput) {
		const { onDrag } = this.props;

		this.handleUpdate(event, config);

		if (onDrag) {
			onDrag(...this.getColors(hsv));
		}
	}

	handleDrop(event: MouseEvent, config: ConfigType, hsv: ColorInput) {
		const { onChange } = this.props;

		this.handleUpdate(event, config);

		this.setState({
			mouseDown: null,
		});

		if (onChange) {
			onChange(...this.getColors(hsv));
		}
	}
}
