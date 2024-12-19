using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Pipelines.WebApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System.Globalization;
using System.Numerics;
using System.Reflection;
using VendorResponseSystem.DataModels;
using VendorResponseSystem.EmailNotification;
using VendorResponseSystem.ViewModels;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace VendorResponseSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendorController : ControllerBase
    {
        private readonly VendorResponseContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;
        private readonly EmailHelper _emailHelper;
        public VendorController(VendorResponseContext context, IConfiguration configuration, IMemoryCache memoryCache, EmailHelper emailHelper)
        {
            _configuration = configuration;
            _context = context;
            _memoryCache = memoryCache;
            _emailHelper = emailHelper;
        }
        [HttpGet]
        public async Task<IActionResult> GetVendors(string userName)
        {
            UserModel user;
            if (_memoryCache.TryGetValue(userName, out user))
            {
                var disabledConfigs = _context.BuyerVendorConfigurations.Where(b => b.Isactive.HasValue && !b.Isactive.Value).Select(b => new
                {
                    buyerCode = b.Buyercode,
                    vendCode = b.Vendcode
                }).ToList();
                var vendors = _context.VendorContacts.Where(v=>v.Isdelete).Select(v=>v.Vendcode.ToLower().Trim()).ToList();
                var data = await (from podata in _context.PodataUsas
                                  join buyer in _context.Buyers
                                  on podata.Buyer equals buyer.Buyercode into buyersGroup
                                  from bg in buyersGroup.DefaultIfEmpty()
                                  where ((user.IsMemberOfVendorResponseAdmin) || (!user.IsMemberOfVendorResponseAdmin && user.IsMemberOfVendorResponse && user.BuyerCodes.Trim().ToLower().IndexOf(bg.Buyercode.Trim().ToLower()) > -1))
                                  select podata).Distinct().ToListAsync();
                var poLineItemData = data
          .GroupBy(podata => new { BuyerCode = podata.Buyer.Trim(), VendorCode = podata.Vendcode.Trim() })
          .Select(group => group.First())
          .Select(podata => new VendorBuyerViewModel
          {
              BuyerCode = podata.Buyer.Trim(),
              VendorCode = podata.Vendcode.Trim(),
              VendorName = podata.Vendname.Trim(),
              Isactive = !disabledConfigs.Any(d => d.buyerCode.Trim() == podata.Buyer.Trim() && d.vendCode.Trim() == podata.Vendcode.Trim())
          }).ToList();
                poLineItemData = poLineItemData.Where(p=>!vendors.Contains(p.VendorCode.ToLower().Trim())).ToList();
                return Ok(poLineItemData);
            }
            return BadRequest("User not found!");
        }

        [HttpGet("VendorResponse/{requestresponseid}")]
        public async Task<IActionResult> GetVendorResponseByRequestId(int requestresponseid)
        {           
            var vendorData = await (from r in _context.BuyerVendorRequestResponses
                                    join c in _context.BuyerVendorConfigurations
                                      on new { Vendcode = r.Vendcode.ToLower().Trim(), Buyercode = r.Buyercode.ToLower().Trim() }
                        equals new { Vendcode = c.Vendcode.ToLower().Trim(), Buyercode = c.Buyercode.ToLower().Trim() }
                                    join vc in _context.VendorContacts
                                    on r.Vendcode.ToLower().Trim() equals vc.Vendcode.ToLower().Trim()
                                    join po in _context.PodataUsas
                                     on new { Vendcode = r.Vendcode.ToLower().Trim(), Buyercode = r.Buyercode.ToLower().Trim(), PO = r.Po.ToString().Trim(), POItem = r.Poitem.ToString().Trim() }
                        equals new { Vendcode = po.Vendcode.ToLower().Trim(), Buyercode = po.Buyer.ToLower().Trim(), PO = po.Po.ToString().Trim(), POItem = po.Poitem.ToString().Trim() }
                                    where r.Id == requestresponseid
                                    select new VendorResponseModel
                                    {
                                        Id = r.Id,
                                        User = vc.Vendorname.Trim(),
                                        BuyerCode = r.Buyercode.Trim(),
                                        VendCode = r.Vendcode.Trim(),
                                        Ponumber = po.Po.ToString(),
                                        Partnumber = po.Poitem.ToString(),
                                        Partdescription = string.Format("{0} , {1} , {2} , {3} , {4}",po.Desc1,po.Desc2,po.Desc3,po.Desc4,po.Desc5),
                                        Shipqty = po.Qtyorder.ToString(),
                                        Promisedate = po.Requiredate.ToLongDateString(),
                                        Comments = c.Vendorcomments,
                                        Deliverydate = string.Empty,
                                        Quantity = 0,
                                        Price = 0,
                                        TrackingNumber = string.Empty,
                                        Showdeliverydate = c.Confirmeddeliverydate,
                                        Showquantity = c.Confirmedquantity,
                                        Showprice = c.Confirmedprice,
                                        Showtrackingnumber = c.Confirmedtrackingno
                                    }).FirstOrDefaultAsync();
            return Ok(vendorData);
        }

        [HttpGet("VendorBuyerConfiguration/{buyercode}/{vendcode}")]
        public async Task<IActionResult> GetVendorBuyerConfiguration(string buyercode, string vendcode)
        {
            var configData = await (from c in _context.BuyerVendorConfigurations
                                join v in _context.VendorContacts
                                on c.Vendcode.Trim() equals v.Vendcode.Trim()
                                where c.Buyercode.Trim() == buyercode.Trim() && c.Vendcode.Trim() == vendcode.Trim() && !v.Isdelete
                                select new BuyerVendorConfigurationViewModel
                                {
                                    Buyercode = c.Buyercode,
                                    Vendcode = c.Vendcode,
                                    Frequency = c.Frequency,
                                    Vendorname = v.Vendorname,
                                    Vendoremail = v.Vendoremail,
                                    Vendorcomments = c.Vendorcomments,
                                    Nyxnotes = c.Nyxnotes,
                                    Confirmeddeliverydate = c.Confirmeddeliverydate,
                                    Confirmedprice = c.Confirmedprice,
                                    Confirmedquantity = c.Confirmedquantity,
                                    Confirmedtrackingno = c.Confirmedtrackingno,
                                    Isactive = c.Isactive,
                                    Isdelete = c.Isdelete
                                }).FirstOrDefaultAsync();
            return Ok(configData);
        }

        [HttpPost("SaveVendorBuyerConfiguration")]
        public async Task<IActionResult> PostVendorBuyerConfiguration([FromBody] BuyerVendorConfigurationViewModel model)
        {
            if (model == null)
                return BadRequest(ModelState);
            var _configuration = new BuyerVendorConfiguration()
            {
                Buyercode = model.Buyercode.Trim(),
                Vendcode = model.Vendcode.Trim(),
                Frequency = model.Frequency,
                Vendorcomments = model.Vendorcomments,
                Nyxnotes = model.Nyxnotes,
                Confirmeddeliverydate = model.Confirmeddeliverydate,
                Confirmedprice = model.Confirmedprice,
                Confirmedquantity = model.Confirmedquantity,
                Confirmedtrackingno = model.Confirmedtrackingno,
                Isactive = model.Isactive,
                Isdelete = model.Isdelete
            };
            var _vendorContacts = new VendorContact()
            {
                Vendcode = model.Vendcode.Trim(),
                Vendoremail = model.Vendoremail,
                Vendorname = model.Vendorname,
                Isactive = true,
                Isdelete = model.Isdelete.HasValue?model.Isdelete.Value:false
            };
            var isConfigExist = _context.BuyerVendorConfigurations.Any(b => b.Buyercode.Trim() == model.Buyercode.Trim() && b.Vendcode.Trim() == model.Vendcode.Trim());
            var isVendContactExist = _context.VendorContacts.Any(v => v.Vendcode.Trim() == model.Vendcode.Trim());
            ManipulateConfiguration(_configuration, isConfigExist);
            ManipulateVendorContacts(_vendorContacts, isVendContactExist);
            await _context.SaveChangesAsync();
            return Ok(true);
        }
        [HttpPost("UpdateVendorEmail/{vendcode}/{vendemail}")]
        public async Task<IActionResult> UpdateVendorEmail(string vendcode, string vendemail)
        {
            if(string.IsNullOrEmpty(vendcode) || string.IsNullOrEmpty(vendemail))
                return BadRequest("Input parameters are invalid!");
            _context.UpdateVendorEmail(vendcode, vendemail);
            return await Task.FromResult(Ok(true));
        }
        [HttpPost("SendVendorNotification")]
        public async Task<IActionResult> SendNotification([FromBody] EmailNotificationViewModel config)
        {
            var email = config.Vendoremail.Trim();
            email = string.Equals(email.Trim(), ",") ? string.Empty : email;                        
                if (config != null && !string.IsNullOrEmpty(email) && (config.Confirmeddeliverydate || config.Confirmedquantity || config.Confirmedprice))
                {
                    var _po = Convert.ToDecimal(config.PO.ToString());
                    var _poitem = Convert.ToDecimal(config.POItem.ToString());
                    var newEntity = new BuyerVendorRequestResponse
                    {
                        Buyercode = config.Buyercode.Trim(),
                        Vendcode = config.Vendcode.Trim(),
                        Po = _po,
                        Poitem = _poitem,
                        Requestbody = "",
                        Requestdate = DateTime.Now,
                        Isactive = true,
                        Isdelete = false,
                        CreatedDate = DateTime.Now
                    };
                    var poData = _context.PodataUsas.Where(d => d.Po == _po && d.Poitem == _poitem).FirstOrDefault();
                    _emailHelper.ProcessNotification(config, newEntity, poData);
                return Ok(config);
                }
            return Ok(null);
        }

        [HttpPost("SaveVendorResponse")]
        public async Task<IActionResult> PostVendorResponse([FromBody] VendorResponseModel model)
        {
            if(model!=null && ModelState.IsValid)
            {
                var requestResponseMatched = _context.BuyerVendorRequestResponses.Where(b=>b.Id==model.Id).FirstOrDefault();
                if(requestResponseMatched!=null)
                {
                    requestResponseMatched.Responsebody = "Response Received";
                    requestResponseMatched.Responsedate = DateTime.Now;
                    requestResponseMatched.Isactive = false;
                    requestResponseMatched.ModifiedDate = DateTime.Now;
                    DateTime _deliveryDate;
                    if (!string.IsNullOrEmpty(model.Deliverydate))
                    {
                        if (!DateTime.TryParse(model.Deliverydate, null, DateTimeStyles.RoundtripKind, out _deliveryDate))
                        {
                            _deliveryDate = DateTime.MinValue; 
                        }
                    }
                    else
                    {
                        _deliveryDate = DateTime.MinValue; 
                    }
                    var work = new Work()
                    {
                        BuyerCode = model.BuyerCode,
                        VendCode = model.VendCode,
                        Po = !string.IsNullOrEmpty(model.Ponumber)? Convert.ToDecimal(model.Ponumber): 0,
                        Poitem = !string.IsNullOrEmpty(model.Partnumber)? Convert.ToDecimal(model.Partnumber): 0,
                        DeliveryDate = _deliveryDate == DateTime.MinValue ? (DateTime?)null : _deliveryDate,
                        Quantity = model.Quantity,
                        Price = model.Price, 
                        TrackingNumber = !string.IsNullOrEmpty(model.TrackingNumber)?model.TrackingNumber: string.Empty,
                        IsActive = true,
                        IsDelete = false,
                        CreatedDate = DateTime.Now
                    };
                    _context.Works.Add(work);
                    _context.SaveChanges();
                    return Ok(true);
                }
                return BadRequest("Request donot exist!");
            }
            else
            {
                return BadRequest("Provide a valid model");
            }
        }

        private void ManipulateConfiguration(BuyerVendorConfiguration _configuration, bool isConfigExist)
        {
            if (!isConfigExist)
            {
                _context.BuyerVendorConfigurations.Add(_configuration);
            }
            else
            {
                _context.BuyerVendorConfigurations.Update(_configuration);
            }
        }

        private void ManipulateVendorContacts(VendorContact _vendCnt, bool isVendCntctExist)
        {
            if (!isVendCntctExist)
            {
                _context.VendorContacts.Add(_vendCnt);
            }
            else
            {
                _context.VendorContacts.Update(_vendCnt);
            }
        }
    }
}
