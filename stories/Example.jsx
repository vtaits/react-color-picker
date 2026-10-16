import { useCallback, useState } from "react";
import { ColorPicker } from "../src/index.js";

/**
 * @import {ColorPickerProps} from "../src/index.js"
 */

const COLOR = "red";

/**
 * @param {ColorPickerProps} props
 */
export function Example(props) {
	const [color, setColor] = useState(COLOR);

	const onDrag = useCallback(
		/**
		 * @param {string} nextColor
		 */
		(nextColor) => {
			setColor(nextColor);
		},
		[],
	);

	return (
		<div>
			<ColorPicker {...props} value={color} onDrag={onDrag} />

			<div
				style={{
					background: color,
					width: 100,
					height: 50,
					color: "white",
				}}
			>
				{color}
			</div>
		</div>
	);
}
