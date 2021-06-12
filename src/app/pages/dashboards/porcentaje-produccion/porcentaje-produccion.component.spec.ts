import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorcentajeProduccionComponent } from './porcentaje-produccion.component';

describe('PorcentajeProduccionComponent', () => {
  let component: PorcentajeProduccionComponent;
  let fixture: ComponentFixture<PorcentajeProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PorcentajeProduccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PorcentajeProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
