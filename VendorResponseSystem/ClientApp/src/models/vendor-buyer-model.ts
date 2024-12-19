export class VendorBuyerModel {
  public constructor(buyerCode: string, vendorCode: string, vendorName: string, isactive: boolean) {
    this.buyerCode = buyerCode;
    this.vendorCode = vendorCode;
    this.vendorName = vendorName;
    this.isactive = isactive;
    }
  buyerCode! : string;
  vendorCode!: string;
  vendorName!: string;
  isactive!: boolean;
}
