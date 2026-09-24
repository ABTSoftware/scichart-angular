import { expect, test, type Page } from '@playwright/test';

/** How long a chart is given to load its wasm and paint. */
const CHART_READY_TIMEOUT = 30_000;

/** Extra frames to let 3D lighting settle before capturing. */
const SETTLE_FRAMES = 4;

type TStoryIndex = {
  entries: Record<string, { id: string; type: string }>;
};

/**
 * Opens a story in isolation and waits until its chart has painted.
 *
 * The wrapper renders `<scichart-fallback>` while the surface is being created and removes it once
 * the init function resolves, so its disappearance is the ready signal.
 */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?viewMode=story&id=${id}`, { waitUntil: 'domcontentloaded' });

  await page.waitForFunction(() => document.querySelector('scichart-fallback') === null, undefined, {
    timeout: CHART_READY_TIMEOUT,
  });

  // The first painted frame is not necessarily the settled one - 3D lighting in particular keeps
  // refining for a few frames.
  await page.evaluate(async (frames) => {
    for (let i = 0; i < frames; i++) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
  }, SETTLE_FRAMES);
}

test.beforeEach(async ({ page }) => {
  // SciChart reads this once at module load, so it has to be set before any navigation.
  await page.addInitScript(() => localStorage.setItem('IS_WEB_GPU', '0'));
});

test('every story matches its baseline', async ({ page, request }) => {
  const index: TStoryIndex = await (await request.get('/index.json')).json();
  const storyIds = Object.values(index.entries)
    .filter((entry) => entry.type === 'story')
    .map((entry) => entry.id)
    .sort();

  expect(storyIds.length, 'no stories found in the Storybook index').toBeGreaterThan(0);

  for (const id of storyIds) {
    await openStory(page, id);
    // Soft so one changed story does not hide the rest.
    await expect.soft(page.locator('#storybook-root')).toHaveScreenshot(`${id}.png`);
  }
});

/**
 * Blank-output canary.
 *
 * If the environment renders nothing, every capture is identically blank and therefore matches an
 * equally blank baseline - the suite goes green while asserting nothing. Two visually different
 * charts must not produce the same image.
 */
test('different stories render different output', async ({ page }) => {
  await openStory(page, 'scichartangular--chart-with-init-function');
  const lineChart = await page.locator('#storybook-root').screenshot();

  await openStory(page, 'scichartangular--chart-with-pie-surface');
  const pieChart = await page.locator('#storybook-root').screenshot();

  expect(
    Buffer.compare(lineChart, pieChart),
    'a line chart and a pie chart captured identically - the charts are probably not rendering'
  ).not.toBe(0);
});
