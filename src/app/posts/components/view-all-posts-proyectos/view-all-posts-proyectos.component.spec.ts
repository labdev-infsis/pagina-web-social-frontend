import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllPostsProyectosComponent } from './view-all-posts-proyectos.component';

describe('ViewAllPostsProyectosComponent', () => {
  let component: ViewAllPostsProyectosComponent;
  let fixture: ComponentFixture<ViewAllPostsProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllPostsProyectosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllPostsProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
