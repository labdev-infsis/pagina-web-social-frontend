import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllPostsConveniosComponent } from './view-all-posts-convenios.component';

describe('ViewAllPostsConveniosComponent', () => {
  let component: ViewAllPostsConveniosComponent;
  let fixture: ComponentFixture<ViewAllPostsConveniosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllPostsConveniosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllPostsConveniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
