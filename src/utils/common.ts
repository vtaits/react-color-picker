/* eslint-disable */
import {
	Component,
	type MouseEvent as ReactMouseEvent,
	type TouchEvent as ReactTouchEvent,
	createRef,
} from "react";
import type { ColorFormats, ColorInput } from "tinycolor2";

import type { ConfigType, PointType } from "../types";
import { toStringValue } from "./toStringValue";

type StateType = {
	dragHue?: number;
	h?: number;
	top: number;
	left: number;
	mouseDown: PointType | null;
	pointerTop?: number;
	pointerLeft?: number;
};

export const baseInitialState: StateType = {
	top: 0,
	left: 0,
	mouseDown: null,
};

export type BaseProps = {
	inPicker?: boolean;
	onMouseDown?: (...colors: readonly (string | ColorFormats.HSVA)[]) => void;
	onDrag?: (...colors: readonly (string | ColorFormats.HSVA)[]) => void;
	onChange?: (...colors: readonly ColorInput[]) => void;
};

export const baseDefaultProps = {
	inPicker: false,
	onMouseDown: undefined,
	onDrag: undefined,
	onChange: undefined,
};

function getEventInfo(
	[clientX, clientY]: [number, number],
	region: DOMRect,
): PointType {
	const x = clientX - region.left;
	const y = clientY - region.top;

	return {
		x,
		y,
		width: region.width,
		height: region.height,
	};
}

export class BaseComponent<AdditionalProps> extends Component<
	BaseProps & AdditionalProps,
	StateType
> {
	static defaultProps = baseDefaultProps;

	hsv: ColorFormats.HSVA | null = null;

	state = baseInitialState;

	rootRef = createRef<HTMLDivElement>();

	updateColor(_: PointType): ColorFormats.HSVA {
		return {
			h: 0,
			s: 0,
			v: 0,
			a: 0,
		};
	}

	getColors(hsv: ColorFormats.HSVA) {
		const { inPicker } = this.props;

		const first = inPicker ? hsv : toStringValue(hsv);

		const args: (string | ColorFormats.HSVA)[] = [first];

		if (!inPicker) {
			args.push({
				...hsv,
			});
		}

		return args;
	}

	onStartMove = (clientX: number, clientY: number) => {
		const rootNode = this.rootRef.current;

		if (!rootNode) {
			throw new Error("root ref is not provided");
		}

		const rect = rootNode.getBoundingClientRect();
		const info = getEventInfo([clientX, clientY], rect);

		const config: ConfigType = {
			initialPoint: info,
			minLeft: 0,
			maxLeft: rect.width,
		};

		const onMouseMove = (dragEvent: MouseEvent) => {
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

		const onTouchMove = (event: TouchEvent) => {
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

	onMouseDown = (event: ReactMouseEvent) => {
		event.preventDefault();
		this.onStartMove(event.clientX, event.clientY);
	};

	onTouchStart = (event: ReactTouchEvent) => {
		event.preventDefault();

		const firstTouch = event.touches[0];

		if (!firstTouch) {
			return;
		}

		this.onStartMove(firstTouch.clientX, firstTouch.clientY);
	};

	handleMouseDown = (config: ConfigType) => {
		const { onMouseDown } = this.props;

		if (!this.hsv) {
			throw new Error("HSV is not setted");
		}

		if (onMouseDown) {
			onMouseDown(...this.getColors(this.hsv));
		}

		this.handleDrag(config, this.hsv);
	};

	handleUpdate(config: ConfigType) {
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

	handleDrag(config: ConfigType, hsv: ColorFormats.HSVA) {
		const { onDrag } = this.props;

		this.handleUpdate(config);

		if (onDrag) {
			onDrag(...this.getColors(hsv));
		}
	}

	handleDrop(config: ConfigType, hsv: ColorFormats.HSVA) {
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
