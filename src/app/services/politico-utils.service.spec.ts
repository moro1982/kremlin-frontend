import { TestBed } from '@angular/core/testing';

import { PoliticoUtilsService } from './politico-utils.service';

describe('PoliticoUtilsService', () => {
  let service: PoliticoUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoliticoUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
