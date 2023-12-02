import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModValuesComponent } from './mod-values.component';

describe('ModValuesComponent', () => {
  let component: ModValuesComponent;
  let fixture: ComponentFixture<ModValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModValuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
