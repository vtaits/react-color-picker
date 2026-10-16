import { ColorPicker } from "../src/index.js";
import { Example } from "./Example.jsx";
import "../style/index.css";

/**
 * @import { Meta, StoryObj } from "@storybook/react-vite"
 */

/** @type {Meta<typeof ColorPicker>} */
const meta = {
	title: "ColorPicker",
	component: ColorPicker,
	tags: ["autodocs"],
};

export default meta;

/**
 * @typedef {StoryObj<typeof ColorPicker>} Story
 */

/** @type {Story} */
export const ExampleStory = {
	name: "Example",
	args: {},
	render: (props) => <Example {...props} />,
};
