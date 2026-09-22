export const wrongInitResultMessage = `"initChart" function should resolve to an object with "sciChartSurface" property ({ sciChartSurface })`;

export const missingInitChartMessage = `"scichart-angular" requires an "initChart" input.`;

export const configMovedMessage = `The "config" input has moved to the "scichart-angular-declarative" component. Replace <scichart-angular [config]="..."> with <scichart-angular-declarative [config]="...">.`;

export const missingConfigMessage = `"scichart-angular-declarative" requires a "config" input.`;

export const initChartOnDeclarativeMessage = `"scichart-angular-declarative" takes a chart definition via "config". Use <scichart-angular [initChart]="..."> for initialization functions.`;
