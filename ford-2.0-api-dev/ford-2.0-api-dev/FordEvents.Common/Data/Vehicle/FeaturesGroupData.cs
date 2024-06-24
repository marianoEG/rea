using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Vehicle
{
    public class FeaturesGroupData : BaseData
    {
        public long VehicleId { get; set; }
        public string Name { get; set; }
        public int? Order { get; set; }
    }
}
