import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListReactionsCommentsComponent } from './modal-list-reactions-comments.component';

describe('ModalListReactionsCommentsComponent', () => {
  let component: ModalListReactionsCommentsComponent;
  let fixture: ComponentFixture<ModalListReactionsCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalListReactionsCommentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalListReactionsCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
