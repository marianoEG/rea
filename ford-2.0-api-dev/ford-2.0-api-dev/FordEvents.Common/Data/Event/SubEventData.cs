using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Event
{
    public class SubEventData : BaseData
    {
        public long? EventID { get; set; }
        public string Name { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public int? GuestNumber { get; set; }
        public bool? Enable { get; set; }
        public string Image { get; set; }
    }
}
