using FordEvents.Common.Data;
using FordEvents.Common.Data.City;
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
    public class CityServices : BaseServices
    {
        public CityServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public List<CityData> GetCitiesList(long provinceId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                IQueryable<City> query = context.Cities
                    .Where(x =>
                        !x.Deleted
                        && 
                        (x.ProvinceId == provinceId)
                    );

                return query.ToList<object>().ToDataList<CityData>();
            }
        }
    }
}
