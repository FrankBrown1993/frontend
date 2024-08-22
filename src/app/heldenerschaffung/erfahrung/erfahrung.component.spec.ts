import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErfahrungComponent } from './erfahrung.component';

describe('ErfahrungComponent', () => {
  let component: ErfahrungComponent;
  let fixture: ComponentFixture<ErfahrungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErfahrungComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErfahrungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
