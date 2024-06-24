using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class SubEvent
    {
        public SubEvent()
        {
            Guests = new HashSet<Guest>();
        }

        public long Id { get; set; }
        public long EventId { get; set; }
        public string Name { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public bool Enable { get; set; }
        public string Image { get; set; }
        public int? GuestNumber { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual Event Event { get; set; }
        public virtual ICollection<Guest> Guests { get; set; }
    }
}
