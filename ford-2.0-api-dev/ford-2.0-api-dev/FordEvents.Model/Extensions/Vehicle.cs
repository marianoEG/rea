using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Vehicle;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using FordEvents.Common.Utils;

namespace FordEvents.Model.FordEventsDB
{
    public partial class Vehicle : IDestroyable
    {
        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Name))
                throw new BusinessLogicException(ExceptionCodeEnum.VEHICLE_NAME_REQUIRED);

            if (string.IsNullOrWhiteSpace(this.Type))
            {
                throw new BusinessLogicException(ExceptionCodeEnum.VEHICLE_TYPE_REQUIRED);
            } else 
            if (!EnumHelper.VehicleTypeMatch(this.Type))
            {
                throw new BusinessLogicException(ExceptionCodeEnum.INVALID_VEHICLE_TYPE);
            }

        }

        public void AddFeatureGroup(FeaturesGroupDeepData featuresGroup)
        {
            FeaturesGroup newFeaturesGroup = new FeaturesGroup();
            newFeaturesGroup.Name = featuresGroup.Name;
            newFeaturesGroup.Order = featuresGroup.Order;
            newFeaturesGroup.Vehicle = this;
            newFeaturesGroup.Validate();

            if (featuresGroup.Features != null) {
                foreach (var feature in featuresGroup.Features)
                {
                    newFeaturesGroup.AddFeature(feature);
                }
            }

            FEContext.CurrentContext.FeaturesGroups.Add(newFeaturesGroup);
        }

        public void DeleteAllFeaturesGroups()
        {      
            this.GetFeaturesGroups().ForEach(x => x.Destroy());
        }


        public void AddImage(VehicleImageData image)
        {
            VehicleImage newImage = new VehicleImage();
            newImage.VehicleImageUrl = image.VehicleImageUrl;
            newImage.Vehicle = this;

            FEContext.CurrentContext.VehicleImages.Add(newImage);
        }

        public void AddColor(VehicleColorData color)
        {
            VehicleColor newColor = new VehicleColor();
            newColor.ColorName = color.ColorName;
            newColor.ColorImageUrl = color.ColorImageUrl;
            newColor.VehicleImageUrl = color.VehicleImageUrl;
            newColor.Vehicle = this;

            FEContext.CurrentContext.VehicleColors.Add(newColor);
        }

        public void DeleteAllColors()
        {
            this.GetColors().ForEach(x => x.Destroy());
        }

        public void UpdateFeatureGroups(List<FeaturesGroupDeepData> featuresGroups)
        {
            List<FeaturesGroup> itemsToRemove = this.GetFeaturesGroups().Where(x1 => !featuresGroups.Any(x2 => x1.Id == x2.Id)).ToList();
            List<FeaturesGroup> itemsToUpdate = this.GetFeaturesGroups().Where(x1 => featuresGroups.Any(x2 => x1.Id == x2.Id)).ToList();
            List<FeaturesGroupDeepData> itemsToCreate = featuresGroups.Where(x1 => !this.GetFeaturesGroups().Any(x2 => x1.Id == x2.Id)).ToList();

            // Elimino los Items que ya no están más
            foreach (var item in itemsToRemove)
                item.Destroy();

            // Actualizo
            foreach (var item in itemsToUpdate)
            {
                FeaturesGroupDeepData data = featuresGroups.Where(x => x.Id == item.Id).FirstOrDefault();
                item.UpdateFeatureGroup(data);
            }

            // Creo los nuevos
            foreach (var itemData in itemsToCreate)
            {
                this.AddFeatureGroup(itemData);
            }
        }

        public void DeleteAllImages()
        {
            this.GetImages().ForEach(x => x.Destroy());
        }

        public List<FeaturesGroup> GetFeaturesGroups() { 
            return FEContext.CurrentContext.FeaturesGroups.Where(x => x.VehicleId == this.Id && !x.Deleted).ToList(); 
        }

        public Feature GetFeature(long? featureId)
        {
            Feature _feature = FEContext.CurrentContext.Features.SingleOrDefault(x => x.FeatureGroup.VehicleId == this.Id && x.Id == featureId && !x.Deleted);
            if (_feature == null)
                throw new BusinessLogicException(ExceptionCodeEnum.FEATURE_NOT_FOUND);
            return _feature;
        }

        public List<VehicleImage> GetImages()
        {
            return FEContext.CurrentContext.VehicleImages.Where(x => x.VehicleId == this.Id && !x.Deleted).ToList();
        }

        public List<VehicleColor> GetColors()
        {
            return FEContext.CurrentContext.VehicleColors.Where(x => x.VehicleId == this.Id && !x.Deleted).ToList();
        }

        #region Versions

        public List<Version> GetVersions()
        {
            return FEContext.CurrentContext.Versions.Where(x => x.VehicleId == this.Id && x.Enabled && !x.Deleted).ToList();
        }

        public PagedList<Version> GetVersions(int? pageNumber, int? pageSize, string searchText)
        {
            string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
            IQueryable<Version> query = FEContext.CurrentContext.Versions
                .Where(x =>
                    !x.Deleted
                    &&
                    x.VehicleId == this.Id
                    &&
                    (x.Name.ToLower().Contains(filter))
                );

            PagedList<Version> result = new PagedList<Version>();
            result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList();
            result.CurrentPage = pageNumber;
            result.PageSize = pageSize;
            result.TotalItems = query.Count();
            return result;
        }

        public Version GetVersion(long? versionId)
        {
            Version _version = FEContext.CurrentContext.Versions.Where(x => x.VehicleId == this.Id && x.Id == versionId && !x.Deleted).SingleOrDefault();
            if (_version == null)
                throw new BusinessLogicException(ExceptionCodeEnum.VERSION_NOT_FOUND);
            return _version;
        }

        public Version CreateVersion(VersionDeepData data)
        {
            Version version = new Version();
            version.Vehicle = this;
            version.Name = data.Name;
            version.Price = data.Price;
            version.Currency = data.Currency;
            version.ModelYear = data.ModelYear;
            version.Tma = data.Tma;
            version.Seq = data.Seq;
            version.PreLaunch = data.PreLaunch;
            version.Enabled = data.Enabled == true;

            if (data.FeatureVersions != null)
            {
                foreach (var featureVersion in data.FeatureVersions.Where(x => !string.IsNullOrWhiteSpace(x.Value)))
                    version.AddFeatureVersion(featureVersion);
            }

            version.Validate();
            this.Versions.Add(version);
            return version;
        }

        public Version EditVersion(VersionDeepData data)
        {
            Version version = this.GetVersion(data.Id);
            version.Name = data.Name;
            version.Price = data.Price;
            version.Currency = data.Currency;
            version.ModelYear = data.ModelYear;
            version.Tma = data.Tma;
            version.Seq = data.Seq;
            version.PreLaunch = data.PreLaunch;
            version.Enabled = data.Enabled == true;

            version.DeleteAllFeaturesGroups();
            if (data.FeatureVersions != null)
            {
                foreach (var featureVersion in data.FeatureVersions.Where(x => !string.IsNullOrWhiteSpace(x.Value)))
                    version.AddFeatureVersion(featureVersion);
            }

            version.Validate();
            return version;
        }

        #endregion

        #region Accessories

        public VehicleAccessory CreateAccessory(VehicleAccessoryData accessory) { 
            VehicleAccessory _accessory = new VehicleAccessory();
            _accessory.Name = accessory.Name;
            _accessory.Image = accessory.Image;
            _accessory.PartNumber = accessory.PartNumber;
            _accessory.ModelFor = accessory.ModelFor;
            _accessory.Observation = accessory.Observation;
            _accessory.Description = accessory.Description;
            _accessory.Vehicle = this;
            _accessory.Validate();
            this.VehicleAccessories.Add(_accessory);
            return _accessory;
        }

        public List<VehicleAccessory> GetAccessories()
        {
            return FEContext.CurrentContext.VehicleAccessories.Where(x => x.VehicleId == this.Id && !x.Deleted).ToList();
        }

        public PagedList<VehicleAccessory> GetAccessories(int? pageNumber, int? pageSize, string searchText)
        {
            string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
            IQueryable<VehicleAccessory> query = FEContext.CurrentContext.VehicleAccessories
                .Where(x =>
                    !x.Deleted
                    &&
                    x.VehicleId == this.Id
                    &&
                    (x.Name.ToLower().Contains(filter))
                );

            PagedList<VehicleAccessory> result = new PagedList<VehicleAccessory>();
            result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList();
            result.CurrentPage = pageNumber;
            result.PageSize = pageSize;
            result.TotalItems = query.Count();
            return result;
        }

        public VehicleAccessory GetAccessoryById(long? accessoryId) 
        {
            VehicleAccessory _accessory = FEContext.CurrentContext.VehicleAccessories.Where(x => x.VehicleId == this.Id && x.Id == accessoryId && !x.Deleted).SingleOrDefault();
            if (_accessory == null)
                throw new BusinessLogicException(ExceptionCodeEnum.VEHICLE_ACCESSORY_NOT_FOUND);
            return _accessory;

        }

        public VehicleAccessory EditAccessory(VehicleAccessoryData accessory)
        {
            VehicleAccessory _accessory = this.GetAccessoryById(accessory.Id);
            _accessory.Name = accessory.Name;
            _accessory.Image = accessory.Image;
            _accessory.PartNumber = accessory.PartNumber;
            _accessory.ModelFor = accessory.ModelFor;
            _accessory.Observation = accessory.Observation;
            _accessory.Description = accessory.Description;
            _accessory.Vehicle = this;
            _accessory.Validate();
            return _accessory;
        }

        public void DeleteAccessory(long accessoryId)
        {
            VehicleAccessory _accessory = this.GetAccessoryById(accessoryId);
            _accessory.Destroy();
        }

        #endregion
        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}
