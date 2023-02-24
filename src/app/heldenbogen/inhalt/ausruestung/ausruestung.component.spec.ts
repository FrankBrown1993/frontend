import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AusruestungComponent } from './ausruestung.component';

describe('AusruestungComponent', () => {
  let component: AusruestungComponent;
  let fixture: ComponentFixture<AusruestungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AusruestungComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AusruestungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
