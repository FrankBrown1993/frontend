import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KulturComponent } from './kultur.component';

describe('KulturComponent', () => {
  let component: KulturComponent;
  let fixture: ComponentFixture<KulturComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KulturComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KulturComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
