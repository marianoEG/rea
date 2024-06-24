using FordEvents.API.Controllers;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Dealership;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Data.City;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CityController : BaseController
    {
        private CityServices _cityServices;

        public CityController(CityServices CityServices)
        {
            _cityServices = CityServices;
        }

        [HttpGet, Route("list")]
        public List<CityData> GetCitiesList([FromQuery] long provinceId)
        {
            return _cityServices.GetCitiesList(provinceId);
        }
    }
}
