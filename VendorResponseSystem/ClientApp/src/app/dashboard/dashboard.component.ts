import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { UserModel } from 'src/models/user-model';
import { ViewRendererComponent } from '../view-renderer/view-renderer.component';
import { SharedDataService } from 'src/services/shared-data.service';
import { POLineItemModel } from '../../models/po-line-item-model';
import { VendorService } from '../../services/vendor.service';
import { MatDialog } from '@angular/material/dialog';
import { VendorConfigurationComponent } from '../vendor-configuration/vendor-configuration.component';
import { forkJoin } from 'rxjs';
import { Work } from '../../models/work';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @ViewChild('poLineItemsGrid') poLineItemsGrid!: AgGridAngular;
  @ViewChild('poResponsesGrid') poResponsesGrid!: AgGridAngular;

  buyercode: string = "";
  vendcode: string = "";
  poNumber: string = "";
  poitemnumber: string = "";
  poLineItemDetails: POLineItemModel[] = [];
  works: Work[] = [];
  filteredWorks: Work[] = [];
  requestResponseCount: any;

  pieChartLabels: string[] = ['Vendor Requests', 'Responses from Vendor'];
  pieChartData = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [100, 0],
        backgroundColor: ['#FF6384', '#36A2EB']
      }
    ]
  };
  pieChartType: string = 'pie';
  pieChartOptions: any = {
    responsive: false,
    maintainAspectRatio: true,
    scales: {
      x: {
        ticks: {
          font: {
            size: 8
          }
        }
      },
      y: {
        stacked: true
      },
    },
  }; 

  constructor(private vendorService: VendorService, private toastr: ToastrService, private dialog: MatDialog) {
    this.loadGridsData();
  }

  loadGridsData() {
    forkJoin([this.vendorService.getPOLineItems(), this.vendorService.getWorkResponses(), this.vendorService.getrequestResponseCount()]).subscribe(
      ([poLineItemList, _works, _requestResponseCount]) => {
        this.poLineItemDetails = poLineItemList;
        this.works = _works;
        this.filteredWorks = _works;
        this.requestResponseCount = _requestResponseCount;
        this.pieChartData = {
          labels: this.pieChartLabels,
          datasets: [
            {
              data: [this.requestResponseCount.requestcount, this.requestResponseCount.responsecount],
              backgroundColor: ['#FF6384', '#36A2EB']
            }
          ]
        };
      }
    )
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

  public columnDefs_work: ColDef[] = [
    { field: 'buyerCode', headerName: 'Buyer Code' },
    { field: 'vendCode', headerName: 'Vendor Code' },
    { field: 'po', headerName: 'PO' },
    { field: 'poitem', headerName: 'PO Item' },
    {
      field: 'deliveryDate', headerName: 'Delivery Date',
      valueFormatter: this.dateValueFormatter
    },
    { field: 'price', headerName: 'Price', valueFormatter: this.amountValueFormatter },
    { field: 'quantity', headerName: 'Quantity' },
    {
      field: 'createdDate', headerName: 'Response Date',
      valueFormatter: this.dateValueFormatter
    }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  gridOptions = {
    pagination: true,
    paginationPageSize: 10
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

  onFilterChanged() {
    const poLineItemfilterModel = {
      buyerCode: this.buyercode,
      vendorCode: this.vendcode,
      po: this.poNumber,
      poitem: this.poitemnumber
    };
    const poResponsefilterModel = {
      buyerCode: this.buyercode,
      vendCode: this.vendcode,
      po: this.poNumber,
      poitem: this.poitemnumber
    };

    this.applyPOLineItemFilter(this.poLineItemsGrid.api, poLineItemfilterModel);
    this.applyPOResponsesFilter(this.poResponsesGrid.api, poResponsefilterModel);
  }

  applyPOLineItemFilter(gridApi: GridApi, filterModel: any) {
    gridApi.setFilterModel(null); 

    gridApi.setFilterModel({
      buyerCode: { type: 'contains', filter: filterModel.buyerCode },
      vendorCode: { type: 'contains', filter: filterModel.vendCode },
      po: { type: 'contains', filter: filterModel.po },
      poItem: { type: 'contains', filter: filterModel.poItem }
    });

    gridApi.onFilterChanged();
  }

  applyPOResponsesFilter(gridApi: GridApi, filterModel: any) {
    gridApi.setFilterModel(null);

    gridApi.setFilterModel({
      buyerCode: { type: 'contains', filter: filterModel.buyerCode },
      vendCode: { type: 'contains', filter: filterModel.vendCode },
      po: { type: 'contains', filter: filterModel.po },
      poitem: { type: 'contains', filter: filterModel.poItem }
    });

    gridApi.onFilterChanged();
  }

  onRowClicked(event: any) {
    const selectedData = event.data;
    const filterModel = {
      buyerCode: selectedData.buyerCode,
      vendCode: selectedData.vendorCode,
      po: selectedData.po,
      poitem: selectedData.poitem
    };   
    this.applyPOResponsesFilter(this.poResponsesGrid.api, filterModel);
    let _filteredRecords = this.works.filter(work =>
      work.buyerCode.includes(selectedData.buyerCode) &&
      work.vendCode.includes(selectedData.vendorCode) &&
      work.po.toString().includes(selectedData.po) &&
      work.poitem.toString().includes(selectedData.poitem)
    );
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [
        {
          data: [1, _filteredRecords.length],
          backgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
  }
 
  resetFilters() {
    this.buyercode = "";
    this.vendcode = "";
    this.poNumber = "";
    this.poitemnumber = "";
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [
        {
          data: [this.requestResponseCount.requestcount, this.requestResponseCount.responsecount],
          backgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
    this.onFilterChanged();
  }

}
