using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class Version
    {
        public Version()
        {
            FeatureVersions = new HashSet<FeatureVersion>();
            VersionAccessories = new HashSet<VersionAccessory>();
            VersionImages = new HashSet<VersionImage>();
        }

        public long Id { get; set; }
        public long VehicleId { get; set; }
        public string Name { get; set; }
        public string Currency { get; set; }
        public int? Price { get; set; }
        public string ModelYear { get; set; }
        public string Tma { get; set; }
        public string Seq { get; set; }
        public bool? PreLaunch { get; set; }
        public bool Enabled { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual Vehicle Vehicle { get; set; }
        public virtual ICollection<FeatureVersion> FeatureVersions { get; set; }
        public virtual ICollection<VersionAccessory> VersionAccessories { get; set; }
        public virtual ICollection<VersionImage> VersionImages { get; set; }
    }
}
