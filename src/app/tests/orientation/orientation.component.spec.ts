import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientationComponent } from './orientation.component';

describe('OrientationComponent', () => {
  let component: OrientationComponent;
  let fixture: ComponentFixture<OrientationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrientationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrientationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
