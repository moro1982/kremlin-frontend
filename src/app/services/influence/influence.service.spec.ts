import { TestBed } from '@angular/core/testing';

import { InfluenceService } from './influence.service';

describe('InfluenceService', () => {
  let service: InfluenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfluenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
