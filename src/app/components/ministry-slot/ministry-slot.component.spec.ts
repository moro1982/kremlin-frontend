import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistrySlotComponent } from './ministry-slot.component';

describe('MinistrySlotComponent', () => {
  let component: MinistrySlotComponent;
  let fixture: ComponentFixture<MinistrySlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinistrySlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinistrySlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
