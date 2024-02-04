import { TestBed } from '@angular/core/testing';

import { ScichartAngularService } from './scichart-angular.service';

describe('ScichartAngularService', () => {
  let service: ScichartAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScichartAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
