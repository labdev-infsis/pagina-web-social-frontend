import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupInfoUserComponent } from './popup-info-user.component';

describe('PopupInfoUserComponent', () => {
  let component: PopupInfoUserComponent;
  let fixture: ComponentFixture<PopupInfoUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupInfoUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupInfoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
