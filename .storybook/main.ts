import type { StorybookConfig } from "@storybook/angular";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  // Serve the wasm payload straight from the installed package. Since v6 the engine is modular —
  // a core plus side modules fetched at runtime — so the whole directory is served, not one file.
  staticDirs: [{ from: "../node_modules/scichart/_wasm", to: "/" }],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
