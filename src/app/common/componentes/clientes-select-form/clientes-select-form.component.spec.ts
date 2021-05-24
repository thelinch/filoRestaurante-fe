import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesSelectFormComponent } from './clientes-select-form.component';

describe('ClientesSelectFormComponent', () => {
  let component: ClientesSelectFormComponent;
  let fixture: ComponentFixture<ClientesSelectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientesSelectFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesSelectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
