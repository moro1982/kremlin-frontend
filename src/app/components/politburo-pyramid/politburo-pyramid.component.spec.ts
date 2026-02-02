import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolitburoPyramidComponent } from './politburo-pyramid.component';

describe('PolitburoPyramidComponent', () => {
  let component: PolitburoPyramidComponent;
  let fixture: ComponentFixture<PolitburoPyramidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolitburoPyramidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolitburoPyramidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
