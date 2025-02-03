import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePhotosSectionComponent } from './home-photos-section.component';

describe('HomePhotosSectionComponent', () => {
  let component: HomePhotosSectionComponent;
  let fixture: ComponentFixture<HomePhotosSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePhotosSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomePhotosSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
