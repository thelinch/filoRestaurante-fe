import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCustomGenericComponent } from './table-custom-generic.component';

describe('TableCustomGenericComponent', () => {
  let component: TableCustomGenericComponent;
  let fixture: ComponentFixture<TableCustomGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableCustomGenericComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCustomGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
