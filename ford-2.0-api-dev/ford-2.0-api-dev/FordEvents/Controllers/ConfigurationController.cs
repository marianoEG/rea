
using FordEvents.API.Controllers;
using FordEvents.Common.Data.Configuration;
using FordEvents.Common.Data.TermsAndConditions;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConfigurationController : BaseController
    {
        private ConfigurationServices _configurationServices;

        public ConfigurationController(ConfigurationServices configurationServices)
        {
            this._configurationServices = configurationServices;
        }

     
        [HttpGet, Route("")]
        public List<ConfigurationData> GetConfigurations()
        {
            return _configurationServices.GetConfigurations();
        }

        [HttpPost, Route("")]
        public void RecieveConfigurations([FromBody] List<ConfigurationData> configurations)
        {
            _configurationServices.RecieveConfigurations(configurations);
        }

    }
}