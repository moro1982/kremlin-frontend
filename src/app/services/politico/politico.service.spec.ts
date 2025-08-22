import { TestBed } from '@angular/core/testing';

import { PoliticoService } from './politico.service';

describe('PoliticoService', () => {
  let service: PoliticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoliticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
