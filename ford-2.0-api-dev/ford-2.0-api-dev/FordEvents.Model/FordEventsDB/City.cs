using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class City
    {
        public City()
        {
            Dealerships = new HashSet<Dealership>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public long ProvinceId { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual Province Province { get; set; }
        public virtual ICollection<Dealership> Dealerships { get; set; }
    }
}
