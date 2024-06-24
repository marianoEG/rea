
using FordEvents.API.Controllers;
using FordEvents.Common.Data.TermsAndConditions;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TermsAndConditionsController: BaseController
    {
        private TermsAndConditionsServices _termsAndConditionsServices;

        public TermsAndConditionsController(TermsAndConditionsServices termsAndConditionsServices)
        {
            this._termsAndConditionsServices = termsAndConditionsServices;
        }

        [HttpGet, Route("latest")]
        public TermsAndConditionsData GetLatestTermsAndConditions()
        {
            return _termsAndConditionsServices.GetLastestTermsAndConditions(); ;
        }

        [HttpPost, Route("")]
        public TermsAndConditionsData CreateEvent([FromBody] TermsAndConditionsData termsData)
        {
            return _termsAndConditionsServices.CreateTermsAndConditions(termsData);
        }

    }
}
