import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {DefaultSciChartLoader, SciChartSurfaceBase} from "scichart";

@Component({
  selector: 'scichart-fallback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #rootRef [ngStyle]="style"></div>
  `,
})
export class ScichartFallbackComponent {
  title = 'scichart-fallback';

  @ViewChild('rootRef') rootRef!: ElementRef<HTMLDivElement>;
  
  private loader: DefaultSciChartLoader | null = null;
  private loaderDiv: HTMLElement | null = null;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public style: Object = {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    textAlign: "center",
    background: SciChartSurfaceBase.DEFAULT_THEME.sciChartBackground
  };

  ngAfterViewInit(): void {
    // SSR guard - only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    this.loader = new DefaultSciChartLoader();
    this.loaderDiv = this.loader.addChartLoader(this.rootRef.nativeElement, SciChartSurfaceBase.DEFAULT_THEME);
  }
  
  ngOnDestroy(): void {
    // SSR guard - only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    if (this.loader && this.loaderDiv && this.rootRef) {
      this.loader.removeChartLoader(this.rootRef.nativeElement, this.loaderDiv);
    }
  }
}
