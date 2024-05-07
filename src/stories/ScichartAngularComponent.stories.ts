import type {Meta, StoryObj} from '@storybook/angular';
import {argsToTemplate} from '@storybook/angular';

import {ScichartAngularComponent} from 'scichart-angular';
import {
  CameraController,
  EAxisType,
  EChart2DModifierType, EDrawMeshAs,
  ESeriesType, GradientColorPalette,
  MouseWheelZoomModifier, MouseWheelZoomModifier3D,
  NumberRange,
  NumericAxis,
  NumericAxis3D, OrbitModifier3D, ResetCamera3DModifier,
  SciChart3DSurface,
  SciChartSurface,
  SplineMountainRenderableSeries, SurfaceMeshRenderableSeries3D, UniformGridDataSeries3D, Vector3,
  XyDataSeries,
  zeroArray2D,
  ZoomExtentsModifier,
  ZoomPanModifier
} from "scichart";

const defaultConfig = {
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

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<ScichartAngularComponent> = {
  title: 'ScichartAngular',
  component: ScichartAngularComponent,
  tags: ['autodocs'],
  render: (args: ScichartAngularComponent) => ({
    props: {
      ...args,
    },
  }),
  argTypes: {
    initChart: {
      type: 'function',
      control: 'function',
    },
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
type Story = StoryObj<ScichartAngularComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ChartWithConfig: Story = {
  args: {
    config: defaultConfig,
  },
};

export const ChartWithFallback: Story = {
  args: {
    config: defaultConfig,
  },
  render: (args: ScichartAngularComponent) => ({
    template: `
    <scichart-angular ${argsToTemplate(args)}>
      <div fallback>Chart is loading...</div>
    </scichart-angular>`,
  }),
};

export const ChartWithNestedElements: Story = {
  args: {
    config: defaultConfig,
  },
  render: (args: ScichartAngularComponent) => ({
    template: `
    <scichart-angular ${argsToTemplate(args)}>
      <button (click)="handleClick">Toggle Chart Theme</button>
    </scichart-angular>`,
  }),
};

export const ChartWithCustomStyles: Story = {
  args: {
    innerContainerStyles: {
      aspectRatio: 2,
      width: "600px",
      height: "300px",
    },
    config: defaultConfig,
  },
};

export const ChartWithInitFunction: Story = {
  args: {
    initChart: async (rootElement: string | HTMLDivElement) => {
      const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

      sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
      sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

      sciChartSurface.renderableSeries.add(
        new SplineMountainRenderableSeries(wasmContext, {
          dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4],
            yValues: [1, 4, 7, 3]
          }),
          fill: "#3ca832",
          stroke: "#eb911c",
          strokeThickness: 4,
          opacity: 0.4
        })
      );

      sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
      );

      return {sciChartSurface, wasmContext };
    },
  },
};

export const ChartWith3dSurface: Story = {
  args: {
    initChart: async (rootElement: string | HTMLDivElement) => {
      const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement);

      // Create and position the camera in the 3D world
      sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-200, 150, 200),
        target: new Vector3(0, 50, 0)
      });
      // Set the worlddimensions, which defines the Axis cube size
      sciChart3DSurface.worldDimensions = new Vector3(200, 100, 200);

      // Add an X,Y and Z Axis
      sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
      sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
        visibleRange: new NumberRange(0, 0.3)
      });
      sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

      // Create a 2D array using the helper function zeroArray2D
      // and fill this with data
      const zSize = 25;
      const xSize = 25;
      const heightmapArray = zeroArray2D([zSize, xSize]);
      for (let z = 0; z < zSize; z++) {
        for (let x = 0; x < xSize; x++) {
          const xVal = (x / xSize) * 25.0;
          const zVal = (z / zSize) * 25.0;
          heightmapArray[z][x] = Math.sin(xVal * 0.2) / ((zVal + 1) * 2);
        }
      }

      // Create a UniformGridDataSeries3D
      const dataSeries = new UniformGridDataSeries3D(wasmContext, {
        yValues: heightmapArray,
        xStep: 1,
        zStep: 1,
        dataSeriesName: "Uniform Surface Mesh"
      });

      // Create the color map
      const colorMap = new GradientColorPalette(wasmContext, {
        gradientStops: [
          { offset: 1, color: "pink" },
          { offset: 0.9, color: "orange" },
          { offset: 0.7, color: "red" },
          { offset: 0.5, color: "green" },
          { offset: 0.3, color: "blue" },
          { offset: 0, color: "violet" }
        ]
      });

      // Finally, create a SurfaceMeshRenderableSeries3D and add to the chart
      const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
        dataSeries,
        minimum: 0,
        maximum: 0.5,
        opacity: 0.9,
        cellHardnessFactor: 1.0,
        shininess: 0,
        lightingFactor: 0.0,
        highlight: 1.0,
        stroke: "blue",
        strokeThickness: 2.0,
        contourStroke: "blue",
        contourInterval: 2,
        contourOffset: 0,
        contourStrokeThickness: 2,
        drawSkirt: false,
        drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME,
        meshColorPalette: colorMap,
        isVisible: true
      });

      sciChart3DSurface.renderableSeries.add(series);

      // Optional: Add some interactivity modifiers
      sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
      sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
      sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());

      // the returned result should contain at least a reference to the created surface as `sciChartSurface`
      return { sciChartSurface: sciChart3DSurface };
    },
  }
}


export const ChartWithPieSurface: Story = {
  args: {
    initChart: async rootElement => {
      const sciChartPieSurface = await SciChartPieSurface.create(rootElement);

      const pieSegment1 = new PieSegment({
        color: EColor.Green,
        value: 10,
        text: "Green",
        delta: 10,
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
          { color: "#1D976C", offset: 0 },
          { color: "#93F9B9", offset: 1 }
        ])
      });
      pieSegment1.radiusAdjustment = 1.2;
      const pieSegment2 = new PieSegment({
        color: EColor.Red,
        value: 20,
        text: "Red",
        delta: 20,
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
          { color: "#DD5E89", offset: 0 },
          { color: "#F7BB97", offset: 1 }
        ])
      });
      pieSegment2.radiusAdjustment = 0.7;
      const pieSegment3 = new PieSegment({
        color: EColor.Blue,
        value: 30,
        text: "Blue",
        delta: 30,
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
          { color: "#2b2828", offset: 0 },
          { color: "#656565", offset: 1 }
        ])
      });
      const pieSegment4 = new PieSegment({
        color: EColor.Yellow,
        value: 40,
        text: "Yellow",
        delta: 40,
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
          { color: "#F09819", offset: 0 },
          { color: "#EDDE5D", offset: 1 }
        ])
      });

      sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);

      // the returned result should contain at least a reference to the created surface as `sciChartSurface`
      return { sciChartSurface: sciChartPieSurface };
    },
  }
}
