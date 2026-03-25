import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurgeModalComponent } from './purge-modal.component';

describe('PurgeModalComponent', () => {
  let component: PurgeModalComponent;
  let fixture: ComponentFixture<PurgeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurgeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurgeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
