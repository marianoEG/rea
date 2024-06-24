using FordEvents.Common.Data;
using FordEvents.Common.Data.CampaignSearches;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using FordEvents.Model.FordEventsDB;
using System;
using System.Collections.Generic;
using System.Linq;

namespace FordEvents.Services
{
    public class CampaignSearchServices : BaseServices
    {
        public CampaignSearchServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public PagedList<CampaignSearchData> GetCampaignSearchList(int? pageNumber, int? pageSize, string searchText, long? eventId, DateTime? searchDateFrom, DateTime? searchDateTo)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<CampaignSearch> query = context.CampaignSearches
                    .Where(x =>
                        !x.Deleted
                        &&
                        (eventId == null || x.EventId == eventId)
                        &&
                        (searchDateFrom == null || x.SearchDate >= searchDateFrom)
                        &&
                        (searchDateTo == null || x.SearchDate <= searchDateTo)
                        &&
                        (x.SearchText.ToLower().Contains(filter))
                    );

                PagedList<CampaignSearchData> result = new PagedList<CampaignSearchData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<CampaignSearchData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return result;
            }
        }
    }
}
