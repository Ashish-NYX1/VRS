namespace VendorResponseSystem.ViewModels
{
    public class VendorResponseModel
    {
        public int Id { get; set; }
        public string User { get; set; }
        public string BuyerCode { get; set; }
        public string VendCode { get; set; }
        public string Ponumber { get; set; }
        public string Partnumber { get; set; }
        public string Partdescription { get; set; }
        public string Shipqty { get; set; }
        public string Promisedate { get; set; }
        public string Comments { get; set; }
        public string Deliverydate { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public string TrackingNumber { get; set; }
        public bool Showdeliverydate { get; set; }
        public bool Showquantity { get; set; }
        public bool Showprice { get; set; }
        public bool Showtrackingnumber { get; set; }
    }
}
