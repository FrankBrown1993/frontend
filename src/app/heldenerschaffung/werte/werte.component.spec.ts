import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WerteComponent } from './werte.component';

describe('WerteComponent', () => {
  let component: WerteComponent;
  let fixture: ComponentFixture<WerteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WerteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WerteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
