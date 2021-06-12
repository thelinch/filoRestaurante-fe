import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorcentajeNacimientoComponent } from './porcentaje-nacimiento.component';

describe('PorcentajeNacimientoComponent', () => {
  let component: PorcentajeNacimientoComponent;
  let fixture: ComponentFixture<PorcentajeNacimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PorcentajeNacimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PorcentajeNacimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
