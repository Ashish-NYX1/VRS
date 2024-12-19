import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitVendorResponseComponent } from './submit-vendor-response.component';

describe('SubmitVendorResponseComponent', () => {
  let component: SubmitVendorResponseComponent;
  let fixture: ComponentFixture<SubmitVendorResponseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitVendorResponseComponent]
    });
    fixture = TestBed.createComponent(SubmitVendorResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
