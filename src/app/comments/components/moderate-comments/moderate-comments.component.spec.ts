import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerateCommentsComponent } from './moderate-comments.component';

describe('ModerateCommentsComponent', () => {
  let component: ModerateCommentsComponent;
  let fixture: ComponentFixture<ModerateCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModerateCommentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModerateCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
