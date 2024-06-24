using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FordEvents.Common.Data.Vehicle;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using FordEvents.Common.Utils;

namespace FordEvents.Model.FordEventsDB
{
    public partial class Version : IDestroyable
    {
        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Name))
                throw new BusinessLogicException(ExceptionCodeEnum.VERSION_NAME_REQUIRED);

            if (this.Price == null)
                throw new BusinessLogicException(ExceptionCodeEnum.VERSION_PRICE_REQUIRED);

            if (this.Currency == null)
                throw new BusinessLogicException(ExceptionCodeEnum.VERSION_PRICE_CURRENCY_REQUIRED);
            else if (!EnumHelper.VersionCurrencyMatch(this.Currency))
            {
                throw new BusinessLogicException(ExceptionCodeEnum.INVALID_VERSION_PRICE_CURRENCY);
            }
        }

        public void AddFeatureVersion(FeatureVersionData featureVersion)
        {
            FeatureVersion newFeatureVersion = new FeatureVersion();
            newFeatureVersion.Version = this;
            newFeatureVersion.Value = featureVersion.Value;
            newFeatureVersion.Feature = this.Vehicle.GetFeature(featureVersion.FeatureId);
            newFeatureVersion.Validate();
            FEContext.CurrentContext.FeatureVersions.Add(newFeatureVersion);
        }

        public void DeleteAllFeaturesGroups()
        {
            this.GetFeaturesVersions().ForEach(x => x.Destroy());
        }

        public List<FeatureVersion> GetFeaturesVersions()
        {
            return FEContext.CurrentContext.FeatureVersions.Where(x => x.VersionId == this.Id && !x.Deleted && !x.Feature.Deleted).ToList();
        }

        public void Destroy()
        {
            this.Deleted = true;
            this.GetFeaturesVersions().ForEach(x => x.Destroy());
        }
    }
}