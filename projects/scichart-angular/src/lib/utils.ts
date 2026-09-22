import { buildChart, generateGuid, registerAllTypes } from "scichart";
import type { ISciChartSurfaceBase, TSurfaceDefinition } from "scichart";

export const createChartRoot = () => {
    // check if SSR
    if (typeof window === "undefined") {
        return null;
    }

    const internalRootElement = document.createElement("div") as HTMLDivElement;
    // generate or provide a unique root element id to avoid chart rendering collisions
    internalRootElement.id = `chart-root-${generateGuid()}`;
    internalRootElement.style.width = "100%";
    internalRootElement.style.height = "100%";
    return internalRootElement;
};

export function createChartFromConfig<TSurface extends ISciChartSurfaceBase>(
    config: string | TSurfaceDefinition
) {
    return async (chartRoot: string | HTMLDivElement) => {
        // Since SciChart v6 the Builder API registers nothing on import: a type named only as a
        // string in a definition cannot pull its class into the bundle. registerAllTypes is
        // idempotent, so calling it per chart is safe.
        registerAllTypes();

        // Potentially should return 2D, 3D, or Pie Chart
        // TODO add better type handling
        const chart = (await buildChart(chartRoot, config as string)) as any;
        if ("sciChartSurface" in chart) {
            // 2D Chart
            return { sciChartSurface: chart.sciChartSurface as TSurface };
        } else if ("sciChart3DSurface" in chart) {
            // 3D Chart
            return { sciChartSurface: chart.sciChart3DSurface as TSurface };
        } else {
            // Pie Chart
            return { sciChartSurface: chart as TSurface };
        }
    };
}
