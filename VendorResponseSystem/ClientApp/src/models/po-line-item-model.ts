export class POLineItemModel {
  public constructor(buyerCode: string, vendorCode: string, vendorName: string, po: string, poitem: string, partDescription: string, price: string, quantity: string, dueDate: string, status: string) {
    this.buyerCode = buyerCode;
    this.vendorCode = vendorCode;
    this.vendorName = vendorName;
    this.po = po;
    this.poitem = poitem;
    this.partDescription = partDescription;
    this.price = price;
    this.quantity = quantity;
    this.dueDate = dueDate;
    this.status = status;
    }
  buyerCode! : string;
  vendorCode! : string;
  vendorName! : string;
  po! : string;
  poitem!: string;
  partDescription!: string;
  price!: string;
  quantity!: string;
  dueDate!: string;
  status!: string;

}
