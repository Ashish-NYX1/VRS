using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using VendorResponseSystem.DataModels;
using VendorResponseSystem.ViewModels;

namespace VendorResponseSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class POLineItemsController : ControllerBase
    {
        private readonly VendorResponseContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;
        public POLineItemsController(VendorResponseContext context, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _configuration = configuration;
            _context = context;
            _memoryCache = memoryCache;
        }
        [HttpGet]
        public async Task<IActionResult> GetPOLineItems(string userName)
        {
            UserModel user;
            if (_memoryCache.TryGetValue(userName, out user))
            {
                var disabledConfigs = _context.BuyerVendorConfigurations.Where(b => b.Isactive.HasValue && !b.Isactive.Value).Select(b => new {
                    buyerCode = b.Buyercode,
                    vendCode = b.Vendcode
                }).ToList();
                var disabledVendors = _context.VendorContacts.Where(v => v.Isdelete).Select(v => v.Vendcode.ToLower().Trim()).ToList();
                var poLineItemData = (from podata in _context.PodataUsas
                                      join buyer in _context.Buyers
                                      on podata.Buyer equals buyer.Buyercode into buyersGroup
                                      from bg in buyersGroup.DefaultIfEmpty()
                                      select new POLineItemsViewModel
                                      {
                                          BuyerCode = podata.Buyer,
                                          VendorCode = podata.Vendcode,
                                          VendorName = podata.Vendname,
                                          PO = podata.Po.ToString(),
                                          POItem = podata.Poitem.ToString(),
                                          PartDescription = podata.Desc1 + " , " + podata.Desc2 + " , " + podata.Desc3 + " , " + podata.Desc4 + " , " + podata.Desc5,
                                          Quantity = podata.Qtyorder.ToString(),
                                          Price = podata.Unitprice.ToString(),
                                          DueDate = podata.Requiredate.ToString(),
                                          Status = "Open"
                                      }).ToList();
                poLineItemData = poLineItemData.Where(p => ((user.IsMemberOfVendorResponseAdmin) || (!user.IsMemberOfVendorResponseAdmin && user.IsMemberOfVendorResponse && user.BuyerCodes.Trim().ToLower().IndexOf(p.BuyerCode.Trim().ToLower())>-1)) && (!disabledConfigs.Any(d => d.buyerCode.Trim() == p.BuyerCode.Trim() && d.vendCode.Trim() == p.VendorCode.Trim()))).ToList();
                poLineItemData = poLineItemData.Where(p => !disabledVendors.Contains(p.VendorCode.ToLower().Trim())).ToList();
                return Ok(poLineItemData);
            }
            return BadRequest("User not found!");
        }

        [HttpGet("POLineItemsByVendorBuyer/{vendCode}/{buyerCode}")]
        public async Task<IActionResult> GetPOLineItemsByVendorBuyer(string vendCode, string buyerCode)
        {           
                var poLineItemData = _context.PodataUsas.Where(p=>p.Vendcode.ToLower().Trim().Contains(vendCode.ToLower().Trim()) && p.Buyer.ToLower().Trim().Contains(buyerCode.ToLower().Trim())).ToList();
                return Ok(poLineItemData);
        }
    }
}
