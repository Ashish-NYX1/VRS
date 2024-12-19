namespace VendorResponseSystem.ViewModels
{
    public class UserModel
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public string TeamName { get; set; }
        public string Email { get; set; }
        public bool IsMemberOfVendorResponse { get; set; }
        public bool IsMemberOfVendorResponseAdmin { get; set; }
        public string BuyerCodes { get; set; }
    }
}
