using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Form
{
    public class QuoteFormData : BaseData
    {
        public long EventId { get; set; }
        public long VehicleId { get; set; }
        public long? DealershipId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string DocumentType { get; set; }
        public string DocumentNumber { get; set; }
        public string Email { get; set; }
        public string PointOfSale { get; set; }
        public string PhoneArea1 { get; set; }
        public string Phone1 { get; set; }
        public string PhoneArea2 { get; set; }
        public string Phone2 { get; set; }
        public bool RecieveInformation { get; set; }
        public bool AcceptConditions { get; set; }

    }
}
