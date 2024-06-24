using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncVehicleVersionData : BaseData
    {
        public string Name { get; set; }
        public int? Price { get; set; }
        public string ModelYear { get; set; }
        public string Tma { get; set; }
        public string Seq { get; set; }
        public bool? PreLaunch { get; set; }
        public bool? Deleted { get; set; }
        public List<SyncFeatureVersionData> Features { get; set; }
    }
}
