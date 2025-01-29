import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeletePostComponent } from './modal-delete-post.component';

describe('ModalDeletePostComponent', () => {
  let component: ModalDeletePostComponent;
  let fixture: ComponentFixture<ModalDeletePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDeletePostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDeletePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
