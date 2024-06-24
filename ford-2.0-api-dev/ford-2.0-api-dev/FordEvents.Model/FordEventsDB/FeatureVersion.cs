using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class FeatureVersion
    {
        public long Id { get; set; }
        public long VersionId { get; set; }
        public long FeatureId { get; set; }
        public string Value { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual Feature Feature { get; set; }
        public virtual Version Version { get; set; }
    }
}
