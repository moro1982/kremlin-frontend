import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluenceAssignmentComponent } from './influence-assignment.component';

describe('InfluenceAssignmentComponent', () => {
  let component: InfluenceAssignmentComponent;
  let fixture: ComponentFixture<InfluenceAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluenceAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfluenceAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
