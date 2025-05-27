import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPagesComponent } from './navbar-pages.component';

describe('NavbarPagesComponent', () => {
  let component: NavbarPagesComponent;
  let fixture: ComponentFixture<NavbarPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarPagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
