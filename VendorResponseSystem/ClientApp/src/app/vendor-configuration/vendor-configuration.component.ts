import { Component, EventEmitter, Inject, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { VendorBuyerModel } from '../../models/vendor-buyer-model';
import { VendorService } from '../../services/vendor.service';
import { BuyerVendorConfiguration } from '../../models/buyer-vendor-configuration';
import { POSelectionComponent } from '../poselection/poselection.component';
import { EmailNotificationModel } from '../../models/email-notification-model';
import { POLineItemModel } from '../../models/po-line-item-model';

@Component({
  selector: 'app-vendor-configuration',
  templateUrl: './vendor-configuration.component.html',
  styleUrls: ['./vendor-configuration.component.css']
})
export class VendorConfigurationComponent implements OnInit {
  vendorConfigurationForm!: FormGroup;
  buyerVendorConfiguration!: BuyerVendorConfiguration;
  constructor(@Inject(MAT_DIALOG_DATA) public data: VendorBuyerModel, private dialogRef: MatDialogRef<number>, private fb: FormBuilder, private toastr: ToastrService, private vendorService: VendorService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.vendorService.getVendorBuyerConfiguration(this.data.buyerCode, this.data.vendorCode).subscribe({
      next: (configuration) => {
        this.buyerVendorConfiguration = configuration;
        this.vendorConfigurationForm = this.fb.group({
          disableConfiguration: [configuration ? !configuration.isactive : false],
          hideVendor: [configuration ? configuration.isdelete : false],
          frequency: [configuration ? configuration.frequency : 0, Validators.required],
          confirmationOption: this.fb.group({
            ConfirmedDeliveryDate: [configuration != null && configuration.confirmeddeliverydate],
            ConfirmedQuantity: [configuration != null && configuration.confirmedquantity],
            ConfirmedPrice: [configuration != null && configuration.confirmedprice],
            ConfirmedTrackingNo: [configuration != null && configuration.confirmedtrackingno]
          }),
          vendorName: [(configuration ? configuration.vendorname : this.data.vendorName), Validators.required],
          vendorEmail: [(configuration ? configuration.vendoremail : ''), Validators.required],
          vendorComments: [(configuration ? configuration.vendorcomments : '')],
          nyxNotes: [(configuration ? configuration.nyxnotes : '')]
        });
      }
    })  
  } 

  submitVendorConfiguration() {
    if (this.vendorConfigurationForm.valid) {
      var vendorConfig = new BuyerVendorConfiguration(this.data.buyerCode, this.data.vendorCode, this.vendorConfigurationForm.controls['frequency'].value, this.vendorConfigurationForm.controls['vendorName'].value,
        this.vendorConfigurationForm.controls['vendorEmail'].value, this.vendorConfigurationForm.controls['vendorComments'].value, this.vendorConfigurationForm.controls['nyxNotes'].value, this.vendorConfigurationForm.get('confirmationOption.ConfirmedDeliveryDate')?.value, this.vendorConfigurationForm.get('confirmationOption.ConfirmedQuantity')?.value, this.vendorConfigurationForm.get('confirmationOption.ConfirmedPrice')?.value, !this.vendorConfigurationForm.controls['disableConfiguration'].value, this.vendorConfigurationForm.controls['hideVendor'].value, this.vendorConfigurationForm.get('confirmationOption.ConfirmedTrackingNo')?.value);
      this.vendorService.saveVendorBuyerConfiguration(vendorConfig).subscribe({
        next: (result) => {
          if (result) {
            this.toastr.success('Configuration Saved Successfully!', 'Success');
            this.vendorConfigurationForm.reset();
            this.dialogRef.close();
          }
        },
        error: (error) => {
          this.toastr.error('Error Occured : ' + (error as any).error.message, 'Error');
        }
      });
    }

  }

  checkPOs() {
    this.vendorService.getPOLineItemsByVendorBuyer(this.data.vendorCode, this.data.buyerCode).subscribe({
      next: (poLineItemList) => {
        const dialogRef = this.dialog.open(POSelectionComponent, {
          width: '800px',
          data: { poData: poLineItemList }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            let response = result;
            for (let r in response) {
              let emailNotification = new EmailNotificationModel(response[r].buyer, response[r].vendcode, this.vendorConfigurationForm.controls['frequency'].value, this.vendorConfigurationForm.controls['vendorName'].value, this.vendorConfigurationForm.controls['vendorEmail'].value, this.vendorConfigurationForm.controls['vendorComments'].value, this.vendorConfigurationForm.controls['nyxNotes'].value, this.vendorConfigurationForm.get('confirmationOption.ConfirmedDeliveryDate')?.value, this.vendorConfigurationForm.get('confirmationOption.ConfirmedQuantity')?.value, this.vendorConfigurationForm.get('confirmationOption.ConfirmedPrice')?.value, this.vendorConfigurationForm.get('confirmationOption.ConfirmedTrackingNo')?.value, response[r].po, response[r].poitem, true, false);
              this.vendorService.sendNotification(emailNotification).subscribe({
                next: (result) => {
                  if (result) {
                    this.toastr.success('Notification sent successfullt for PO:' + result.po + ' and for POItem : ' + result.poItem, 'Success');
                  }
                },
                error: (error) => {
                  this.toastr.error('Error Occured : ' + (error as any).error.message, 'Error');
                }
              });
            }
          }
        });
      }
    })   
  }

  resetForm() {
    this.vendorConfigurationForm.reset();
  }

  updateInCMS() {
    this.toastr.warning('Email Update functionality will work in Production!', 'Warning');
    //this.vendorService.updateVendorEmail(this.data.vendorCode, this.vendorConfigurationForm.controls['vendorEmail'].value).subscribe({
    //  next: (result) => {
    //    if (result) {
    //      this.toastr.success('Email Updated Successfully!', 'Success');
    //      this.vendorConfigurationForm.reset();
    //      this.dialogRef.close();
    //    }
    //  },
    //  error: (error) => {
    //    this.toastr.error('Error Occured : ' + (error as any).error.message, 'Error');
    //  }
    //});
  } 
}
