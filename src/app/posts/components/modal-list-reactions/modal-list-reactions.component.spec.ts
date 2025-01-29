import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListReactionsComponent } from './modal-list-reactions.component';

describe('ModalListReactionsComponent', () => {
  let component: ModalListReactionsComponent;
  let fixture: ComponentFixture<ModalListReactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalListReactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalListReactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
