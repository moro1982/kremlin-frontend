import { TestBed } from '@angular/core/testing';

import { GameContextMapperService } from './game-context-mapper.service';

describe('GameContextMapperService', () => {
  let service: GameContextMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameContextMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
