using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncVehicleAccessoryData : BaseData
    {
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public string Observation { get; set; }
        public string PartNumber { get; set; }
        public string ModelFor { get; set; }
    }
}
