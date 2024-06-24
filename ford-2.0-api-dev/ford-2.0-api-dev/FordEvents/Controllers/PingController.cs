using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FordEvents.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PingController : BaseController
    {
        public PingController() { }

        [AllowAnonymous]
        [HttpGet]
        public string Ping()
        {
            return "Pong";
        }
    }
}
