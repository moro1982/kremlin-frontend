import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticoCardComponent } from './politico-card.component';

describe('PoliticoCardComponent', () => {
  let component: PoliticoCardComponent;
  let fixture: ComponentFixture<PoliticoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
