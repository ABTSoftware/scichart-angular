import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ISciChartSurfaceBase } from 'scichart';

import { ScichartAngularComponent } from './scichart-angular.component';
import { configMovedMessage } from './constants';

/** A surface stub, so the lifecycle can be exercised without loading the wasm engine. */
const createStubSurface = (): ISciChartSurfaceBase =>
  ({ delete: () => undefined }) as unknown as ISciChartSurfaceBase;

describe('ScichartAngularComponent', () => {
  let component: ScichartAngularComponent;
  let fixture: ComponentFixture<ScichartAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScichartAngularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScichartAngularComponent);
    component = fixture.componentInstance;
    component.initChart = async () => ({ sciChartSurface: createStubSurface() });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should point at the declarative component when given a config', () => {
    expect(() => {
      component.config = { xAxes: [] };
    }).toThrowError(configMovedMessage);
  });
});
