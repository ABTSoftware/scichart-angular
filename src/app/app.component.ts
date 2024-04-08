import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScichartAngularComponent } from 'scichart-angular';

import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  EllipsePointMarker,
  SweepAnimation,
  SciChartJsNavyTheme,
  NumberRange,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier,
  EAxisType,
  ESeriesType,
  EChart2DModifierType,
  Vector3,
  CameraController,
  NumericAxis3D,
  zeroArray2D,
  UniformGridDataSeries3D,
  GradientColorPalette,
  SurfaceMeshRenderableSeries3D,
  EDrawMeshAs,
  MouseWheelZoomModifier3D, OrbitModifier3D, ResetCamera3DModifier, SciChart3DSurface,
} from "scichart";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScichartAngularComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'scichart-angular-app';

  drawExample3D = async (rootElement: string | HTMLDivElement) => {
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
        const y = Math.sin(xVal * 0.2) / ((zVal + 1) * 2);
        heightmapArray[z][x] = y;
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
  }

  drawExample = async (rootElement: string | HTMLDivElement) => {
    // LICENSING
    // Commercial licenses set your license code here
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    // How-to steps at https://www.scichart.com/licensing-scichart-js/
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");

    // Initialize SciChartSurface. Don't forget to await!
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
      theme: new SciChartJsNavyTheme(),
      title: 'SciChart.js First Chart',
      titleStyle: { fontSize: 22 }
    });

    // Create an XAxis and YAxis with growBy padding
    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis", growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Y Axis", growBy }));

    // Create a line series with some initial data
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
      stroke: "steelblue",
      strokeThickness: 3,
      dataSeries: new XyDataSeries(wasmContext, {
        xValues: [0,1,2,3,4,5,6,7,8,9],
        yValues: [0, 0.0998, 0.1986, 0.2955, 0.3894, 0.4794, 0.5646, 0.6442, 0.7173, 0.7833]
      }),
      pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#fff" }),
      animation: new SweepAnimation({ duration: 300, fadeEffect: true })
    }));

    // Add some interaction modifiers to show zooming and panning
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());

    return {sciChartSurface, wasmContext };
  }

  config = {
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

  onInitHandler = (initResult: any) => {
    console.log("onInitHandler", initResult);
  }
}
