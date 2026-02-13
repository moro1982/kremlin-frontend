import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclareInfluenceModalComponent } from './declare-influence-modal.component';

describe('DeclareInfluenceModalComponent', () => {
  let component: DeclareInfluenceModalComponent;
  let fixture: ComponentFixture<DeclareInfluenceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclareInfluenceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclareInfluenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
