import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatesDropDownComponent } from './states-drop-down.component';

describe('StatesDropDownComponent', () => {
  let component: StatesDropDownComponent;
  let fixture: ComponentFixture<StatesDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatesDropDownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatesDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
