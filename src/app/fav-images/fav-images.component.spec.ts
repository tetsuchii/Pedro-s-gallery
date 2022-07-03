import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavImagesComponent } from './fav-images.component';

describe('FavImagesComponent', () => {
  let component: FavImagesComponent;
  let fixture: ComponentFixture<FavImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
