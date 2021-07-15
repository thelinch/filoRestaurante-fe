import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceUserMozoComponent } from './performance-user-mozo.component';

describe('PerformanceUserMozoComponent', () => {
  let component: PerformanceUserMozoComponent;
  let fixture: ComponentFixture<PerformanceUserMozoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceUserMozoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceUserMozoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
