import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../../services/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { POLineItemModel } from '../../models/po-line-item-model';

@Component({
  selector: 'poselection',
  templateUrl: './poselection.component.html',
  styleUrls: ['./poselection.component.css']
})
export class POSelectionComponent implements OnInit {
  poSelectionForm!: FormGroup;
  poLineItems: POLineItemModel[] = [];
  selectedItems: POLineItemModel[] = [];
  displayedColumns: string[] = ['select', 'po', 'poitem'];

  constructor(
    private dialogRef: MatDialogRef<POSelectionComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.poSelectionForm = this.fb.group({
      selectedPOs: this.fb.array([], Validators.required)
    });

    this.poLineItems = this.data.poData;
  }

  onCheckboxChange(event: any, item: POLineItemModel) {
    if (event.checked) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter(i => i !== item);
    }
  }

  submit() {
    this.dialogRef.close(this.selectedItems);
  }

  close() {
    this.dialogRef.close();
  }
}
