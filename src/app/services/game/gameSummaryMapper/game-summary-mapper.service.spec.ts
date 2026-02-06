import { TestBed } from '@angular/core/testing';

import { GameSummaryMapperService } from './game-summary-mapper.service';

describe('GameSummaryMapperService', () => {
  let service: GameSummaryMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSummaryMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
