import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclareControlComponent } from './declare-control.component';

describe('DeclareControlComponent', () => {
  let component: DeclareControlComponent;
  let fixture: ComponentFixture<DeclareControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclareControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclareControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
