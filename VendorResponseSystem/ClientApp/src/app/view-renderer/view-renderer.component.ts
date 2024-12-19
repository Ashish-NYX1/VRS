import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-view-renderer',
  templateUrl: './view-renderer.component.html',
  styleUrls: ['./view-renderer.component.css']
})
export class ViewRendererComponent  implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onViewClicked() {
    this.params.api.startEditingCell({
      rowIndex: this.params.node.rowIndex!,
      colKey: this.params.column?.getColId()!
    });
  }
}
