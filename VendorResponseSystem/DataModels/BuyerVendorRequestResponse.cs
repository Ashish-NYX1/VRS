using System;
using System.Collections.Generic;

namespace VendorResponseSystem.DataModels;

public partial class BuyerVendorRequestResponse
{
    public int Id { get; set; }

    public string Buyercode { get; set; } = null!;

    public string Vendcode { get; set; } = null!;

    public decimal? Po { get; set; }

    public decimal? Poitem { get; set; }

    public string? Requestbody { get; set; }

    public DateTime? Requestdate { get; set; }

    public string? Responsebody { get; set; }

    public DateTime? Responsedate { get; set; }

    public bool? Isactive { get; set; }

    public bool? Isdelete { get; set; }

    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
}
