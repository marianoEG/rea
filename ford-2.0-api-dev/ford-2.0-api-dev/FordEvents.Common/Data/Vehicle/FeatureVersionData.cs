using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Vehicle
{
    public class FeatureVersionData: BaseData
    {
        public long VersionId { get; set; }
        public long FeatureId { get; set; }
        public string Value { get; set; }
    }
}
