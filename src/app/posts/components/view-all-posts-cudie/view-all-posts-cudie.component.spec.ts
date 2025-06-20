import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllPostsCudieComponent } from './view-all-posts-cudie.component';

describe('ViewAllPostsCudieComponent', () => {
  let component: ViewAllPostsCudieComponent;
  let fixture: ComponentFixture<ViewAllPostsCudieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllPostsCudieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllPostsCudieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
