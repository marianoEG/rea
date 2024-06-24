using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Vehicle
{
    public class FeatureData: BaseData
    {
        public long FeatureGroupId { get; set; }
        public string Name { get; set; }
        public int? Order { get; set; }
    }
}
