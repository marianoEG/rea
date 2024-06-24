using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class FeaturesGroup
    {
        public FeaturesGroup()
        {
            Features = new HashSet<Feature>();
        }

        public long Id { get; set; }
        public long VehicleId { get; set; }
        public string Name { get; set; }
        public int? Order { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual Vehicle Vehicle { get; set; }
        public virtual ICollection<Feature> Features { get; set; }
    }
}
