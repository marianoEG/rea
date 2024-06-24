using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Vehicle
{
    public class VehicleDeepData: VehicleData
    {
        public List<FeaturesGroupDeepData> FeaturesGroups { get; set; }
        public List<VehicleImageData> Images { get; set; }
        public List<VehicleColorData> Colors { get; set; }
    }
}
