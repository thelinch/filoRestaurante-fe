import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionStandardFemaleComponent } from './projection-standard-female.component';

describe('ProjectionStandardFemaleComponent', () => {
  let component: ProjectionStandardFemaleComponent;
  let fixture: ComponentFixture<ProjectionStandardFemaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectionStandardFemaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectionStandardFemaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
