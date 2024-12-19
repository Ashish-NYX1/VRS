export class EmailNotificationModel {
  public constructor(
    buyerCode: string,
    vendCode: string,
    frequency: string,
    vendorName: string | null,
    vendorEmail: string | null,
    vendorComments: string | null,
    nyxNotes: string | null,
    confirmedDeliveryDate: boolean,
    confirmedQuantity: boolean,
    confirmedPrice: boolean,
    confirmedTrackingNo: boolean,
    po: string,
    poitem: string,
    isActive: boolean | null,
    isDelete: boolean | null
  ) {
    this.buyerCode = buyerCode;
    this.vendCode = vendCode;
    this.frequency = frequency;
    this.vendorName = vendorName;
    this.vendorEmail = vendorEmail;
    this.vendorComments = vendorComments;
    this.nyxNotes = nyxNotes;
    this.confirmedDeliveryDate = confirmedDeliveryDate;
    this.confirmedQuantity = confirmedQuantity;
    this.confirmedPrice = confirmedPrice;
    this.confirmedTrackingNo = confirmedTrackingNo;
    this.po = po;
    this.poitem = poitem;
    this.isActive = isActive;
    this.isDelete = isDelete;
  }

  buyerCode!: string;
  vendCode!: string;
  frequency!: string;
  vendorName!: string | null;
  vendorEmail!: string | null;
  vendorComments!: string | null;
  nyxNotes!: string | null;
  confirmedDeliveryDate!: boolean;
  confirmedQuantity!: boolean;
  confirmedPrice!: boolean;
  confirmedTrackingNo!: boolean;
  po!: string;
  poitem!: string;
  isActive!: boolean | null;
  isDelete!: boolean | null;
}
