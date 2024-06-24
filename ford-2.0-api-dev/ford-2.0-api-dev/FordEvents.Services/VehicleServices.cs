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
    public class VehicleServices : BaseServices
    {
        public VehicleServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public VehicleDeepData CreateVehicle(VehicleDeepData vehicleData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Vehicle vehicle = new Vehicle();
                vehicle.Name = vehicleData.Name;
                vehicle.Type = vehicleData.Type;
                vehicle.Image = vehicleData.Image;
                vehicle.Enabled = vehicleData.Enabled == true;

                if (vehicleData.FeaturesGroups != null)
                {
                    foreach (var featureGroup in vehicleData.FeaturesGroups)
                    {
                        vehicle.AddFeatureGroup(featureGroup);
                    }
                }

                if (vehicleData.Images != null)
                {
                    foreach (var image in vehicleData.Images)
                    {
                        vehicle.AddImage(image);
                    }
                }

                if (vehicleData.Colors != null)
                {
                    foreach (var color in vehicleData.Colors)
                    {
                        vehicle.AddColor(color);
                    }

                }

                vehicle.Validate();
                context.Vehicles.Add(vehicle);
                context.SaveChanges();

                return vehicle.ToData<VehicleDeepData>();
            }

        }

        public VehicleDeepData EditVehicle(VehicleDeepData vehicleData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Vehicle vehicle = context.GetVehicleById(vehicleData.Id);
                vehicle.Name = vehicleData.Name;
                vehicle.Type = vehicleData.Type;
                vehicle.Image = vehicleData.Image;
                vehicle.Enabled = vehicleData.Enabled == true;

                vehicle.UpdateFeatureGroups(vehicleData.FeaturesGroups);

                vehicle.DeleteAllImages();
                if (vehicleData.Images != null)
                {
                    foreach (var image in vehicleData.Images)
                    {
                        vehicle.AddImage(image);
                    }
                }

                vehicle.DeleteAllColors();
                if (vehicleData.Colors != null)
                {
                    foreach (var color in vehicleData.Colors)
                    {
                        vehicle.AddColor(color);
                    }

                }

                vehicle.Validate();
                context.SaveChanges();

                return vehicle.ToData<VehicleDeepData>();
            }

        }

        public PagedList<VehicleData> GetVehiclesList(int? pageNumber, int? pageSize, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<Vehicle> query = context.Vehicles
                    .Where(x =>
                        !x.Deleted
                        &&
                        (x.Name.ToLower().Contains(filter))
                    );

                PagedList<VehicleData> result = new PagedList<VehicleData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<VehicleData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return result;
            }
        }

        public VehicleDeepData GetVehicle(long vehicleId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                return context.GetVehicleById(vehicleId)
                    .ToData<VehicleDeepData>();
            }
        }

        public void DeleteVehicle(long vehicleId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                context.GetVehicleById(vehicleId).Destroy();
                context.SaveChanges();

            }
        }

        public string[] GetVehicleTypes()
        {
            return System.Enum.GetNames(typeof(VehicleTypesEnum));
        }

        public PagedList<FeatureData> GetVehicleFeaturesList(int? pageNumber, int? pageSize, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<Feature> query = context.Features
                    .Where(x =>
                        !x.Deleted
                        &&
                        (x.Name.ToLower().Contains(filter))
                    );

                PagedList<FeatureData> result = new PagedList<FeatureData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<FeatureData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return result;
            }
        }

        public PagedList<FeaturesGroupDeepData> GetVehicleFeatureGroupsList(long vehicleId, int? pageNumber, int? pageSize, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<FeaturesGroup> query = context.FeaturesGroups
                    .Where(x =>
                        !x.Deleted
                        &&
                        x.VehicleId == vehicleId
                        &&
                        (x.Name.ToLower().Contains(filter))
                    );

                PagedList<FeaturesGroupDeepData> result = new PagedList<FeaturesGroupDeepData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<FeaturesGroupDeepData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return result;
            }
        }
    }
}
