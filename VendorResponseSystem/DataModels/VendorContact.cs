using System;
using System.Collections.Generic;

namespace VendorResponseSystem.DataModels;

public partial class VendorContact
{
    public string Vendcode { get; set; } = null!;

    public string Vendorname { get; set; } = null!;

    public string Vendoremail { get; set; } = null!;

    public bool Isactive { get; set; }

    public bool Isdelete { get; set; }
}
