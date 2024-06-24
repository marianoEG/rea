using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Form
{
    public class TestDriveFormData : BaseData
    {
        public long EventId { get; set; }
        public long VehicleId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public int? Age { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public DateTime? DateOfPurchase { get; set; }
        public string LicencePlate { get; set; }
        public string VehicleOfInterest { get; set; }
        public bool HasVehicle { get; set; }
        public bool Companions { get; set; }
        public bool RecieveInformation { get; set; }
        public bool AcceptConditions { get; set; }

    }
}
