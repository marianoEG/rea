using FordEvents.API.Controllers;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Form;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FormController
    {
        private FormServices _formServices;

        public FormController(FormServices formServices)
        {
            _formServices = formServices;
        }


        [HttpGet, Route("testDrive/list")]
        public PagedList<TestDriveFormData> GetProvincesList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _formServices.GetTestDriveFormsList(pageNumber, pageSize, searchText);
        }

        [HttpGet, Route("testDrive/{testDriveFormId}")]
        public TestDriveFormData GetTestDriveById(long testDriveFormId)
        {
            return _formServices.GetTestDriveForm(testDriveFormId);
        }


        [HttpGet, Route("quote/list")]
        public PagedList<QuoteFormData> GetQuoteFormsList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _formServices.GetQuoteFormsList(pageNumber, pageSize, searchText);
        }

        [HttpGet, Route("quote/{quoteFormId}")]
        public QuoteFormData GetQuoteFormById(long quoteFormId)
        {
            return _formServices.GetQuoteForm(quoteFormId);
        }

        [HttpGet, Route("newsletter/list")]
        public PagedList<NewsletterFormData> GetNewsletterFormsList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _formServices.GetNewsletterFormsList(pageNumber, pageSize, searchText);
        }

        [HttpGet, Route("newsletter/{newsletterFormId}")]
        public NewsletterFormData GetNewsletterFormById(long newsletterFormId)
        {
            return _formServices.GetNewsletterForm(newsletterFormId);
        }

    }
}
