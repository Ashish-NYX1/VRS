export class BuyerVendorConfiguration {
  public constructor(buyercode: string, vendcode: string, frequency: number, vendorname: string, vendoremail: string, vendorcomments: string, nyxnotes: string, confirmeddeliverydate: boolean, confirmedquantity: boolean, confirmedprice: boolean, isactive: boolean, isdelete: boolean, confirmedtrackingno: boolean) {
    this.buyercode = buyercode;
    this.vendcode = vendcode;
    this.frequency = frequency;
    this.vendorname = vendorname;
    this.vendoremail = vendoremail;
    this.vendorcomments = vendorcomments;
    this.nyxnotes = nyxnotes;
    this.confirmeddeliverydate = confirmeddeliverydate;
    this.confirmedquantity = confirmedquantity;
    this.confirmedprice = confirmedprice;
    this.confirmedtrackingno = confirmedtrackingno;
    this.isactive = isactive;
    this.isdelete = isdelete;
    }
  buyercode! : string;
  vendcode!: string;
  frequency!: number;
  vendorname!: string;
  vendoremail!: string;
  vendorcomments!: string;
  nyxnotes!: string;
  confirmeddeliverydate!: boolean;
  confirmedquantity!: boolean;
  confirmedprice!: boolean;
  confirmedtrackingno!: boolean;
  isactive!: boolean;
  isdelete!: boolean;
}
