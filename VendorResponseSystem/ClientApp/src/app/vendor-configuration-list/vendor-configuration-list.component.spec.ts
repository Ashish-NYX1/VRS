import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorConfigurationListComponent } from './vendor-configuration-list.component';

describe('VendorConfigurationListComponent', () => {
  let component: VendorConfigurationListComponent;
  let fixture: ComponentFixture<VendorConfigurationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorConfigurationListComponent]
    });
    fixture = TestBed.createComponent(VendorConfigurationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
