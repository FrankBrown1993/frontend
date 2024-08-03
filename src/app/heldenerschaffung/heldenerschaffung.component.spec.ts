import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeldenerschaffungComponent } from './heldenerschaffung.component';

describe('HeldenerschaffungComponent', () => {
  let component: HeldenerschaffungComponent;
  let fixture: ComponentFixture<HeldenerschaffungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeldenerschaffungComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeldenerschaffungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
