import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ColDef,
  ICellRendererParams,
  RowEditingStartedEvent,
  RowEditingStoppedEvent
} from 'ag-grid-community';
import { UserModel } from 'src/models/user-model';
import { ViewRendererComponent } from '../view-renderer/view-renderer.component';
import { SharedDataService } from 'src/services/shared-data.service';
import { POLineItemModel } from '../../models/po-line-item-model';
import { VendorService } from '../../services/vendor.service';
import { MatDialog } from '@angular/material/dialog';
import { VendorConfigurationComponent } from '../vendor-configuration/vendor-configuration.component';

@Component({
  selector: 'app-po-line-item-list',
  templateUrl: './po-line-item-list.component.html',
  styleUrls: ['./po-line-item-list.component.css']
})
export class POLineItemListComponent {
  poLineItemDetails: POLineItemModel[] = [];
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private vendorService: VendorService, private toastr: ToastrService, private dialog: MatDialog) {
    this.loadVendorDetails();
  }

  loadVendorDetails() {
    this.vendorService.getPOLineItems().subscribe({
      next: (poLineItemList) => {
        this.poLineItemDetails = poLineItemList;
      }
    })
  }

  public columnDefs: ColDef[] = [    
    { field: 'buyerCode', headerName: 'Buyer Code', width: 150 },
    { field: 'vendorCode', headerName: 'Vendor Code', width: 150 },
    { field: 'vendorName', headerName: 'Vendor Name', width: 150 },
    { field: 'po', headerName: 'PO', width: 100 },
    { field: 'poitem', headerName: 'PO Item', width: 150 },
    { field: 'partDescription', headerName: 'Part Description', width: 300 },
    { field: 'price', headerName: 'Price', valueFormatter: this.amountValueFormatter, width: 100 },
    { field: 'quantity', headerName: 'Quantity', width: 150 },
    {
      field: 'dueDate', headerName: 'Due Date',
      valueFormatter: this.dateValueFormatter, width: 150
},
    { field: 'status', headerName: 'Status', width: 100 }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  gridOptions = {
    pagination: true,
    paginationPageSize: 20
  }

  amountValueFormatter(params: any) {
    if (params && params.value) {
      let usFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      });
      return usFormatter.format(params.value);
    }
    return '$0.00';
  }

  dateValueFormatter(params: any) {
    if (params.value) {
      const date = new Date(params.value);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `${month}/${day}/${year}`;
    }
    return '';
  }

}
