import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeldenbogenComponent } from './heldenbogen.component';

describe('HeldenbogenComponent', () => {
  let component: HeldenbogenComponent;
  let fixture: ComponentFixture<HeldenbogenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeldenbogenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeldenbogenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
