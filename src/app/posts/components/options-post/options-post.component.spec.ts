import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsPostComponent } from './options-post.component';

describe('OptionsPostComponent', () => {
  let component: OptionsPostComponent;
  let fixture: ComponentFixture<OptionsPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptionsPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptionsPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
