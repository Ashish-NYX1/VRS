using System;
using System.Collections.Generic;

namespace VendorResponseSystem.DataModels;

public partial class Vendorresponsedatalog
{
    public long? ErrorNumber { get; set; }

    public int? ErrorSeverity { get; set; }

    public int? ErrorState { get; set; }

    public string? ErrorProcedure { get; set; }

    public int? ErrorLine { get; set; }

    public string? ErrorMessage { get; set; }

    public DateTime? ErrorCreatedDate { get; set; }
}
