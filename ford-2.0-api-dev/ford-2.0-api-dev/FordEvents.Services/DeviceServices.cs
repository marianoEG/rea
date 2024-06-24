using FordEvents.Common.Services;
using System.Collections.Generic;
using System.Linq;
using FordEvents.Common;
using System.IO;
using Microsoft.Extensions.Logging;
using FordEvents.Common.Data.Device;
using FordEvents.Model.FordEventsDB;
using FordEvents.Common.Data;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Enums;

namespace FordEvents.Services
{
    public class DeviceServices : BaseServices
    {
        private readonly ILogger<SyncServices> _logger;

        public DeviceServices(CurrentUserService currentUserService, ILogger<SyncServices> logger) : base(currentUserService)
        {
            _logger = logger;
        }

        public PagedList<DeviceData> GetDevices(int? pageNumber, int? pageSize)
        {
            if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

            using (var context = this.GetCurrentContext())
            {
                IQueryable<Device> query = context.Devices.Where(x => !x.Deleted );
                PagedList<DeviceData> result = new PagedList<DeviceData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<DeviceData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return result;
            }
        }

        public DeviceDeepData GetDevice(string uniqueId)
        {
            if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

            using (var context = this.GetCurrentContext())
            {
                return context.GetDeviceByUniqueId(uniqueId)
                    .ToData<DeviceDeepData>();
            }
        }

        public void deleteLogs(string uniqueId) 
        {
            if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

            using (var context = this.GetCurrentContext())
            {
                Device device = context.GetDeviceByUniqueId(uniqueId);
                device.DeleteAllLogs(this._currentUserService.GetUserId());
                context.SaveChanges();
            }
        }

        public void deleteErrors(string uniqueId)
        {
            if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

            using (var context = this.GetCurrentContext())
            {
                Device device = context.GetDeviceByUniqueId(uniqueId);
                device.DeleteAllErrors(this._currentUserService.GetUserId());
                context.SaveChanges();
            }
        }
    }
}
