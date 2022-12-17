import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationsOfTypeComponent } from './qualifications-of-type.component';

describe('QualificationsOfTypeComponent', () => {
  let component: QualificationsOfTypeComponent;
  let fixture: ComponentFixture<QualificationsOfTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualificationsOfTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualificationsOfTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
