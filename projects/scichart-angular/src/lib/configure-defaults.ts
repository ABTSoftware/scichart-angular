import { SciChartDefaults, SciChartSurface } from "scichart";

/**
 * Applies the default SciChart configuration used by this wrapper.
 *
 * Runs once when this module is imported. Any `SciChartSurface.configure()` or
 * `loadWasmFromCDN()` call made by the host application runs afterwards and takes precedence.
 */
export function configureSciChartDefaults(): void {
    // Since SciChart v6 a single binary carries both the 2D and the 3D engine, so one call serves
    // both. Calling SciChart3DSurface.configure() as well would overwrite this one.
    SciChartSurface.configure({ wasmUrl: "/scichart.wasm" });

    // The wrapper renders its own fallback, so the loader built into the core is disabled.
    SciChartDefaults.defaultLoader = false;
    SciChartDefaults.disableAspect = true;
}

configureSciChartDefaults();
