import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AussehenComponent } from './aussehen.component';

describe('AussehenComponent', () => {
  let component: AussehenComponent;
  let fixture: ComponentFixture<AussehenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AussehenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AussehenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
