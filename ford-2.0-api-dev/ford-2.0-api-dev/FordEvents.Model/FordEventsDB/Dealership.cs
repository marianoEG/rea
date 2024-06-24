using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class Dealership
    {
        public Dealership()
        {
            QuoteForms = new HashSet<QuoteForm>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal? Lat { get; set; }
        public decimal? Long { get; set; }
        public long? ProvinceId { get; set; }
        public long? CityId { get; set; }
        public string StreetNameAndNumber { get; set; }
        public string PostalCode { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string DealerCode { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual City City { get; set; }
        public virtual Province Province { get; set; }
        public virtual ICollection<QuoteForm> QuoteForms { get; set; }
    }
}
