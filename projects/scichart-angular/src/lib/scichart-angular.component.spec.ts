import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScichartAngularComponent } from './scichart-angular.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
