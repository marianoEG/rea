using FordEvents.Common.Data;
using FordEvents.Common.Data.Province;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using FordEvents.Model.FordEventsDB;
using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Services
{
    public class ProvinceServices: BaseServices
    {
        public ProvinceServices(CurrentUserService currentUserService) : base(currentUserService) { }



        public List<ProvinceData> GetProvincesList()
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                IQueryable<Province> query = context.Provinces
                    .Where(x =>
                        !x.Deleted
                );

                return query.ToList<object>().ToDataList<ProvinceData>(); ;
            }
        }
    }
}
