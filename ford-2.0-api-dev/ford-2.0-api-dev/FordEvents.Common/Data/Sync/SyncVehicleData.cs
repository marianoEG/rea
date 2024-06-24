using FordEvents.Common.Data.Vehicle;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncVehicleData : BaseData
    {
        public string Type { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public bool? Deleted { get; set; }

        public List<SyncFeaturesGroupDeepData> FeaturesGroups { get; set; }
        public List<SyncVehicleImageData> Images { get; set; }
        public List<SyncVehicleColorData> Colors { get; set; }
        public List<SyncVehicleVersionData> Versions { get; set; }
        public List<SyncVehicleAccessoryData> accessories { get; set; }
    }
}
