using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using VendorResponseSystem.DataModels;
using VendorResponseSystem.ViewModels;

namespace VendorResponseSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkResponseController : ControllerBase
    {
        private readonly VendorResponseContext _context;
        private readonly IConfiguration _configuration;
        public WorkResponseController(VendorResponseContext context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkResponses()
        {
            var disableVendors = _context.VendorContacts.Where(v=>v.Isdelete).Select(v=>v.Vendcode.ToLower().Trim()).ToList();
            var results = await _context.Works.Where(w => w.IsActive.HasValue && w.IsActive.Value && !w.IsDelete && !disableVendors.Contains(w.VendCode.ToLower().Trim())).Select(w => w).ToListAsync();
            return Ok(results);
        }

        [HttpGet("requestresponsecount")]
        public async Task<IActionResult> GetRequestResponseCount()
        {
            var disableVendors = _context.VendorContacts.Where(v => v.Isdelete).Select(v => v.Vendcode.ToLower().Trim()).ToList();
            var requestsCount = await _context.BuyerVendorRequestResponses.Where(r => r.Isactive.HasValue && r.Isactive.Value && !disableVendors.Contains(r.Vendcode.ToLower().Trim())).CountAsync();
            var responsesCount = await _context.BuyerVendorRequestResponses.Where(r=>!string.IsNullOrEmpty(r.Responsebody) && r.Responsedate.HasValue && !disableVendors.Contains(r.Vendcode.ToLower().Trim())).CountAsync();
            return Ok(new
            {
                requestcount = requestsCount,
                responsecount = responsesCount
            });
        }
    }
}
