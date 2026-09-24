/**
 * Smoke tests for every story: the chart must initialise and actually draw something.
 *
 * The wrapper renders `<scichart-fallback>` while the surface is being created and removes it once
 * the init function resolves, so its disappearance is the ready signal - no arbitrary waits.
 *
 * Plain JavaScript on purpose: the test-runner compiles its config with a bundled swc that rejects
 * the "es2023" target it infers on current Node versions.
 */

/** How long a chart is given to load its wasm and draw the first frame. */
const CHART_READY_TIMEOUT = 30000;

/** Console errors seen while the current story was loading. */
let consoleErrors = [];

module.exports = {
  async preVisit(page) {
    consoleErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
  },

  async postVisit(page, context) {
    // The chart is ready when the wrapper has torn down its loading fallback.
    await page.waitForFunction(
      () => document.querySelector('scichart-fallback') === null,
      undefined,
      { timeout: CHART_READY_TIMEOUT }
    );

    // The chart must have a canvas with real on-screen size. This is what catches a collapsed
    // layout, which renders the chart invisible while everything else looks healthy.
    //
    // Deliberately no pixel sampling: reading back from a WebGL canvas returns an empty buffer
    // unless it was created with preserveDrawingBuffer, so any "is it blank" check on the drawn
    // content is timing-dependent and flaky.
    const painted = await page.evaluate(() =>
      Array.from(document.querySelectorAll('canvas'))
        .map((canvas) => {
          const rect = canvas.getBoundingClientRect();
          return { width: canvas.width, height: canvas.height, cssWidth: rect.width, cssHeight: rect.height };
        })
        .filter((size) => size.width > 0 && size.height > 0 && size.cssWidth > 0 && size.cssHeight > 0)
    );

    if (painted.length === 0) {
      throw new Error(
        `${context.id}: no canvas with a non-zero size - the chart did not render or its container collapsed`
      );
    }

    if (consoleErrors.length > 0) {
      throw new Error(`${context.id}: console errors\n  ${consoleErrors.join('\n  ')}`);
    }
  },
};
