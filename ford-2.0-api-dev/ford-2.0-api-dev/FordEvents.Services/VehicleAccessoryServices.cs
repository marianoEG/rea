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
    public class VehicleAccessoryServices : BaseServices
    {
        public VehicleAccessoryServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public VehicleAccessoryData CreateVehicleAccessory(VehicleAccessoryData vehicleAccessoryData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Vehicle vehicle = context.GetVehicleById(vehicleAccessoryData.VehicleId);
                VehicleAccessory accessory = vehicle.CreateAccessory(vehicleAccessoryData);

                context.SaveChanges();

                return accessory.ToData<VehicleAccessoryData>();
            }

        }

        public VehicleAccessoryData EditVehicleAccessory(VehicleAccessoryData vehicleAccessoryData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Vehicle vehicle = context.GetVehicleById(vehicleAccessoryData.VehicleId);
                VehicleAccessory accessory = vehicle.EditAccessory(vehicleAccessoryData);

                context.SaveChanges();

                return accessory.ToData<VehicleAccessoryData>();
            }

        }

        public PagedList<VehicleAccessoryData> GetVehicleAccessoryList(long vehicleId, int? pageNumber, int? pageSize, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Vehicle vehicle = context.GetVehicleById(vehicleId);               

                PagedList<VehicleAccessory> accesoryList = vehicle.GetAccessories(pageNumber, pageSize, searchText);

                PagedList<VehicleAccessoryData> result = new PagedList<VehicleAccessoryData>();
                result.ListOfEntities = accesoryList.ListOfEntities.ToList<object>().ToDataList<VehicleAccessoryData>();
                result.CurrentPage = accesoryList.CurrentPage;
                result.PageSize = accesoryList.PageSize;
                result.TotalItems = accesoryList.TotalItems;
                return result;
            }
        }

        public VehicleAccessoryData GetVehicleAccessory(long vehicleId, long accessoryId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Vehicle vehicle = context.GetVehicleById(vehicleId);

                return vehicle.GetAccessoryById(accessoryId)
                    .ToData<VehicleAccessoryData>();
            }
        }

        public void DeleteVehicleAccessory(long vehicleId, long accessoryId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Vehicle vehicle = context.GetVehicleById(vehicleId);
                vehicle.DeleteAccessory(accessoryId);
                context.SaveChanges();

            }
        }
    }
       
}
