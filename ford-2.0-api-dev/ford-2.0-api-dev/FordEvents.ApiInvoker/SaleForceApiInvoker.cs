
using FordEvents.Common;
using FordEvents.Common.Data.SaleForce;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;

namespace FordEvents.ApiClientInvoker
{
    public class SaleForceApiInvoker : BaseInvoker
    {
        public SaleForceApiInvoker(IHttpClientFactory clientFactory, ILogger<SaleForceApiInvoker> logger) : base(clientFactory, logger)
        {
        }

        public void SyncGuests(List<SaleForceGuestBody> guests)
        {
            _logger.LogInformation("Loggin To SaleForce");
            SaleForceOAuthResponse oAuth = DoOAuth();
            if(oAuth == null || oAuth.access_token == null)
                throw new BusinessLogicException(ExceptionCodeEnum.SALE_FORCE_LOGIN_ERROR);

            Dictionary<string, string> headers = new Dictionary<string, string>();
            headers.Add("Authorization", "Bearer " + oAuth.access_token);
            //headers.Add("Content-Type", "application/json");

            _logger.LogInformation("Synchronizing guest to SaleForce with token token: " + oAuth.access_token);
            Post(AppSettings.saleForceSyncGuestUrl, guests, headers);
        }

        public SaleForceOAuthResponse DoOAuth()
        {
            SaleForceOAuthBody body = new SaleForceOAuthBody()
            {
                grant_type = AppSettings.saleForceOAuthGrantType,
                client_id = AppSettings.saleForceOAuthClientId,
                client_secret = AppSettings.saleForceOAuthClientSecret,
                account_id = AppSettings.saleForceOAuthAccountId
            };
            Dictionary<string, string> headers = new Dictionary<string, string>();
            //headers.Add("Content-Type", "application/json");
            return Post<SaleForceOAuthResponse>(AppSettings.saleForceOAuthUrl, body, headers, null);
        }
    }
}
