import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOrdersComponent } from './type-orders.component';

describe('TypeOrdersComponent', () => {
  let component: TypeOrdersComponent;
  let fixture: ComponentFixture<TypeOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
