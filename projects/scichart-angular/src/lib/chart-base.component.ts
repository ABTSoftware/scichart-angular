import { Directive, ElementRef, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { ISciChartSurfaceBase } from "scichart";
import { IInitResult, TInitFunction } from "./types";
import { createChartRoot } from "./utils";
import { wrongInitResultMessage } from './constants';
import "./configure-defaults";

/**
 * Shared lifecycle for the chart components.
 *
 * Holds the chart root, the fallback handling and the create/delete lifecycle. Subclasses supply
 * the initialization function only, which is what keeps the Builder API out of the components that
 * do not need it.
 */
@Directive()
export abstract class ScichartAngularBaseComponent<
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> {
  @ViewChild('innerContainerRef') innerContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('fallbackContainer') fallbackContainer!: ElementRef<HTMLDivElement>;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {}

  @Input() innerContainerStyles: Object | null = null;

  @Output() onInit: EventEmitter<TInitResult> = new EventEmitter<TInitResult>();
  @Output() onDelete: EventEmitter<TInitResult> = new EventEmitter<TInitResult>();

  public innerContainerStylesMerged: Object = {
    height: '100%',
    width: '100%',
  };
  public isInitialized: boolean = false;
  public hasCustomFallback: boolean = false;
  protected isCancelled: boolean = false;
  protected chartRoot = createChartRoot();

  protected sciChartSurfaceRef: TSurface | null = null;
  protected initResultRef: TInitResult | null = null;

  /** Returns the function used to create the chart. Throws if the component is misconfigured. */
  protected abstract resolveInitFunction(): TInitFunction<TSurface, TInitResult>;

  ngOnInit(): void {
    if (this.innerContainerStyles) {
      this.innerContainerStylesMerged = { ...this.innerContainerStylesMerged, ...this.innerContainerStyles };
    }
  }

  ngAfterViewInit(): void {
    // SSR guard - only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const rootElement = this.innerContainerRef.nativeElement;
    rootElement!.appendChild(this.chartRoot as Node);

    const fallbackElement = this.fallbackContainer.nativeElement;
    if (fallbackElement.childNodes.length > 0) {
      this.hasCustomFallback = true;
    }

    const initializationFunction = this.resolveInitFunction();

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
      // SSR guard in afterInit callback
      if (isPlatformBrowser(this.platformId) && this.onInit && this.isInitialized) {
        this.onInit.emit(initResult);
      }
    });
  }

  ngOnDestroy(): void {
    this.isCancelled = true;

    // SSR guard - only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.onDelete && this.isInitialized) {
      this.onDelete.emit(this.initResultRef as TInitResult);
    }

    this.sciChartSurfaceRef?.delete();
  }
}
