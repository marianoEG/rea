using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class Vehicle
    {
        public Vehicle()
        {
            FeaturesGroups = new HashSet<FeaturesGroup>();
            QuoteForms = new HashSet<QuoteForm>();
            TestDriveForms = new HashSet<TestDriveForm>();
            VehicleAccessories = new HashSet<VehicleAccessory>();
            VehicleColors = new HashSet<VehicleColor>();
            VehicleImages = new HashSet<VehicleImage>();
            Versions = new HashSet<Version>();
        }

        public long Id { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public bool Enabled { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual ICollection<FeaturesGroup> FeaturesGroups { get; set; }
        public virtual ICollection<QuoteForm> QuoteForms { get; set; }
        public virtual ICollection<TestDriveForm> TestDriveForms { get; set; }
        public virtual ICollection<VehicleAccessory> VehicleAccessories { get; set; }
        public virtual ICollection<VehicleColor> VehicleColors { get; set; }
        public virtual ICollection<VehicleImage> VehicleImages { get; set; }
        public virtual ICollection<Version> Versions { get; set; }
    }
}
