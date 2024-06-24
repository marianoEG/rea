using FordEvents.API.Controllers;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Dealership;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Data.Province;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProvinceController : BaseController
    {
        private ProvinceServices _provinceServices;

        public ProvinceController(ProvinceServices provinceServices)
        {
            _provinceServices = provinceServices;
        }

      
        [HttpGet, Route("list")]
        public List<ProvinceData> GetProvincesList()
        {
            return _provinceServices.GetProvincesList();
        }
    }
}
