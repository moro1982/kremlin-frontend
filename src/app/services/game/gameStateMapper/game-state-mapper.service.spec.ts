import { TestBed } from '@angular/core/testing';

import { GameStateMapperService } from './game-state-mapper.service';

describe('GameStateMapperService', () => {
  let service: GameStateMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
