import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativoBbsComponent } from './comparativo-bbs.component';

describe('ComparativoBbsComponent', () => {
  let component: ComparativoBbsComponent;
  let fixture: ComponentFixture<ComparativoBbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparativoBbsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparativoBbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
