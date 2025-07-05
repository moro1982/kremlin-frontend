import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryControlComponent } from './ministry-control.component';

describe('MinistryControlComponent', () => {
  let component: MinistryControlComponent;
  let fixture: ComponentFixture<MinistryControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinistryControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinistryControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
