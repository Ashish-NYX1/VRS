export class Work {
  public constructor(id: number, buyerCode: string, vendCode: string, vendorName: string, po: string, poitem: string, deliveryDate: string, price: string, quantity: string, isActive: boolean, isDelete: boolean, createdDate: string) {
    this.id = id;
    this.buyerCode = buyerCode;
    this.vendCode = vendCode;    
    this.po = po;
    this.poitem = poitem;
    this.deliveryDate = deliveryDate;
    this.price = price;
    this.quantity = quantity;
    this.isActive = isActive;
    this.isDelete = isDelete;
    this.createdDate = createdDate;
  }
  id!: number;
  buyerCode! : string;
  vendCode! : string;
  po! : string;
  poitem!: string;
  deliveryDate!: string;
  price!: string;
  quantity!: string;
  isActive!: boolean;
  isDelete!: boolean;
  createdDate!: string;

}
