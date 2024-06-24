using FordEvents.Common.Data;
using FordEvents.Common.Data.Form;
using FordEvents.Common.Data.Province;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using FordEvents.Model.FordEventsDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Services
{
    public class FormServices : BaseServices
    {
        public FormServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public PagedList<QuoteFormData> GetQuoteFormsList(int? pageNumber, int? pageSize, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<QuoteForm> query = context.QuoteForms
                    .Where(x =>
                        !x.Deleted
                        &&
                        (x.Firstname.ToLower().Contains(filter))
                    );

                PagedList<QuoteFormData> result = new PagedList<QuoteFormData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<QuoteFormData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return result;
            }
        }

        public QuoteFormData GetQuoteForm(long quoteFormId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                return context.GetQuoteFormById(quoteFormId)
                    .ToData<QuoteFormData>();
            }
        }

        public PagedList<TestDriveFormData> GetTestDriveFormsList(int? pageNumber, int? pageSize, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<TestDriveForm> query = context.TestDriveForms
                    .Where(x =>
                        !x.Deleted
                        &&
                        (x.Firstname.ToLower().Contains(filter))
                    );

                PagedList<TestDriveFormData> result = new PagedList<TestDriveFormData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<TestDriveFormData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return result;
            }
        }

        public TestDriveFormData GetTestDriveForm(long testDriveFormId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                return context.GetTestDriveFormById(testDriveFormId)
                    .ToData<TestDriveFormData>();
            }
        }

        public PagedList<NewsletterFormData> GetNewsletterFormsList(int? pageNumber, int? pageSize, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<NewsletterForm> query = context.NewsletterForms
                    .Where(x =>
                        !x.Deleted
                        &&
                        (x.Firstname.ToLower().Contains(filter))
                    );

                PagedList<NewsletterFormData> result = new PagedList<NewsletterFormData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<NewsletterFormData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return result;
            }
        }

        public NewsletterFormData GetNewsletterForm(long newsletterFormId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                return context.GetNewsletterFormById(newsletterFormId)
                    .ToData<NewsletterFormData>();
            }
        }

    }
}