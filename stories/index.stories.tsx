import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker } from "../src";
import "../dist/index.css";
import { Example } from "./Example";

const meta: Meta<typeof ColorPicker> = {
	title: "ColorPicker",
	component: ColorPicker,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const ExampleStory: Story = {
	name: "Example",
	args: {},
	render: (props) => <Example {...props} />,
};
