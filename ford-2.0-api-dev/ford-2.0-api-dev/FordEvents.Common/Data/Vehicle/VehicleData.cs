using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Vehicle
{
    public class VehicleData: BaseData
    {
        public string Type { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public bool? Enabled { get; set; }

    }
}
