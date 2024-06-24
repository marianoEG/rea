using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class Feature
    {
        public Feature()
        {
            FeatureVersions = new HashSet<FeatureVersion>();
        }

        public long Id { get; set; }
        public long FeatureGroupId { get; set; }
        public string Name { get; set; }
        public int? Order { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual FeaturesGroup FeatureGroup { get; set; }
        public virtual ICollection<FeatureVersion> FeatureVersions { get; set; }
    }
}
