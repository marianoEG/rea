using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncDealershipData : BaseData
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal? Lat { get; set; }
        public decimal? Long { get; set; }
        public long? ProvinceId { get; set; }
        public long? CityId { get; set; }
        public string ProvinceName { get; set; }
        public string CityName { get; set; }
        public string StreetNameAndNumber { get; set; }
        public string PostalCode { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string DealerCode { get; set; }
        public bool? Deleted { get; set; }
    }
}
