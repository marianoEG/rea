using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FordEvents.Common.Data.Vehicle;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;

namespace FordEvents.Model.FordEventsDB
{
    public partial class FeaturesGroup : IDestroyable
    {
        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Name))
                throw new BusinessLogicException(ExceptionCodeEnum.FEATURES_GROUP_NAME_REQUIRED);

        }

        public void AddFeature(FeatureData feature) 
        {
            Feature newFeature = new Feature();
            newFeature.Name = feature.Name;
            newFeature.Order = feature.Order;
            newFeature.FeatureGroup = this;
            FEContext.CurrentContext.Features.Add(newFeature);
        }

        public void DeleteAllFeatures()
        {
            this.GetFeatures().ForEach(x => x.Destroy());
        }

        public List<Feature> GetFeatures()
        {
            return FEContext.CurrentContext.Features.Where(x => x.FeatureGroupId == this.Id && !x.Deleted).ToList();
        }

        public void UpdateFeatureGroup(FeaturesGroupDeepData data)
        {
            this.Name = data.Name;
            this.Order = data.Order;

            List<Feature> itemsToRemove = this.GetFeatures().Where(x1 => !data.Features.Any(x2 => x1.Id == x2.Id)).ToList();
            List<Feature> itemsToUpdate = this.GetFeatures().Where(x1 => data.Features.Any(x2 => x1.Id == x2.Id)).ToList();
            List<FeatureData> itemsToCreate = data.Features.Where(x1 => !this.GetFeatures().Any(x2 => x1.Id == x2.Id)).ToList();

            // Elimino los Items que ya no están más
            foreach (var item in itemsToRemove)
                item.Destroy();

            // Actualizo
            foreach (var item in itemsToUpdate)
            {
                FeatureData dataFeature = data.Features.Where(x => x.Id == item.Id).FirstOrDefault();
                item.Name = dataFeature.Name;
                item.Order = dataFeature.Order;
            }

            // Creo los nuevos
            foreach (var itemData in itemsToCreate)
            {
                this.AddFeature(itemData);
            }
        }

        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}