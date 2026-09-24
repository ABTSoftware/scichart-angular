This is the Angular wrapper for the SciChart.js library. 
It is a simple example of how to use the SciChart.js library in an Angular application. 
The example demonstrates how to create a simple line chart with a single line series.

The Angular component code can be found in the `projects/scichart-angular` folder.

# ScichartAngularApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run buildLib` from the root to build the scichart-angular library component. The build artifacts will be stored in the `dist` directory.
Run `npm run build` to build the demo project.

## Verify the package

Run `npm run verifyPackage` after a library build to lint the publishable output with `publint` and
`are-the-types-wrong`.

## Publish

Run `npm run buildLib`, then publish from `dist/scichart-angular`:

```
cd dist/scichart-angular
npm publish
```

A bare `npm publish` moves the `latest` tag onto the released version, which is what a stable
release wants. A prerelease must always name its channel, or it would take `latest` from the
current stable and break every existing install:

```
npm publish --tag alpha
```

Publishing requires 2FA. To defer the prompt, stage the publish and approve it afterwards - staging
needs npm 11.15+ and Node 22.14+:

```
npm stage publish . --tag alpha
npm stage list scichart-angular
npm stage approve <stage-id>
```

## Storybook

Run `npm run storybook` to browse the component stories at `http://localhost:6006/`.

## Running tests

Tests run against the stories, in a real browser, via
[@storybook/test-runner](https://github.com/storybookjs/test-runner). Start Storybook first, then:

```
npm run storybook     # in one terminal
npm run test:stories  # in another
```

Every story is checked for three things: the chart finishes initialising (the wrapper's loading
fallback disappears), it renders a canvas with a non-zero on-screen size, and nothing is logged to
the console as an error.

### Visual regression tests

`npm run test:visual` screenshots every story and compares it against a committed baseline, using
the same approach as the core library's own visual suite.

```
npm run storybook       # in one terminal
npm run test:visual     # in another
npm run update-snapshots  # after an intended visual change
```

Baselines live in `visual/__screenshots__/<platform>/` and are committed. Review every changed PNG
before committing it - never bless output you have not looked at.

Two things make the baselines reproducible across machines:

- **Software rendering.** Headless Playwright renders WebGL with SwiftShader even on a machine with
  a GPU, and software output is consistent between machines. No `--use-gl` or `--use-angle` flags
  are passed; they force software on some platforms anyway and can cause WebGL context loss.
- **WebGL, not WebGPU.** SciChart v6 prefers WebGPU where available, so the tests disable it and
  pin `IS_WEB_GPU` off, keeping one renderer in play.

Baselines are still split per platform (`darwin`/`linux`/`win32`) because fonts and the GL stack
differ between operating systems.

The suite also includes a blank-output canary: it asserts a line chart and a pie chart do not
capture identically. Without it, an environment that renders nothing would produce blank images
matching equally blank baselines, and the suite would pass while asserting nothing.
