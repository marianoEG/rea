using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncProvinceData:BaseData
    {
        public string Name { get; set; }
        public List<SyncCityData> cities { get; set; }
    }
}
