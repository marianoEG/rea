using FordEvents.API.Controllers;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Dealership;
using FordEvents.Common.Data.Event;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DealershipController : BaseController
    {
        private DealershipServices _dealershipServices;
    
        public DealershipController(DealershipServices dealershipServices)
        {
            _dealershipServices = dealershipServices;
        }

      
        [HttpPost, Route("")]
        public DealershipData CreateDealership([FromBody] DealershipData dealershipData)
        {
            return _dealershipServices.CreateDealership(dealershipData);
        }

     
        [HttpGet, Route("list")]
        public PagedList<DealershipData> GetDealershipsList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText, [FromQuery] int? provinceId, [FromQuery] int? cityId)
        {
            return _dealershipServices.GetDealershipsList(pageNumber, pageSize, searchText, provinceId, cityId);
        }

   
        [HttpGet, Route("{dealershipId}")]
        public DealershipData GetDealershipById(long dealershipId)
        {
            return _dealershipServices.GetDealership(dealershipId);
        }

     
        [HttpPut, Route("")]
        public DealershipData EditEvent([FromBody] DealershipData dealershipData)
        {
            return _dealershipServices.EditDealership(dealershipData);
        }

    
        [HttpDelete, Route("{dealershipId}")]
        public void DeleteDealership(long dealershipId)
        {
            _dealershipServices.DeleteDealership(dealershipId);
        }

        [HttpDelete, Route("delete-all")]
        public void DeleteDealerships([FromQuery] string dealershipIds)
        {
            List<long> ids = dealershipIds
                .Split(',')
                .Where(x => long.TryParse(x, out _))
                .Select(long.Parse)
                .ToList();
            _dealershipServices.DeleteDealerships(ids);
        }

        [HttpPost, Route("import")]
        public void ImportDealershipList(IFormCollection data)
        {
            _dealershipServices.ImportDealershipList(data);
        }

    }
}
