import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipsMobilityComponent } from './scholarships-mobility.component';

describe('ScholarshipsMobilityComponent', () => {
  let component: ScholarshipsMobilityComponent;
  let fixture: ComponentFixture<ScholarshipsMobilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScholarshipsMobilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScholarshipsMobilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
