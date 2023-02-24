import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitelbereichComponent } from './titelbereich.component';

describe('TitelbereichComponent', () => {
  let component: TitelbereichComponent;
  let fixture: ComponentFixture<TitelbereichComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitelbereichComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitelbereichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
