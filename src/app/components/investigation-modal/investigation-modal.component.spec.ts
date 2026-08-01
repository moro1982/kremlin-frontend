import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationModalComponent } from './investigation-modal.component';

describe('InvestigationModalComponent', () => {
  let component: InvestigationModalComponent;
  let fixture: ComponentFixture<InvestigationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestigationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
