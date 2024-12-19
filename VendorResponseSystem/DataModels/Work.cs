using System;
using System.Collections.Generic;

namespace VendorResponseSystem.DataModels;

public partial class Work
{
    public int Id { get; set; }

    public string BuyerCode { get; set; } = null!;

    public string VendCode { get; set; } = null!;

    public decimal Po { get; set; }

    public decimal Poitem { get; set; }

    public DateTime? DeliveryDate { get; set; }

    public decimal? Quantity { get; set; }

    public decimal? Price { get; set; }

    public string? TrackingNumber { get; set; }

    public bool? IsActive { get; set; }

    public bool IsDelete { get; set; }

    public DateTime CreatedDate { get; set; }
}
