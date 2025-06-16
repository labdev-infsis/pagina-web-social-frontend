import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllPostsBecasComponent } from './view-all-posts-becas.component';

describe('ViewAllPostsBecasComponent', () => {
  let component: ViewAllPostsBecasComponent;
  let fixture: ComponentFixture<ViewAllPostsBecasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllPostsBecasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllPostsBecasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
