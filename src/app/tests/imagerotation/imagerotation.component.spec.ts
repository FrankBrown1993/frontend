import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagerotationComponent } from './imagerotation.component';

describe('ImagerotationComponent', () => {
  let component: ImagerotationComponent;
  let fixture: ComponentFixture<ImagerotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagerotationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagerotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
