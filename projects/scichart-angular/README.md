# SciChart.Angular - Official Angular Component Wrapper for SciChart.js: High Performance [JavaScript Chart Library](https://www.scichart.com/javascript-chart-features)

SciChart.angular requires core [SciChart.js](https://www.npmjs.com/package/scichart) package to work and uses it as a peer dependency.

The SciChartAngular itself is MIT licensed, find the core library licensing info at [https://www.scichart.com/licensing-scichart-js/](https://www.scichart.com/licensing-scichart-js/).

## What does SciChart.Angular do?

- Neatly wraps up the lifecycle of SciChart.js into an Angular component to ensure proper initialisation and memory cleanup.
- Provides a number of ways to configure a chart (via JSON config or initialization function)
- Can be used to create complex dashboards linking multiple charts (demos are coming soon!)

## Getting Started

### Prerequisites

-   `angular` 17.1+
-   `scichart` 6.0.0+ (for scichart 3.x-5.x use scichart-angular 1.x)

### Installing

```
npm install scichart scichart-angular
```

### Loading required WASM dependencies

SciChart.js requires WebAssembly binaries to work, and fetches them asynchronously at runtime.

Since v6 the engine is **modular** — a core plus side modules it loads on demand — so the payload
you deploy is the whole `_wasm` **directory**, not a single file. One binary now carries both the
2D and the 3D engine (`scichart.wasm`), and further modules are fetched as they are needed, such as
`scichart-charting3d.wasm` for the first 3D chart. There are also `-nosimd` and `-64` variants,
picked at runtime according to what the browser supports.

Copy the directory rather than naming files individually, so a new variant or module never breaks
your build. In `angular.json`:

```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
    "glob": "**/*.wasm",
    "input": "node_modules/scichart/_wasm",
    "output": "/"
  }
]
```

Find detailed info at [Deploying WASM](https://www.scichart.com/documentation/js/v6/2d-charts/surface/deploying-wasm/).

__NOTE__ `.data` files were removed in v4, and the separate `scichart2d.wasm` / `scichart3d.wasm`
pair was replaced by the single union binary in v6.

By default SciChartAngular applies the following configuration:

```typescript
SciChartSurface.configure({
    wasmUrl: "/scichart.wasm",
});
```

This is a single call: `SciChart3DSurface.configure()` writes the same setting, so calling both
would overwrite the first and point the engine at a file the union build does not ship. Your own
`SciChartSurface.configure(...)` or `loadWasmFromCDN()` call runs after this default and takes
precedence.

### Using

There are two components, and each takes a different way of describing the chart.

-   **`scichart-angular`** — takes an initialization function via `[initChart]`. This is the primary
    component for code-first apps and produces the smallest bundles.
-   **`scichart-angular-declarative`** — takes a chart definition via `[config]` and creates the
    chart with the Builder API. The Builder is only bundled by apps that use this component.

#### With Config

Pass a config object that will be used to generate a chart via the [Builder API](https://www.scichart.com/documentation/js/v6/2d-charts/builder-api/builder-api-overview/).

app.component.html
```html
<scichart-angular-declarative [config]="config"></scichart-angular-declarative>
```

app.component.ts
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScichartAngularDeclarativeComponent } from 'scichart-angular';

import {
  EAxisType,
  EChart2DModifierType,
  ESeriesType,
} from "scichart";
import type { ISciChart2DDefinition } from "scichart";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScichartAngularDeclarativeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'scichart-angular-app';

  config: ISciChart2DDefinition = {
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
  }
}
```

##### Type registration

A chart definition names its parts as strings — `{ type: "LineSeries" }`. A string cannot pull code
into a bundle, so since SciChart v6 the Builder API registers nothing on import: the types a
definition names have to be registered, or building it fails with
`Nothing registered for RenderableSeries:LineSeries`.

`scichart-angular-declarative` handles this for you by calling `registerAllTypes()`, so any
definition works with no setup. The trade-off is bundle size: the whole type universe is included.
If that matters, use `[initChart]` instead, or build the chart yourself and register only the types
you use:

```typescript
import { build2DChart } from "scichart";
import { registerNumericAxis } from "scichart/Builder/register/axes";
import { registerSplineMountainSeries } from "scichart/Builder/register/series";
import { registerXyDataSeries } from "scichart/Builder/register/dataSeries";

registerNumericAxis();
registerSplineMountainSeries();
registerXyDataSeries();
```


#### With Initialization Function

Alternatively you can pass a function which should create a surface on the provided root element.

app.component.html
```html
<scichart-angular [initChart]="drawExample"></scichart-angular>
```

app.component.ts
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScichartAngularComponent } from 'scichart-angular';

import {
  SciChartSurface,
  NumericAxis,
  SplineMountainRenderableSeries,
  XyDataSeries,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier,
} from "scichart";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScichartAngularComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'scichart-angular-app';

  drawExample = async function (rootElement) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

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

    return { sciChartSurface };
  }
}

```

**NOTE** Make sure that in both cases `initChart` and `config` props do not change, as they should be only used for initial chart render.

## Migrating from 1.x to 2.0

-   **The `[config]` input moved to the new `scichart-angular-declarative` component.** Replace
    `<scichart-angular [config]="...">` with `<scichart-angular-declarative [config]="...">`; all
    other inputs and outputs are identical. `scichart-angular` now requires `[initChart]` and throws
    a pointer error if it receives `[config]`.
-   **The `scichart` peer dependency is now v6+.** One union `scichart.wasm` replaces the
    `scichart2d.wasm` / `scichart3d.wasm` pair, and the deployed payload is the whole `_wasm`
    directory. Apps staying on scichart 3.x-5.x should stay on scichart-angular 1.x.
-   **`moduleResolution` must understand `exports` maps.** SciChart v6 ships an `exports` field;
    set `"moduleResolution": "bundler"` (or `node16`) in `tsconfig.json` if you are still on the
    classic `"node"` setting.

## Useful Links

### Features & benefits

-   Learn about [features of SciChart.js](https://scichart.com/javascript-chart-features) here

### Onboarding

-   [Tutorials](https://www.scichart.com/documentation/js/v6/get-started/tutorials-js-npm-webpack/tutorial-01-setting-up-npm-project-with-scichart-js/)
-   [Getting Started Guide](https://scichart.com/getting-started/scichart-javascript/)
-   [Documentation](https://www.scichart.com/documentation/js/v6/intro/)
-   [Legacy Documentation](https://www.scichart.com/documentation/js/current/webframe.html)
-   [CodePen, JSFiddle support](https://www.scichart.com/blog/codepen-codesandbox-and-jsfiddle-support-in-scichart-js/)

### Support

-   [Community forums](https://scichart.com/questions)
-   [Stackoverflow tag](https://stackoverflow.com/tags/scichart)
-   [Contact Us (Technical support or sales)](https://scichart.com/contact-us)
