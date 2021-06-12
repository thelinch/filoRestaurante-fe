import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorcentajeHiComponent } from './porcentaje-hi.component';

describe('PorcentajeHiComponent', () => {
  let component: PorcentajeHiComponent;
  let fixture: ComponentFixture<PorcentajeHiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PorcentajeHiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PorcentajeHiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
