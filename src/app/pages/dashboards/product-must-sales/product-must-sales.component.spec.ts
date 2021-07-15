import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMustSalesComponent } from './product-must-sales.component';

describe('ProductMustSalesComponent', () => {
  let component: ProductMustSalesComponent;
  let fixture: ComponentFixture<ProductMustSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMustSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMustSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
