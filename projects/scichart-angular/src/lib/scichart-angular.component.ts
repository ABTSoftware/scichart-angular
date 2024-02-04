import {Component, EventEmitter, Output} from '@angular/core';
import {
  SciChartSurface
} from "scichart";

@Component({
  selector: 'lib-scichart-angular',
  standalone: true,
  imports: [],
  template: `
    <div>
      <div id="scichart-root" style="width: 100%; height: 100%;"></div>
    </div>
  `,
  styles: ``
})
export class ScichartAngularComponent {
  title = 'lib-scichart-angular';

  @Output() onChartInit: EventEmitter<SciChartSurface> = new EventEmitter<SciChartSurface>();

  ngOnInit(): void {
    console.log("Angular: ngOnInit");
    this.onChartInit.emit();
  }
}
