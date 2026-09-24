import { defineConfig } from '@playwright/test';

/**
 * Visual regression tests for the Storybook stories.
 *
 * Rendering is deliberately left on Playwright's default headless renderer, which is SwiftShader
 * (software) even on a machine with a GPU. Software output is reproducible across machines, which
 * is what makes committed baselines shareable - hardware output depends on the GPU and its driver.
 *
 * No --use-gl / --use-angle flags: they force software on some platforms anyway and are a known
 * cause of WebGL context loss in headless Windows.
 */
export default defineConfig({
  testDir: './visual',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],

  use: {
    baseURL: 'http://localhost:6006',
    // Pinned so layout - and therefore the baselines - cannot shift with the window.
    viewport: { width: 800, height: 600 },
    deviceScaleFactor: 1,
    launchOptions: {
      args: [
        // SciChart v6 picks WebGPU when it is available. Force the WebGL path.
        '--disable-features=WebGPU',
        // Chromium evicts the least-recently-used WebGL context past a cap of 16 per renderer,
        // which surfaces as context-loss flakes once several charts have been created.
        '--max-active-webgl-contexts=64',
      ],
    },
  },

  expect: {
    toHaveScreenshot: {
      // Tolerant enough to absorb antialiasing noise, tight enough to catch a real change.
      maxDiffPixelRatio: 0.002,
      threshold: 0.2,
      animations: 'disabled',
      scale: 'css',
    },
  },

  // Baselines are per platform: fonts and the GL stack differ between macOS, Linux and Windows.
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
});
