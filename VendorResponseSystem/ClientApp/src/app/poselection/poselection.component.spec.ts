import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSelectionComponent } from './poselection.component';

describe('POSelectionComponent', () => {
  let component: POSelectionComponent;
  let fixture: ComponentFixture<POSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POSelectionComponent]
    });
    fixture = TestBed.createComponent(POSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
