import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KampfComponent } from './kampf.component';

describe('KampfComponent', () => {
  let component: KampfComponent;
  let fixture: ComponentFixture<KampfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KampfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KampfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
