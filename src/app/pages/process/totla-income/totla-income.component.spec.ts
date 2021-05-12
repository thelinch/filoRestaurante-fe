import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotlaIncomeComponent } from './totla-income.component';

describe('TotlaIncomeComponent', () => {
  let component: TotlaIncomeComponent;
  let fixture: ComponentFixture<TotlaIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotlaIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotlaIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
