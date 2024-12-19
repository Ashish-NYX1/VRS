using System;
using System.Collections.Generic;

namespace VendorResponseSystem.DataModels;

public partial class Buyer
{
    public string Database { get; set; } = null!;

    public string Buyercode { get; set; } = null!;

    public string Buyername { get; set; } = null!;

    public string Buyermail { get; set; } = null!;
}
