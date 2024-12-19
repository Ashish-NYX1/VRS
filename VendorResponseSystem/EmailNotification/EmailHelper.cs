using Newtonsoft.Json;
using System.Net.Mail;
using System.Net.Mime;
using System.Net;
using System.Text.RegularExpressions;
using VendorResponseSystem.DataModels;
using Microsoft.Extensions.Configuration;
using System.IO;
using VendorResponseSystem.ViewModels;
using Microsoft.VisualStudio.Services.Common;

namespace VendorResponseSystem.EmailNotification
{
    public class EmailHelper
    {
        VendorResponseContext _context = new VendorResponseContext();

        private readonly IConfiguration _configuration;

        public EmailHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void ProcessNotification(EmailNotificationViewModel config, BuyerVendorRequestResponse requestResponse, PodataUsa poData)
        {
            try
            {
                EmailObject mail = new EmailObject();
                System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage();
                MailAddressCollection toAddress = new MailAddressCollection();
                foreach (var email in config.Vendoremail.Trim().Split(','))
                {
                    toAddress.Add(new MailAddress(email));
                }
                MailAddressCollection ccAddress = new MailAddressCollection();
                var body = Regex.Replace(@"<html lang=""en"">
                            <head>
                                <meta charset=""UTF-8"">
                                <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                                    <title>Styled Page</title>
                            </head>
                            <body style=""font-family: Arial, sans-serif; margin: 0; padding: 0;"">

                                <!-- Header with gray background -->
                                <header style=""background-color: #808080; color: #fff; padding: 2px;"">
                                <img src=cid:NYXLogo alt=""Logo"" style=""max-width: 120px; max-height: 120px; margin-left: 5px;"">
                                </header>

                            <!-- Body with styled text -->
                            <div style=""margin: 20px; padding: 20px; border: 1px solid #ddd;"">
                                <p>Hello @user,</p>
                                <p>For below Purchase Order information, Please provide your confirmation for @deliverydate @quantity @price.</p>
                                <p>
                                <table>
                                <tr>
                                <th style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">PO Number</th>
                                <th style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">PO Item Number</th>
                                <th style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">Part Description</th>
                                <th style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">Ship Qty</th>
                                <th style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">Promise Date</th>
                                <th style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">Buyer</th>
                                <th style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">Comments</th>
                                </tr>
                                 <tr>
                                <td style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">@ponumber</th>
                                <td style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">@partnumber</th>
                                <td style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">@partdescription</th>
                                <td style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">@shipqty</th>
                                <td style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">@promisedate</th>
                                <td style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">@buyer</th>
                                <td style=""border: 1px solid black; padding: 1px 1px 1px 1px;"">@comments</th>
                                </tr>
                                </table>
                                </p>
                                <p>To give the confirmation, please click @here followed by enter required values.</p>                               
                                <p>
                                Thanks<br />
                                Vendor Response Software
                                </p>
        
                            </div>

                            </body>
                            </html>
", "[\\r|\\n|\\t]", string.Empty);
                body = body.Replace("@user", config.Vendorname);
                body = body.Replace("@ponumber", poData.Po.ToString());
                body = body.Replace("@partnumber", poData.Poitem.ToString());
                body = body.Replace("@partdescription", poData.Desc1 + "<br />" + poData.Desc2 + "<br />" + poData.Desc3 + "<br />" + poData.Desc4 + "<br />" + poData.Desc5);
                body = body.Replace("@shipqty", poData.Qtyorder.ToString());
                body = body.Replace("@promisedate", poData.Requiredate.ToString());
                body = body.Replace("@comments", config.Vendorcomments);
                var buyerName = string.Empty;
                if (!string.IsNullOrEmpty(poData.Buyer))
                {
                    buyerName = _context.Buyers.Where(b => b.Buyercode.ToLower() == poData.Buyer.ToLower()).Select(b => b.Buyername).FirstOrDefault();
                }
                body = body.Replace("@buyer", buyerName);
                if (config.Confirmeddeliverydate)
                {
                    body = body.Replace("@deliverydate", "Delivery Date,");
                }
                else
                {
                    body = body.Replace("@deliverydate", "");
                }
                if (config.Confirmedquantity)
                {
                    body = body.Replace("@quantity", "Quantity,");
                }
                else
                {
                    body = body.Replace("@quantity", "");
                }
                if (config.Confirmedprice)
                {
                    body = body.Replace("@price", "Price");
                }
                else
                {
                    body = body.Replace("@price", "");
                }
                requestResponse.Requestbody = body;
                _context.BuyerVendorRequestResponses.Add(requestResponse);
                _context.SaveChanges();
                var vendorResponseHTML = "<a   href='mailto:" + _configuration["Vendor_Email"] + "?Subject=Response is Required for PO : " + poData.Po + ", PO ItemNumber : " + poData.Poitem + ", Request : " + requestResponse.Id + "&amp;body=Please provide the confirmation below after each : %20%0A" +
                                                "==============================%20%0A" +
                                                (config.Confirmeddeliverydate ? "Delivery Date (MM/dd/YYYY) : %20%0A" : "") +
                                                (config.Confirmedquantity ? "Quantity (in numbers) : %20%0A" : "") +
                                                (config.Confirmedprice ? "Price (in decimals) : %20%0A" : "") +
                                                (config.Confirmedtrackingno ? "Shipment Tracking Number : %20%0A" : "") +
                                                "==============================%20%0A" +
                                                "Note: Please do not change the subject line and body text (Request : " + requestResponse.Id.ToString() + "))%20%0A" +
                                                "'>here</a>";
                body = body.Replace("@here", vendorResponseHTML);
                var subject = "PO Confirmation Required for ";
                subject += (config.Confirmeddeliverydate ? "Delivery Date" : "");
                subject += (config.Confirmedquantity ? " Quantity" : "");
                subject += (config.Confirmedprice ? " Price" : "");
                mail.Subject = subject;
                mail.body = body;
                AlternateView htmlView = AlternateView.CreateAlternateViewFromString(mail.body, null, MediaTypeNames.Text.Html);

                LinkedResource embeddedImage = new LinkedResource(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Images\\NYXLogo.jpg"), MediaTypeNames.Image.Jpeg);
                embeddedImage.ContentId = "NYXLogo";

                // Add the linked resource (embedded image) to the HTML view
                htmlView.LinkedResources.Add(embeddedImage);

                // Add the HTML view with embedded image to the MailMessage            
                message.Subject = mail.Subject;
                message.Body = mail.body;
                message.AlternateViews.Add(htmlView);
                message.From = new MailAddress(_configuration["Vendor_Email"]);
                toAddress.ForEach(_to =>
                {
                    message.To.Add(_to);
                });
                //message.To.Add("ashish.kumar@nyxinc.com");
                mail.MailCC = new List<string>() { "ashish.kumar@nyxinc.com" };
                foreach (string email in mail.MailCC)
                {
                    if (!string.IsNullOrEmpty(email))
                    {
                        message.CC.Add(email);
                    }
                }
                SmtpClient smtpClient = new SmtpClient(_configuration["SMTPSERVER"], Convert.ToInt32(_configuration["SMTPPORT"]));
                smtpClient.EnableSsl = false;
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential(_configuration["Vendor_Email"], _configuration["Vendor_password"]);
                smtpClient.Send(message);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
