import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ISciChartSurfaceBase, TSurfaceDefinition } from "scichart";
import { IInitResult, TInitFunction } from "./types";
import { ScichartFallbackComponent } from './scichart-fallback.component';
import { ScichartAngularBaseComponent } from './chart-base.component';
import { createChartFromConfig } from './create-chart-from-config';
import { initChartOnDeclarativeMessage, missingConfigMessage } from './constants';

/**
 * Creates a chart from a definition passed to the `config` input, using the Builder API.
 *
 * Every built-in type is registered for you, so any definition works with no setup. The trade-off
 * is bundle size: using this component pulls the whole type universe into the application bundle.
 * For code-first charts use `scichart-angular` instead.
 */
@Component({
  selector: 'scichart-angular-declarative',
  standalone: true,
  imports: [ CommonModule, ScichartFallbackComponent ],
  template: `
    <div style="position: relative; height: 100%; width: 100%;">
      <div #innerContainerRef [ngStyle]="innerContainerStylesMerged"></div>
      <ng-content *ngIf="isInitialized"></ng-content>
      <div *ngIf="!isInitialized" #fallbackContainer>
        <ng-content select="[fallback]"></ng-content>
      </div>
      <scichart-fallback *ngIf="!hasCustomFallback && !isInitialized"></scichart-fallback>
    </div>
  `,
  styles: ``
})
export class ScichartAngularDeclarativeComponent<
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> extends ScichartAngularBaseComponent<TSurface, TInitResult> {
  @Input() config: string | TSurfaceDefinition = '';

  /** This component builds charts from definitions. Use `scichart-angular` for init functions. */
  @Input() set initChart(value: unknown) {
    if (value) {
      throw new Error(initChartOnDeclarativeMessage);
    }
  }

  protected override resolveInitFunction(): TInitFunction<TSurface, TInitResult> {
    if (!this.config) {
      throw new Error(missingConfigMessage);
    }

    return createChartFromConfig<TSurface>(this.config) as TInitFunction<TSurface, TInitResult>;
  }
}
