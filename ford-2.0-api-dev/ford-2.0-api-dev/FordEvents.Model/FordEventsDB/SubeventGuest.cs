using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class SubeventGuest
    {
        public long Id { get; set; }
        public long GuestId { get; set; }
        public long SubeventId { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual Guest Guest { get; set; }
        public virtual SubEvent Subevent { get; set; }
    }
}
