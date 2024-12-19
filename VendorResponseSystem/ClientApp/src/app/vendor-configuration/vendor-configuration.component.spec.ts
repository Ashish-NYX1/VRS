import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorConfigurationComponent } from './vendor-configuration.component';

describe('VendorConfigurationComponent', () => {
  let component: VendorConfigurationComponent;
  let fixture: ComponentFixture<VendorConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorConfigurationComponent]
    });
    fixture = TestBed.createComponent(VendorConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
