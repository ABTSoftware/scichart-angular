import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScichartAngularDeclarativeComponent } from './scichart-angular-declarative.component';
import { initChartOnDeclarativeMessage, missingConfigMessage } from './constants';

describe('ScichartAngularDeclarativeComponent', () => {
  let fixture: ComponentFixture<ScichartAngularDeclarativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScichartAngularDeclarativeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScichartAngularDeclarativeComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should require a config input', () => {
    expect(() => fixture.detectChanges()).toThrowError(missingConfigMessage);
  });

  it('should point at the init-function component when given an initChart', () => {
    expect(() => {
      fixture.componentInstance.initChart = () => Promise.resolve({} as never);
    }).toThrowError(initChartOnDeclarativeMessage);
  });
});
