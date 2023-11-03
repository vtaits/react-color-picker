export type ConfigType = {
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

export type PointType = {
	x: number;
	y: number;
	width: number;
	height: number;
};
