
using FordEvents.Common;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.ApiClientInvoker
{
    public class CampaignApiInvoker : BaseInvoker
    {
        public CampaignApiInvoker(IHttpClientFactory clientFactory, ILogger<CampaignApiInvoker> logger) : base(clientFactory, logger)
        {
        }

        public List<string> GetCampaigns()
        {
            return Get<List<string>>(AppSettings.CampaignUrl, null, null);
        }
    }
}
