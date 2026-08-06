import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegateCondemnationModalComponent } from './negate-condemnation-modal.component';

describe('NegateCondemnationModalComponent', () => {
  let component: NegateCondemnationModalComponent;
  let fixture: ComponentFixture<NegateCondemnationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NegateCondemnationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NegateCondemnationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
