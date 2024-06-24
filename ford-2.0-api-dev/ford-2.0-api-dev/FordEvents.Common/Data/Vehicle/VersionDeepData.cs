using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Vehicle
{
    public class VersionDeepData: VersionData
    {
        public List<FeatureVersionData> FeatureVersions { get; set; }
    }
}
