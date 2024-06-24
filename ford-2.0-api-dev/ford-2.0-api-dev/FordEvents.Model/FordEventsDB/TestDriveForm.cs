using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class TestDriveForm
    {
        public long Id { get; set; }
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
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual Event Event { get; set; }
        public virtual Vehicle Vehicle { get; set; }
    }
}
