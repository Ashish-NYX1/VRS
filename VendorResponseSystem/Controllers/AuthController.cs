using VendorResponseSystem.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.DirectoryServices.ActiveDirectory;
using Microsoft.Extensions.Caching.Memory;
using System.DirectoryServices.Protocols;
using System.Net;
using System.Security.Cryptography.X509Certificates;

namespace VendorResponseSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMemoryCache _memoryCache;
        private readonly IConfiguration _configuration;
        public AuthController(IMemoryCache memoryCache, IConfiguration configuration)
        {
            _memoryCache = memoryCache;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (model.Username.IndexOf("@") > -1)
            {
                model.Username = model.Username.Split('@')[0];
            }
            UserModel user = AuthenticateUser(model.Username.ToLower(), model.Password);

            if (user != null)
            {
                _memoryCache.Set(model.Username, user, TimeSpan.FromHours(1)); 
                return Ok(user);
            }
            return Unauthorized();
        }

        private UserModel AuthenticateUser(string username, string password)
        {
            try
            {
                string ldapServer = _configuration["ADDomain"];
                int ldapPort = Convert.ToInt32(_configuration["ldapPort"]);
                LdapConnection connection = new LdapConnection(new LdapDirectoryIdentifier(ldapServer, ldapPort))
                {
                    AuthType = AuthType.Negotiate,
                    SessionOptions =
                    {
                        SecureSocketLayer = true,
                        ProtocolVersion = 3,
                        VerifyServerCertificate = new VerifyServerCertificateCallback(VerifyServerCertificate)

                    }
                };
                NetworkCredential credential = new NetworkCredential(username, password);
                connection.Credential = credential;
                connection.Bind();
                var userdetails = GetLoggedinUserDetails(username);
                return new UserModel
                {
                    UserName = username,
                    DisplayName = userdetails.DisplayName,
                    Description = userdetails.Description,
                    IsMemberOfVendorResponse = userdetails.IsMemberOfVendorResponse,
                    IsMemberOfVendorResponseAdmin = userdetails.IsMemberOfVendorResponseAdmin,
                    BuyerCodes = userdetails.BuyerCodes,
                };
            }
          catch (Exception)
            {
                return null;
            }

        }

        private static bool VerifyServerCertificate(LdapConnection connection, X509Certificate certificate)
        {
            X509Chain chain = new X509Chain();
            chain.ChainPolicy.RevocationMode = X509RevocationMode.Online;
            chain.ChainPolicy.RevocationFlag = X509RevocationFlag.EntireChain;
            chain.ChainPolicy.VerificationFlags = X509VerificationFlags.NoFlag;
            chain.ChainPolicy.VerificationTime = DateTime.Now;

            bool isValid = chain.Build(new X509Certificate2(certificate));

            foreach (X509ChainStatus status in chain.ChainStatus)
            {
                if (status.Status != X509ChainStatusFlags.NoError)
                {
                    isValid = false;
                }
            }

            return isValid;
        }


        private UserModel GetLoggedinUserDetails(string userName)
        {
            string domainName = "nyxinc.com";
            string groupName = "Domain Users";
            UserModel userDetails = null;

            using (PrincipalContext context = new PrincipalContext(ContextType.Domain, domainName))
            {
                UserPrincipal user = UserPrincipal.FindByIdentity(context, userName);
                if (user != null)
                {
                    DirectoryEntry de = (DirectoryEntry)user.GetUnderlyingObject();
                    userDetails = new UserModel
                    {
                        DisplayName = user.DisplayName,
                        Description = user.Description,
                        BuyerCodes = de.Properties["BuyerCode"].Value != null ? de.Properties["BuyerCode"].Value.ToString() : string.Empty
                    };


                    using (GroupPrincipal groupVendorResponse = GroupPrincipal.FindByIdentity(context, "nyxweb-VendorResponse"))
                    {
                        if (groupVendorResponse != null)
                        {
                            userDetails.IsMemberOfVendorResponse = groupVendorResponse.GetMembers(true).Contains(user);
                        }
                    }

                    using (GroupPrincipal groupVendorResponseAdmin = GroupPrincipal.FindByIdentity(context, "nyxweb-VendorResponseAdmin"))
                    {
                        if (groupVendorResponseAdmin != null)
                        {
                            userDetails.IsMemberOfVendorResponseAdmin = groupVendorResponseAdmin.GetMembers(true).Contains(user);
                        }
                    }
                    string buyerCodes = user.GetUnderlyingObject().ToString();
                }
            }

            return userDetails ?? new UserModel();
        }










    }
}
