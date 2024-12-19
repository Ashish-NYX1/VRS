import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POLineItemListComponent } from './po-line-item-list.component';

describe('POLineItemListComponent', () => {
  let component: POLineItemListComponent;
  let fixture: ComponentFixture<POLineItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POLineItemListComponent]
    });
    fixture = TestBed.createComponent(POLineItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
