import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditPostComponent } from './modal-edit-post.component';

describe('ModalEditPostComponent', () => {
  let component: ModalEditPostComponent;
  let fixture: ComponentFixture<ModalEditPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEditPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalEditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
