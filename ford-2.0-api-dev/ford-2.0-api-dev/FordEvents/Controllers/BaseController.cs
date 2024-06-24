using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using FordEvents.API.ActionFilters;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using FordEvents.Common;

namespace FordEvents.API.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [ServiceFilter(typeof(LogActionFilter))]
    public class BaseController : ControllerBase
    {
    }
}
