import type {Meta, StoryObj} from '@storybook/angular';
import {componentWrapperDecorator} from '@storybook/angular';

import {ScichartAngularDeclarativeComponent} from 'scichart-angular';
import {EAxisType, EChart2DModifierType, ESeriesType} from "scichart";
import type {ISciChart2DDefinition} from "scichart";

const defaultConfig: ISciChart2DDefinition = {
  xAxes: [{ type: EAxisType.NumericAxis }],
  yAxes: [{ type: EAxisType.NumericAxis }],
  series: [
    {
      type: ESeriesType.SplineMountainSeries,
      options: {
        fill: "#3ca832",
        stroke: "#eb911c",
        strokeThickness: 4,
        opacity: 0.4
      },
      xyData: { xValues: [1, 2, 3, 4], yValues: [1, 4, 7, 3] }
    }
  ],
  modifiers: [
    { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
    { type: EChart2DModifierType.MouseWheelZoom },
    { type: EChart2DModifierType.ZoomExtents }
  ]
};

// Only the Builder-API path is covered here. The fallback slot and innerContainerStyles live on the
// shared base component and are exercised by the ScichartAngular stories.
const meta: Meta<ScichartAngularDeclarativeComponent> = {
  title: 'ScichartAngularDeclarative',
  component: ScichartAngularDeclarativeComponent,
  tags: ['autodocs'],
  // The story root has no height of its own, and the chart sizes itself to its parent.
  decorators: [componentWrapperDecorator((story) => `<div style="height: 400px;">${story}</div>`)],
  parameters: {
    // onInit emits the surface itself; the actions addon cannot serialize an object that large
    // and throws "RangeError: Invalid string length".
    actions: { disable: true },
  },
  render: (args: ScichartAngularDeclarativeComponent) => ({
    props: {
      ...args,
    },
  }),
  argTypes: {
    onDelete: {
      type: 'function',
      control: 'function',
    },
    onInit: {
      type: 'function',
      control: 'function',
    },
  },
};

export default meta;
type Story = StoryObj<ScichartAngularDeclarativeComponent>;

export const ChartWithConfig: Story = {
  args: {
    config: defaultConfig,
  },
};
