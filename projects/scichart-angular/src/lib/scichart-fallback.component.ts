import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    const loader = new DefaultSciChartLoader();
    const loaderDiv = loader.addChartLoader(this.rootRef.nativeElement, SciChartSurfaceBase.DEFAULT_THEME);
  }
}
