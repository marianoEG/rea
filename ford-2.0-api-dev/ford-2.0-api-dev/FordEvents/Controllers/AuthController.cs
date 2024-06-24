using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FordEvents.Common.Data;
using FordEvents.Services;
using FordEvents.ApiClientInvoker;

namespace FordEvents.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : BaseController
    {
        private AuthServices _authServices;
        private SaleForceApiInvoker _saleForceApiInvoker;

        public AuthController(AuthServices authServices, SaleForceApiInvoker saleForceApiInvoker)
        {
            _authServices = authServices;
            _saleForceApiInvoker = saleForceApiInvoker;
        }

        [AllowAnonymous]
        [HttpPost, Route("login")]
        public SessionDeepData Login([FromBody] LoginBodyData loginData)
        {
            return _authServices.Login(loginData);
        }

        [AllowAnonymous]
        [HttpGet, Route("salesforce/login")]
        public object SalesforceLogin()
        {
            return _saleForceApiInvoker.DoOAuth();
        }
    }
}
