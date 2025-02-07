import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPostDetailComponent } from './view-post-detail.component';

describe('ViewPostDetailComponent', () => {
  let component: ViewPostDetailComponent;
  let fixture: ComponentFixture<ViewPostDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPostDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
