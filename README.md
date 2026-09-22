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
npm publish --tag alpha
```

The `--tag` matters. Publishing without it moves the `latest` tag onto the released version, so
prerelease lines must always name their channel (`alpha` or `beta`). A stable release is published
with no tag.

## Running unit tests

Run `npm run test:app` for the demo app specs and `npm run test:lib` for the library specs, both
via [Karma](https://karma-runner.github.io).

## Storybook

Run `npm run storybook` to browse the component stories at `http://localhost:6006/`.
