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
import { VendorService } from '../../services/vendor.service';
import { MatDialog } from '@angular/material/dialog';
import { VendorConfigurationComponent } from '../vendor-configuration/vendor-configuration.component';
import { VendorBuyerModel } from '../../models/vendor-buyer-model';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-vendor-configuration-list',
  templateUrl: './vendor-configuration-list.component.html',
  styleUrls: ['./vendor-configuration-list.component.css']
})
export class VendorConfigurationListComponent {
  vendorList: VendorBuyerModel[] = [];
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private vendorService: VendorService, private toastr: ToastrService, private dialog: MatDialog) {
    this.loadVendorDetails();
  }

  loadVendorDetails() {
    this.vendorService.getVendors().subscribe({
      next: (vendorsList) => {
        this.vendorList = vendorsList;
      }
    })
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'Configuration',
      cellRenderer: 'ViewRendererComponent',
      cellRendererSelector: () => {
        const editRenderer = {
          component: ViewRendererComponent,
        };
        return editRenderer;
      },
      onCellClicked: this.onConfigureClicked.bind(this),
      editable: false,
      maxWidth: 150
    },
    { field: 'buyerCode', headerName: 'Buyer Code', width: 150 },
    { field: 'vendorCode', headerName: 'Vendor Code', width: 150 },
    { field: 'vendorName', headerName: 'Vendor Name', width: 300 }    
  ];

  onConfigureClicked(event: any) {
    let rowData = event.data as VendorBuyerModel;    
    const dialogRef = this.dialog.open(VendorConfigurationComponent, {
      width: '800px',
      data: rowData
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadVendorDetails();
    });
  }

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  }; 

  gridOptions: GridOptions = {
  pagination: true,
    paginationPageSize: 20,
    getRowClass: (params: any): string | string[] | undefined => {
      if (params.data.isactive == false) {
      return 'grayed-out';
      }
      return undefined;
  }
};

}
