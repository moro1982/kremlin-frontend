import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticoSidePanelComponent } from './politico-side-panel.component';

describe('PoliticoSidePanelComponent', () => {
  let component: PoliticoSidePanelComponent;
  let fixture: ComponentFixture<PoliticoSidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticoSidePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticoSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
