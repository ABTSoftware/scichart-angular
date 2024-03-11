import { Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ISciChartSurfaceBase,
} from "scichart";
import { IInitResult, TInitFunction } from "./types";
import { ScichartFallbackComponent } from './scichart-fallback.component';
import { createChartFromConfig, createChartRoot } from "./utils";
import { wrongInitResultMessage } from './constants';

@Component({
  selector: 'scichart-angular',
  standalone: true,
  imports: [ CommonModule, ScichartFallbackComponent ],
  template: `
    <div style="position: relative; height: 100%; width: 100%;">
      <div #innerContainerRef [ngStyle]="innerContainerStylesMerged"></div>
      <ng-content *ngIf="isInitialized" />
      <div *ngIf="!isInitialized" #fallbackContainer>
        <ng-content select="[fallback]"></ng-content>
      </div>
      <scichart-fallback *ngIf="!hasCustomFallback && !isInitialized" />
    </div>
  `,
  styles: ``
})
export class ScichartAngularComponent<
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> {
  title = 'lib-scichart-angular';

  @ViewChild('innerContainerRef') innerContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('fallbackContainer') fallbackContainer!: ElementRef<HTMLDivElement>;

  @Input() initChart!: TInitFunction<TSurface, TInitResult>;
  @Input() config: any = ''; //TODO: type the config
  @Input() innerContainerStyles: Object | null = null;

  // @Input() fallback: any = ScichartFallbackComponent; //TODO: pass custom component for fallback

  @Output() onInit: EventEmitter<TInitResult> = new EventEmitter<TInitResult>();
  @Output() onDelete: EventEmitter<TInitResult> = new EventEmitter<TInitResult>();

  public innerContainerStylesMerged: Object = {
    height: '100%',
    width: '100%',
  };
  public isInitialized: boolean = false;
  public hasCustomFallback: boolean = false;
  private isCancelled: boolean = false;
  private chartRoot = createChartRoot();

  private sciChartSurfaceRef: TSurface | null = null;
  private initResultRef: TInitResult | null = null;

  ngOnInit(): void {
    if (this.innerContainerStyles) {
      this.innerContainerStylesMerged = { ...this.innerContainerStylesMerged, ...this.innerContainerStyles };
    }
  }

  ngAfterViewInit(): void {
    const rootElement = this.innerContainerRef.nativeElement;
    rootElement!.appendChild(this.chartRoot as Node);

    const fallbackElement = this.fallbackContainer.nativeElement;
    if (fallbackElement.childNodes.length > 0) {
      this.hasCustomFallback = true;
    }

    const initializationFunction = this.initChart
      ? (this.initChart)
      : createChartFromConfig<TSurface>(this.config) as TInitFunction<TSurface, TInitResult>;

    const runInit = async (): Promise<TInitResult> =>
      new Promise((resolve, reject) =>
        initializationFunction(this.chartRoot as HTMLDivElement)
          .then((initResult: TInitResult) => {
            if (!initResult.sciChartSurface) {
              throw new Error(wrongInitResultMessage);
            }
            this.sciChartSurfaceRef = initResult.sciChartSurface as TSurface;
            this.initResultRef = initResult as TInitResult;

            if (!this.isCancelled) {
              this.isInitialized = true;
            }

            resolve(initResult);
          })
          .catch(reject)
      );

    runInit().then(initResult => {
      console.log('initResult!!!', initResult);
      if (this.onInit && this.isInitialized) {
        this.onInit.emit(initResult);
      }
    });
  }

  ngOnDestroy(): void {
    this.isCancelled = true;

    if (this.onDelete && this.isInitialized) {
      this.onDelete.emit(this.initResultRef as TInitResult);
    }

    this.sciChartSurfaceRef?.delete();
  }
}
