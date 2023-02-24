import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalenteComponent } from './talente.component';

describe('TalenteComponent', () => {
  let component: TalenteComponent;
  let fixture: ComponentFixture<TalenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
