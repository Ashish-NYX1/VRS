export class VendorResponseModel {
  public constructor(
    id: string,
    user: string,
    buyerCode: string,
    vendCode: string,
    ponumber: string,
    partnumber: string,
    partdescription: string,
    shipqty: string,
    promisedate: string,
    comments: string,
    deliverydate: string,
    quantity: string,
    price: string,
    trackingNumber: string,
    showdeliverydate: boolean = false,
    showquantity: boolean = false,
    showprice: boolean = false,
    showtrackingnumber: boolean = false
  ) {
    this.id = id;
    this.user = user;
    this.buyerCode = buyerCode;
    this.vendCode = vendCode;
    this.ponumber = ponumber;
    this.partnumber = partnumber;
    this.partdescription = partdescription;
    this.shipqty = shipqty;
    this.promisedate = promisedate;
    this.comments = comments;
    this.deliverydate = deliverydate;
    this.quantity = quantity;
    this.price = price;
    this.trackingNumber = trackingNumber;
    this.showdeliverydate = showdeliverydate;
    this.showquantity = showquantity;
    this.showprice = showprice;
    this.showtrackingnumber = showtrackingnumber;
  }
  id!: string;
  user!: string;
  buyerCode!: string;
  vendCode!: string;
  ponumber!: string;
  partnumber!: string;
  partdescription!: string;
  shipqty!: string;
  promisedate!: string;
  comments!: string;
  deliverydate!: string;
  quantity!: string;
  price!: string;
  trackingNumber!: string;
  showdeliverydate!: boolean;
  showquantity!: boolean;
  showprice!: boolean;
  showtrackingnumber!: boolean;
}
