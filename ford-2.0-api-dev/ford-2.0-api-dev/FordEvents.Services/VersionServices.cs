using FordEvents.Common.Data;
using FordEvents.Common.Data.Vehicle;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using FordEvents.Model.FordEventsDB;
using System.Collections.Generic;
using System.Linq;

namespace FordEvents.Services
{
    public class VersionServices : BaseServices
    {
        public VersionServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public PagedList<VersionData> GetVersionList(long vehicleId, int? pageNumber, int? pageSize, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Vehicle vehicle = context.GetVehicleById(vehicleId);
                PagedList<Version> versionsPage = vehicle.GetVersions(pageNumber, pageSize, searchText);

                PagedList<VersionData> result = new PagedList<VersionData>();
                result.ListOfEntities = versionsPage.ListOfEntities.ToList<object>().ToDataList<VersionData>();
                result.CurrentPage = versionsPage.CurrentPage;
                result.PageSize = versionsPage.PageSize;
                result.TotalItems = versionsPage.TotalItems;
                return result;
            }
        }

        public VersionDeepData GetVersion(long versionId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                return context.GetVersionById(versionId)
                    .ToData<VersionDeepData>();
            }
        }

        public VersionDeepData CreateVersion(VersionDeepData versionData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Vehicle vehicle = context.GetVehicleById(versionData.VehicleId);
                Version version = vehicle.CreateVersion(versionData);
                context.SaveChanges();
                return version.ToData<VersionDeepData>();
            }
        }

        public VersionDeepData EditVersion(VersionDeepData versionData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Vehicle vehicle = context.GetVehicleById(versionData.VehicleId);
                Version version = vehicle.EditVersion(versionData);
                context.SaveChanges();
                return version.ToData<VersionDeepData>();
            }
        }

        public void SetPreLaunch(long versionId, VersionPreLaunchData preLaunchData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Version version = context.GetVersionById(versionId);
                version.PreLaunch = preLaunchData.PreLaunch;

                context.SaveChanges();
            }
        }

        public void ChangePrice(long versionId, VersionPriceData data)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Version version = context.GetVersionById(versionId);
                version.Currency = data.Currency;
                version.Price = data.Price;

                context.SaveChanges();
            }
        }

        public void DeleteVersion(long versionId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                context.GetVersionById(versionId).Destroy();
                context.SaveChanges();
            }
        }
    }
}
