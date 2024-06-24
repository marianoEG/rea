using FordEvents.Common.Data.Vehicle;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncFeaturesGroupDeepData : FeaturesGroupDeepData
    {
        public bool? Deleted { get; set; }
    }
}
