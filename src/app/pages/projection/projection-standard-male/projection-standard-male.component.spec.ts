import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionStandardMaleComponent } from './projection-standard-male.component';

describe('ProjectionStandardMaleComponent', () => {
  let component: ProjectionStandardMaleComponent;
  let fixture: ComponentFixture<ProjectionStandardMaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectionStandardMaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectionStandardMaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
