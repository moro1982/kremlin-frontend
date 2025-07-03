import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticosComponent } from './politicos.component';

describe('PoliticosComponent', () => {
  let component: PoliticosComponent;
  let fixture: ComponentFixture<PoliticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
