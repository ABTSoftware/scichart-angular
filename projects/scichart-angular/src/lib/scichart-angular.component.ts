import {Attribute, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ISciChart2DDefinition,
  SciChartSurface, TSurfaceDefinition
} from "scichart";
import {IInitResult, TInitFunction} from "./types";
import { ScichartFallbackComponent } from './scichart-fallback.component';
import {createChartFromConfig, createChartRoot} from "./utils";
import { wrongInitResultMessage } from './constants';

@Component({
  selector: 'lib-scichart-angular',
  standalone: true,
  imports: [ CommonModule, ScichartFallbackComponent ],
  template: `
    <div style="position: relative; height: 100%; width: 100%;">
      <div #innerContainerRef [ngStyle]="innerContainerStylesMerged"></div>
      <ng-content *ngIf="isInitialized" />
      <scichart-fallback *ngIf="!isInitialized" />
    </div>
  `,
  styles: ``
})
export class ScichartAngularComponent {
  title = 'lib-scichart-angular';

  @ViewChild('innerContainerRef') innerContainerRef!: ElementRef<HTMLDivElement>;

  @Input() initChart!: TInitFunction<SciChartSurface, IInitResult<SciChartSurface>>;
  @Input() config: any = ''; //TODO: type the config
  @Input() innerContainerStyles: Object | null = null;

  // @Input() fallback: any = ScichartFallbackComponent; //TODO: pass custom component for fallback

  @Output() onInit: EventEmitter<SciChartSurface> = new EventEmitter<SciChartSurface>();
  @Output() onDelete: EventEmitter<SciChartSurface> = new EventEmitter<SciChartSurface>();

  public innerContainerStylesMerged: Object = {
    height: '100%',
    width: '100%',
  };
  public isInitialized: boolean = false;
  private isCancelled: boolean = false;
  private chartRoot = createChartRoot();

  private sciChartSurfaceRef: SciChartSurface | null = null;
  private initResultRef: IInitResult | null = null;

  ngOnInit(): void {
    if (this.innerContainerStyles) {
      this.innerContainerStylesMerged = { ...this.innerContainerStylesMerged, ...this.innerContainerStyles };
    }
  }

  ngAfterViewInit(): void {
    console.log('this.innerContainerStyles', this.innerContainerStyles);
    const rootElement = this.innerContainerRef.nativeElement;
    rootElement!.appendChild(this.chartRoot as Node);

    const initializationFunction = this.initChart
      ? (this.initChart as TInitFunction<SciChartSurface, IInitResult<SciChartSurface>>)
      : createChartFromConfig<SciChartSurface>(this.config);

    const runInit = async (): Promise<IInitResult<SciChartSurface>> =>
      new Promise((resolve, reject) =>
        initializationFunction(this.chartRoot as HTMLDivElement)
          .then(initResult => {
            if (!initResult.sciChartSurface) {
              throw new Error(wrongInitResultMessage);
            }
            this.sciChartSurfaceRef = initResult.sciChartSurface as SciChartSurface;
            this.initResultRef = initResult as IInitResult;

            if (!this.isCancelled) {
              this.isInitialized = true;
            }

            resolve(initResult);
          })
          .catch(reject)
      ) as Promise<IInitResult<SciChartSurface>>;

    runInit().then(initResult => {
      console.log('initResult!!!', initResult);
      if (this.onInit && this.isInitialized) {
        this.onInit.emit(initResult.sciChartSurface);
      }
    });
  }

  ngOnDestroy(): void {
    this.isCancelled = true;

    if (this.onDelete && this.isInitialized) {
      this.onDelete.emit(this.sciChartSurfaceRef as SciChartSurface);
    }

    this.sciChartSurfaceRef?.delete();
  }
}
