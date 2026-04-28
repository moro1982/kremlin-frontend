import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExileEscapeModalComponent } from './exile-escape-modal.component';

describe('ExileEscapeModalComponent', () => {
  let component: ExileEscapeModalComponent;
  let fixture: ComponentFixture<ExileEscapeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExileEscapeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExileEscapeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
