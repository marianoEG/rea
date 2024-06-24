using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncFeatureVersionData
    {
        public long? FeatureId { get; set; }
        public string Value { get; set; }
        public bool? Deleted { get; set; }
    }
}
