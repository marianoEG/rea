using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class Event
    {
        public Event()
        {
            CampaignSearches = new HashSet<CampaignSearch>();
            NewsletterForms = new HashSet<NewsletterForm>();
            QuoteForms = new HashSet<QuoteForm>();
            SubEvents = new HashSet<SubEvent>();
            TestDriveForms = new HashSet<TestDriveForm>();
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public bool Enable { get; set; }
        public string Image { get; set; }
        public bool? TestDriveDemarcationOwnerEnabled { get; set; }
        public bool? TestDriveDemarcationOwnerInCaravanEnabled { get; set; }
        public bool? TestDriveDemarcationFordEnabled { get; set; }
        public long? TestDriveFormsCount { get; set; }
        public long? TestDriveFormsQrcount { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual ICollection<CampaignSearch> CampaignSearches { get; set; }
        public virtual ICollection<NewsletterForm> NewsletterForms { get; set; }
        public virtual ICollection<QuoteForm> QuoteForms { get; set; }
        public virtual ICollection<SubEvent> SubEvents { get; set; }
        public virtual ICollection<TestDriveForm> TestDriveForms { get; set; }
    }
}
