import { TestBed } from '@angular/core/testing';

import { IndianTimeService } from './indian-time.service';

describe('IndianTimeService', () => {
  let service: IndianTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndianTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
