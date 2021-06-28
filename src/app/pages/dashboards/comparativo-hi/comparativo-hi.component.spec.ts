import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativoHiComponent } from './comparativo-hi.component';

describe('ComparativoHiComponent', () => {
  let component: ComparativoHiComponent;
  let fixture: ComponentFixture<ComparativoHiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparativoHiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparativoHiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
