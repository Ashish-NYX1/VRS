using System;
using System.Collections.Generic;

namespace VendorResponseSystem.DataModels;

public partial class PodataUsa
{
    public string Database { get; set; } = null!;

    public string Vendcode { get; set; } = null!;

    public string? Vendname { get; set; }

    public decimal Po { get; set; }

    public decimal Poitem { get; set; }

    public string Nyxpart { get; set; } = null!;

    public string? Desc1 { get; set; }

    public string? Desc2 { get; set; }

    public string? Desc3 { get; set; }

    public string? Desc4 { get; set; }

    public string? Desc5 { get; set; }

    public decimal Qtyorder { get; set; }

    public decimal Qtyreceived { get; set; }

    public decimal Unitprice { get; set; }

    public DateTime Requiredate { get; set; }

    public string Potype { get; set; } = null!;

    public string? Vendemail { get; set; }

    public string? Vendcontact { get; set; }

    public string? Buyer { get; set; }
}
