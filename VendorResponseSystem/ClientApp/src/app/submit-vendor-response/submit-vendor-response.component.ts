import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorResponseModel } from '../../models/vendor-response-model';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { ToastrService } from 'ngx-toastr';

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'MM/DD/YYYY' },
  display: { dateInput: 'MM/DD/YYYY', monthYearLabel: 'MMM YYYY', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM YYYY' }
};

@Component({
  selector: 'app-submit-vendor-response',
  templateUrl: './submit-vendor-response.component.html',
  styleUrls: ['./submit-vendor-response.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class SubmitVendorResponseComponent {
  vendorResponseForm!: FormGroup;
  model!: VendorResponseModel;
  requestresponseid!: string;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private vendorService: VendorService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.requestresponseid = this.route.snapshot.paramMap.get('requestresponseid') || '';
    this.vendorService.getVendorResponseByRequestId(parseInt(this.requestresponseid)).subscribe({
      next: (response) => {
        if (response) {
          this.initializeForm(response);
        }        
      }
    });    
  }

  initializeForm(response: VendorResponseModel): void {
    this.model = response;
    this.vendorResponseForm = this.fb.group({
      id: [this.model.id],
      user: [this.model.user],
      buyerCode: [this.model.buyerCode],
      vendCode: [this.model.vendCode],
      ponumber: [this.model.ponumber],
      partnumber: [this.model.partnumber],
      partdescription: [this.model.partdescription],
      shipqty: [this.model.shipqty],
      promisedate: [this.model.promisedate],
      comments: [this.model.comments],
      deliverydate: [
        { value: this.model.deliverydate, disabled: !this.model.showdeliverydate },
        this.model.showdeliverydate ? [Validators.required] : []
      ],
      quantity: [
        { value: this.model.quantity, disabled: !this.model.showquantity },
        this.model.showquantity ? [Validators.required, Validators.pattern("^[0-9]*$")] : []
      ],
      price: [
        { value: this.model.price, disabled: !this.model.showprice },
        this.model.showprice ? [Validators.required, Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")] : []
      ],
      trackingNumber: [
        { value: this.model.trackingNumber, disabled: !this.model.showtrackingnumber },
        this.model.showtrackingnumber ? [Validators.required] : []
      ]
    });
  }

  get f() {
    return this.vendorResponseForm.controls;
  }

  onSubmit(): void {
    if (this.vendorResponseForm.valid) {
      let model = this.vendorResponseForm.getRawValue() as VendorResponseModel;
      if (model.deliverydate) {
        const deliveryDate = new Date(model.deliverydate);
        const utcDeliveryDate = new Date(Date.UTC(
          deliveryDate.getFullYear(),
          deliveryDate.getMonth(),
          deliveryDate.getDate()
        ));
        model.deliverydate = utcDeliveryDate.toISOString(); 
      }
      this.vendorService.saveVendorResponse(model).subscribe({
        next: (result) => {
          if (result) {
            this.toastr.success('Details Saved Successfully!', 'Success');
          }
        },
        error: (error) => {
          this.toastr.error('Error Occured : ' + (error as any).error.message, 'Error');
        }
      });
    }
  }
}
