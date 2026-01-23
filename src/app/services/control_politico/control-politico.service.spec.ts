import { TestBed } from '@angular/core/testing';

import { ControlPoliticoService } from './control-politico.service';

describe('ControlPoliticoService', () => {
  let service: ControlPoliticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlPoliticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
