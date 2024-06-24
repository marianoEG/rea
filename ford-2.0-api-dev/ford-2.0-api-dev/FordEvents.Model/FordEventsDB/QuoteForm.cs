using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class QuoteForm
    {
        public long Id { get; set; }
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
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual Dealership Dealership { get; set; }
        public virtual Event Event { get; set; }
        public virtual Vehicle Vehicle { get; set; }
    }
}
