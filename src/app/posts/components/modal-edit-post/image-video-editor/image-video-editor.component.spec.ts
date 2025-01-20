import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageVideoEditorComponent } from './image-video-editor.component';

describe('ImageVideoEditorComponent', () => {
  let component: ImageVideoEditorComponent;
  let fixture: ComponentFixture<ImageVideoEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageVideoEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageVideoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
