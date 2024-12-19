namespace VendorResponseSystem.ViewModels
{
    public class BuyerVendorConfigurationViewModel
    {
        public string Buyercode { get; set; } = null!;

        public string Vendcode { get; set; } = null!;

        public int Frequency { get; set; }

        public string? Vendorname { get; set; }

        public string? Vendoremail { get; set; }
        public string? Vendorcomments { get; set; }
        public string? Nyxnotes { get; set; }


        public bool Confirmeddeliverydate { get; set; }

        public bool Confirmedquantity { get; set; }

        public bool Confirmedprice { get; set; }
        public bool Confirmedtrackingno { get; set; }

        public bool? Isactive { get; set; }

        public bool? Isdelete { get; set; }
    }
}
