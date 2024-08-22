import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeziesComponent } from './spezies.component';

describe('SpeziesComponent', () => {
  let component: SpeziesComponent;
  let fixture: ComponentFixture<SpeziesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeziesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeziesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
