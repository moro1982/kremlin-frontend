import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondemnationModalComponent } from './condemnation-modal.component';

describe('CondemnationModalComponent', () => {
  let component: CondemnationModalComponent;
  let fixture: ComponentFixture<CondemnationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CondemnationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CondemnationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
