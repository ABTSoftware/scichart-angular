import { ISciChartSurfaceBase, SciChartSurface, TSurfaceDefinition } from "scichart";

/** Describes the core return type of a chart initialization function */
export interface IInitResult<TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase> {
  sciChartSurface: TSurface;
}

/**
 * Describes the type of a chart initialization function
 * @param rootElement the internal element that should be used to create a chart
 * @returns a Promise with the initialization result object containing the created surface reference as `sciChartSurface` property
 */
export type TInitFunction<
  TSurface extends ISciChartSurfaceBase = SciChartSurface,
  TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
  > = (rootElement: string | HTMLDivElement) => Promise<TInitResult>;
